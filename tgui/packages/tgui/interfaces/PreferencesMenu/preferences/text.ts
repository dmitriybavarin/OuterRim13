import { slugify } from '../../../i18n';

type Translate = (
  key: string,
  args?: Record<string, string | number>,
  fallback?: string,
) => string;

export function featureKey(featureId: string): string {
  return `pref-${featureId.toLowerCase()}`;
}

export function featureName(
  t: Translate,
  featureId: string,
  fallback: string,
): string {
  return t(`${featureKey(featureId)}-name`, {}, fallback);
}

export function featureDescription(
  t: Translate,
  featureId: string,
  fallback?: string,
): string | undefined {
  if (!fallback) {
    return fallback;
  }
  return t(`${featureKey(featureId)}-desc`, {}, fallback);
}

export function choiceText(
  t: Translate,
  featureId: string,
  choice: string,
  fallback: string,
): string {
  const slug = slugify(String(choice));
  if (!slug) {
    return fallback;
  }
  const shared = t(`pref-value-${slug}`, {}, fallback);
  return t(`${featureKey(featureId)}-value-${slug}`, {}, shared);
}
