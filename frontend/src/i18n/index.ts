import ta from './ta.json';
import en from './en.json';

export type Locale = 'ta' | 'en';

let currentLocale: Locale = 'ta';
const dictionaries: Record<Locale, Record<string, unknown>> = {
  ta: ta as Record<string, unknown>,
  en: en as Record<string, unknown>,
};

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Traverses an object using dot notation path (e.g. "home.target_exam_title")
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Translation function supporting dot-notation keys and parameter interpolation:
 * t('home.streak_card_title', { count: 7 }) -> "7 நாள் தொடர்ச்சி (7 Days Streak)"
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const primaryDict = dictionaries[currentLocale];
  let text = getNestedValue(primaryDict, key);

  // Fallback to alternate locale if missing
  if (text === undefined) {
    const fallbackLocale: Locale = currentLocale === 'ta' ? 'en' : 'ta';
    text = getNestedValue(dictionaries[fallbackLocale], key);
  }

  // If still not found, return the key itself
  if (text === undefined) {
    return key;
  }

  // Interpolate parameters {key}
  if (params) {
    Object.entries(params).forEach(([paramKey, val]) => {
      text = text?.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    });
  }

  return text;
}

export default { t, setLocale, getLocale };
