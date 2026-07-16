import { useLanguage } from '@/context/LanguageContext';
import { TR, TKey } from '@/data/translations';

export function useT() {
  const { lang } = useLanguage();
  return (key: TKey): string => TR[key][lang];
}
