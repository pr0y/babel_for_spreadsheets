import { Language } from './types';

export const sourceLanguages: Language[] = [
  { code: 'auto', label: 'Auto-detect', icon: '✦' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文 (Chinese)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'ko', label: '한국어 (Korean)' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
  { code: 'th', label: 'ไทย (Thai)' },
  { code: 'de', label: 'Deutsch (German)' },
  { code: 'fr', label: 'Français (French)' },
  { code: 'es', label: 'Español (Spanish)' },
  { code: 'pt', label: 'Português (Portuguese)' },
  { code: 'ru', label: 'Русский (Russian)' },
  { code: 'it', label: 'Italiano (Italian)' },
];

export const targetLanguages: Language[] = sourceLanguages.filter(
  (lang) => lang.code !== 'auto'
);
