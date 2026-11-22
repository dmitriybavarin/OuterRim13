import { useBackend } from './backend';
import { translate } from './translate';

export { translate };

type Arguments = Record<string, string | number>;

export function useT() {
  const { config } = useBackend<Record<string, never>>();
  const language = config?.language;
  return (key: string, args?: Arguments, fallback?: string) =>
    translate(language, key, args, fallback);
}

const JOB_SLUG_ALIASES: Record<string, string> = {
  'Представитель NanoTrasen': 'nanotrasen_representative',
  'Офицер Синий Щит': 'blueshield',
  'Офицер Специальных Операций': 'special_operations_officer',
  'Директор Специальных Операций': 'special_operations_director',
};

export function jobKey(name: string, suffix: string): string {
  const slug = JOB_SLUG_ALIASES[name] ?? name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `job-${slug}-${suffix}`;
}

export function departmentKey(name: string): string {
  return jobKey(name, '').replace(/^job-/, 'job-department-').replace(/-$/, '');
}

export function useNumber(key: string, fallback: number): number {
  const t = useT();
  const value = Number(t(key, {}, String(fallback)));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function adminVerbKey(name: string): string {
  return `adminverb-${slugify(name)}-name`;
}

export function adminVerbCategoryKey(name: string): string {
  return `adminverb-category-${slugify(name)}`;
}

export function accessKey(name: string): string {
  return `access-${slugify(name)}`;
}

export function accessRegionKey(name: string): string {
  return `access-region-${slugify(name)}`;
}

export function designKey(path: string, suffix = 'name'): string {
  const slug = slugify(path.replace(/^\/datum\/design\//, ''));
  return `design-${slug}-${suffix}`;
}

export function techwebNodeKey(path: string, suffix = 'name'): string {
  const slug = slugify(path.replace(/^\/datum\/techweb_node\//, ''));
  return `techweb-node-${slug}-${suffix}`;
}

export function useDesignName() {
  const t = useT();
  return (path: string | undefined, fallback: string) =>
    path ? t(designKey(path), {}, fallback) : fallback;
}

export function useNodeText() {
  const t = useT();
  return (path: string, suffix: 'name' | 'desc', fallback: string) =>
    t(techwebNodeKey(path, suffix), {}, fallback);
}

export function useCategoryName() {
  const t = useT();
  return (name: string) => t(`design-category-${slugify(name)}`, {}, name);
}

export function useCraftText() {
  const t = useT();
  return (text: string) => t(`crafting-text-${slugify(text)}`, {}, text);
}

export function useServerText() {
  const { config } = useBackend<Record<string, never>>();
  const language = config?.language;
  return (data: Record<string, any>, field: string): string =>
    (language && data[`${field}_${language}`]) ?? data[field] ?? '';
}
