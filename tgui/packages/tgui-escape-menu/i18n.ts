import { translate } from 'tgui/translate';

type Arguments = Record<string, string | number>;

export type Translator = (
  key: string,
  args?: Arguments,
  fallback?: string,
) => string;

export function makeT(language: string | undefined): Translator {
  return (key, args, fallback) => translate(language, key, args, fallback);
}
