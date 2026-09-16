import type { Dict } from './types';
import { nl } from './nl';
import { en } from './en';

export const defaultLang = 'nl' as const;

/** Adding a language means adding a dictionary here and nothing else. */
export const dictionaries = { nl, en } satisfies Record<string, Dict>;

export type Lang = keyof typeof dictionaries;

export const languages: { code: Lang; label: string; locale: string }[] = [
  { code: 'nl', label: 'NL', locale: 'nl-BE' },
  { code: 'en', label: 'EN', locale: 'en-GB' },
];

export const useTranslations = (lang: Lang): Dict => dictionaries[lang];

export const localeOf = (lang: Lang) =>
  languages.find((l) => l.code === lang)?.locale ?? 'nl-BE';

/** "/" for the default language, "/en/" for the rest. */
export const pathFor = (lang: Lang) => (lang === defaultLang ? '/' : `/${lang}/`);

/**
 * Renders a period from ISO year-month strings, localised.
 * An open end ("no end date") becomes "heden" / "present".
 */
export function formatPeriod(lang: Lang, start: string, end: string | null): string {
  const locale = localeOf(lang);
  const fmt = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
      new Date(year, month - 1, 1),
    );
  };
  const to = end ? fmt(end) : dictionaries[lang].ui.present;
  return `${fmt(start)} – ${to}`;
}
