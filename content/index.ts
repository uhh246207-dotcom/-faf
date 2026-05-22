import { siteZh } from './site.zh';
import { siteEn } from './site.en';
import { siteVi } from './site.vi';
import type { SiteContent } from './types';

export type Locale = 'zh' | 'en' | 'vi';

export function getSiteContent(locale: string): SiteContent {
  switch (locale) {
    case 'en':
      return siteEn;
    case 'vi':
      return siteVi;
    case 'zh':
    default:
      return siteZh;
  }
}

export type { SiteContent };
export * from './types';
