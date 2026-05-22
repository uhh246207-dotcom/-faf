/* ============================================================
   Brand & icon keys
   ============================================================ */
export type GameKey =
  | 'roblox'
  | 'lienquan'
  | 'freefire'
  | 'playtogether'
  | 'lol'
  | 'fifa'
  | 'genshin'
  | 'valorant';

export type DesignServiceKey =
  | 'logo'
  | 'shop-banner'
  | 'thumbnail'
  | 'display-banner'
  | 'youtube-banner'
  | 'icons';

export type IconKey = 'shield-check' | 'activity' | 'headphones';

/* ============================================================
   Homepage content
   ============================================================ */
export interface CommitmentItem {
  icon: IconKey;
  title: string;
  desc: string;
}

export interface HowStep {
  num: string;
  title: string;
  desc: string;
}

export interface DesignServiceCard {
  key: DesignServiceKey;
  title: string;
  desc: string;
  fromPrice: number;
  currency: string;
  cta: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SiteContent {
  brand: { name: string; tagline: string };
  nav: { home: string; store: string };
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlineGradient: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
    stats: { value: string; label: string }[];
  };
  gameShowcase: {
    eyebrow: string;
    heading: string;
    sub: string;
    seeAll: string;
  };
  designServices: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: DesignServiceCard[];
    seeAll: string;
  };
  showcase: {
    eyebrow: string;
    heading: string;
    sub: string;
    gamesLabel: string;
    designLabel: string;
    autoplayPlay: string;
    autoplayPause: string;
    prevLabel: string;
    nextLabel: string;
    highlightsLabel: string;
    seeAll: string;
  };
  serviceCommitment: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: CommitmentItem[];
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    sub: string;
    steps: HowStep[];
  };
  featured: {
    eyebrow: string;
    heading: string;
    sub: string;
    seeAll: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    sub: string;
    items: FaqItem[];
  };
  ctaBanner: { heading: string; sub: string; cta: string };
  footer: {
    tagline: string;
    columns: FooterColumn[];
    copyright: string;
  };
  store: {
    badgeNew: string;
    badgePopular: string;
    badgeSale: string;
    fromPrefix: string;
    perOrder: string;
    primaryCta: string;
    detailsCta: string;
    bannerEyebrow: string;
    bannerHeading: string;
    bannerSub: string;
    categoryAll: string;
    categoryGames: string;
    categoryDesign: string;
    sortLabel: string;
    sortNewest: string;
    sortPopular: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
  };
}

/* ============================================================
   Product catalogue
   ============================================================ */
export type ProductCategory = 'games' | 'design';

export type ProductBadge = 'new' | 'popular' | 'sale';

export interface Variant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  slug: string;
  category: ProductCategory;
  /** Game brand key when category === 'games' */
  brand?: GameKey;
  /** Design service key when category === 'design' */
  service?: DesignServiceKey;
  name: string;
  tagline: string;
  description: string;
  /** Lowest price shown on the card */
  fromPrice: number;
  currency: string;
  badges: ProductBadge[];
  /** Variants shown on the detail page */
  variants: Variant[];
  /** Hero highlights on the detail page */
  highlights: string[];
}
