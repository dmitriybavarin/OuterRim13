import en from './localization/en.json';
import ru from './localization/ru.json';

type Arguments = Record<string, string | number>;

type Part =
  | string
  | { variable: string }
  | { select: string; variants: Record<string, Part[]>; fallback: string };

const dictionaries: Record<string, Record<string, string>> = { en, ru };
const compiled: Record<string, Part[]> = {};

function findClose(text: string, open: number): number {
  let depth = 0;
  let quoted = false;
  for (let position = open; position < text.length; position++) {
    const character = text[position];
    if (quoted) {
      quoted = character !== '"';
      continue;
    }
    if (character === '"') {
      quoted = true;
    } else if (character === '{') {
      depth++;
    } else if (character === '}') {
      depth--;
      if (depth === 0) {
        return position;
      }
    }
  }
  return -1;
}

function parseExpression(expression: string): Part {
  if (expression.startsWith('"') && expression.endsWith('"')) {
    return expression.slice(1, -1);
  }
  const arrow = expression.indexOf('->');
  if (arrow !== -1) {
    const selector = expression.slice(0, arrow).trim().slice(1);
    const variants: Record<string, Part[]> = {};
    let fallback = '';
    for (const line of expression.slice(arrow + 2).split('\n')) {
      let trimmed = line.trim();
      const isDefault = trimmed.startsWith('*');
      if (isDefault) {
        trimmed = trimmed.slice(1);
      }
      if (!trimmed.startsWith('[')) {
        continue;
      }
      const end = trimmed.indexOf(']');
      const variantKey = trimmed.slice(1, end).toLowerCase();
      variants[variantKey] = parsePattern(trimmed.slice(end + 1).trim());
      if (isDefault) {
        fallback = variantKey;
      }
    }
    return { select: selector, variants, fallback };
  }
  return { variable: expression.replace(/^\$/, '') };
}

function parsePattern(text: string): Part[] {
  const parts: Part[] = [];
  let position = 0;
  while (position < text.length) {
    const open = text.indexOf('{', position);
    if (open === -1) {
      parts.push(text.slice(position));
      break;
    }
    if (open > position) {
      parts.push(text.slice(position, open));
    }
    const close = findClose(text, open);
    if (close === -1) {
      parts.push(text.slice(open));
      break;
    }
    parts.push(parseExpression(text.slice(open + 1, close).trim()));
    position = close + 1;
  }
  return parts;
}

function pluralCategory(language: string, value: number): string {
  if (language === 'ru') {
    if (!Number.isInteger(value)) {
      return 'other';
    }
    const last = value % 10;
    const lastTwo = value % 100;
    if (last === 1 && lastTwo !== 11) {
      return 'one';
    }
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
      return 'few';
    }
    return 'many';
  }
  return value === 1 ? 'one' : 'other';
}

function render(parts: Part[], args: Arguments, language: string): string {
  return parts
    .map((part) => {
      if (typeof part === 'string') {
        return part;
      }
      if ('variable' in part) {
        return String(args[part.variable] ?? '');
      }
      const value = String(args[part.select] ?? '').toLowerCase();
      let variant = part.variants[value];
      if (!variant && value !== '' && !Number.isNaN(Number(value))) {
        variant = part.variants[pluralCategory(language, Number(value))];
      }
      return render(variant ?? part.variants[part.fallback] ?? [], args, language);
    })
    .join('');
}

export function translate(
  language: string | undefined,
  key: string,
  args: Arguments = {},
  fallback?: string,
): string {
  const code = language && dictionaries[language] ? language : 'en';
  const template = dictionaries[code][key] ?? dictionaries.en[key];
  if (template === undefined) {
    return fallback ?? key;
  }
  const cacheKey = `${code}:${key}`;
  if (!compiled[cacheKey]) {
    compiled[cacheKey] = parsePattern(template);
  }
  return render(compiled[cacheKey], args, code);
}
