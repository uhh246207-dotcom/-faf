import { siteZh } from './site.zh';
import { siteEn } from './site.en';
import type { SiteContent } from './types';

export type Locale = 'zh' | 'en';

export function getSiteContent(locale: string): SiteContent {
  return locale === 'en' ? siteEn : siteZh;
}

export type { SiteContent };
export * from './types';
