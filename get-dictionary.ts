import type { Locale } from '@/i18n-config';
import 'server-only';

// We enumerate all dictionaries here for better type safety and to ensure
// they are bundled correctly.
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  tr: () => import('./dictionaries/tr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en();
