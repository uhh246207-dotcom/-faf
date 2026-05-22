import type { Product } from './types';

/**
 * Catalogue used by:
 *  - the homepage "Featured" rail (filters by `popular` badge)
 *  - the /store grid (full catalogue, filterable by category)
 *  - the /store/[slug] purchase page (lookup by slug)
 *
 * Prices are in VND (₫). Each product also defines variants used
 * on the purchase page.
 */
export const products: Product[] = [
  /* -------------------- GAMES -------------------- */
  {
    slug: 'roblox-robux',
    category: 'games',
    brand: 'roblox',
    name: 'Roblox · Robux',
    tagline: 'Top up Robux instantly to your account',
    description:
      'Authorised Robux top-ups delivered straight to your Roblox account. No password required, instant credit on most denominations.',
    fromPrice: 22000,
    currency: '₫',
    badges: ['popular', 'sale'],
    variants: [
      { id: '80r', label: '80 Robux', price: 22000 },
      { id: '400r', label: '400 Robux', price: 99000, originalPrice: 119000 },
      { id: '800r', label: '800 Robux', price: 189000 },
      { id: '1700r', label: '1,700 Robux', price: 379000 },
      { id: '4500r', label: '4,500 Robux', price: 949000 },
    ],
    highlights: [
      'Delivered to your Roblox username — no login needed',
      'Average delivery time: 1–5 minutes',
      'Eligible for the monthly Premium bonus',
    ],
  },
  {
    slug: 'lienquan-quan-huy',
    category: 'games',
    brand: 'lienquan',
    name: 'Liên Quân · Quân Huy',
    tagline: 'Quân Huy / Vouchers for Arena of Valor',
    description:
      'Top up Quân Huy or buy event vouchers for Liên Quân Mobile. Authentic channel through Garena partners.',
    fromPrice: 18000,
    currency: '₫',
    badges: ['popular'],
    variants: [
      { id: '50qh', label: '50 Quân Huy', price: 18000 },
      { id: '250qh', label: '250 Quân Huy', price: 88000 },
      { id: '500qh', label: '500 Quân Huy', price: 175000 },
      { id: '1100qh', label: '1,100 Quân Huy', price: 379000 },
    ],
    highlights: [
      'Authorised Garena top-up channel',
      'Works with both Liên Quân and AOV regions',
      'Instant credit, no login required',
    ],
  },
  {
    slug: 'freefire-kim-cuong',
    category: 'games',
    brand: 'freefire',
    name: 'Free Fire · Kim Cương',
    tagline: 'Diamonds for Garena Free Fire',
    description:
      'Diamond top-ups for Free Fire delivered through the official Garena channel. Eligible for double-diamond events.',
    fromPrice: 19000,
    currency: '₫',
    badges: ['new', 'popular'],
    variants: [
      { id: '100d', label: '100 Kim Cương', price: 19000 },
      { id: '310d', label: '310 Kim Cương', price: 59000 },
      { id: '520d', label: '520 Kim Cương', price: 99000 },
      { id: '1060d', label: '1,060 Kim Cương', price: 199000 },
      { id: '2180d', label: '2,180 Kim Cương', price: 399000 },
    ],
    highlights: [
      'Eligible for Garena double-diamond promos',
      'Delivered to your player ID in minutes',
      'Region: VN / SEA',
    ],
  },
  {
    slug: 'play-together-stars',
    category: 'games',
    brand: 'playtogether',
    name: 'Play Together · Stars',
    tagline: 'Stars and gems top-up for Play Together',
    description:
      'Top up Stars and Gems for Play Together. Use them for outfits, parties and the Star Pass.',
    fromPrice: 25000,
    currency: '₫',
    badges: [],
    variants: [
      { id: '120s', label: '120 Stars', price: 25000 },
      { id: '650s', label: '650 Stars', price: 125000 },
      { id: '1300s', label: '1,300 Stars', price: 245000 },
      { id: '2700s', label: '2,700 Stars', price: 489000 },
    ],
    highlights: [
      'Delivered to your Play Together ID',
      'Works on Android, iOS and PC',
      'Credit usually arrives within minutes',
    ],
  },
  {
    slug: 'lol-rp',
    category: 'games',
    brand: 'lol',
    name: 'League of Legends · RP',
    tagline: 'Riot Points for League of Legends',
    description:
      'Top up Riot Points for the SEA / VN server. Delivered through authorised Garena resellers — instant credit.',
    fromPrice: 50000,
    currency: '₫',
    badges: ['popular'],
    variants: [
      { id: '120rp', label: '120 RP', price: 50000 },
      { id: '630rp', label: '630 RP', price: 250000 },
      { id: '1380rp', label: '1,380 RP', price: 525000 },
      { id: '2800rp', label: '2,800 RP', price: 999000 },
    ],
    highlights: [
      'Garena VN / SEA server only',
      'No password required',
      'Stackable with current Riot promotions',
    ],
  },
  {
    slug: 'fifa-fc-points',
    category: 'games',
    brand: 'fifa',
    name: 'FIFA / EA FC · FC Points',
    tagline: 'FC Points for EA Sports FC Mobile / Online',
    description:
      'Top up FC Points for EA Sports FC Mobile or PC. Delivered to your linked EA account through an authorised channel.',
    fromPrice: 49000,
    currency: '₫',
    badges: ['new'],
    variants: [
      { id: '100fc', label: '100 FC Points', price: 49000 },
      { id: '500fc', label: '500 FC Points', price: 229000 },
      { id: '1050fc', label: '1,050 FC Points', price: 459000 },
      { id: '2200fc', label: '2,200 FC Points', price: 949000 },
    ],
    highlights: [
      'Delivered to your linked EA account',
      'Works on FC Mobile and FC 25 PC',
      'Honours active Ultimate Team promotions',
    ],
  },
  {
    slug: 'genshin-genesis-crystals',
    category: 'games',
    brand: 'genshin',
    name: 'Genshin Impact · Genesis Crystals',
    tagline: 'Genesis Crystals for Genshin Impact',
    description:
      'Top up Genesis Crystals through the official HoYoverse top-up site. First-purchase bonus is preserved on every variant.',
    fromPrice: 19000,
    currency: '₫',
    badges: ['popular', 'sale'],
    variants: [
      { id: '60c', label: '60 Genesis Crystals', price: 19000 },
      { id: '300c', label: '300 Genesis Crystals', price: 89000, originalPrice: 119000 },
      { id: '980c', label: '980 Genesis Crystals', price: 279000 },
      { id: '1980c', label: '1,980 Genesis Crystals', price: 549000 },
      { id: '3280c', label: '3,280 Genesis Crystals', price: 919000 },
    ],
    highlights: [
      'Through the official HoYoverse top-up site',
      'First-purchase double bonus preserved',
      'Compatible with all servers',
    ],
  },
  {
    slug: 'valorant-points',
    category: 'games',
    brand: 'valorant',
    name: 'Valorant · VP',
    tagline: 'Valorant Points for Riot Valorant',
    description:
      'Top up Valorant Points (VP) through Riot\u2019s authorised channel. Use VP for skins, the battle pass, agent contracts and Radianite.',
    fromPrice: 50000,
    currency: '₫',
    badges: ['new', 'popular'],
    variants: [
      { id: '475vp', label: '475 VP', price: 50000 },
      { id: '1000vp', label: '1,000 VP', price: 105000 },
      { id: '2050vp', label: '2,050 VP', price: 215000 },
      { id: '3650vp', label: '3,650 VP', price: 369000 },
      { id: '5350vp', label: '5,350 VP', price: 519000 },
    ],
    highlights: [
      'Authorised Riot channel — SEA / VN region',
      'Use VP for skins, battle pass, agent contracts',
      'Delivered in minutes, no password required',
    ],
  },

  /* -------------------- DESIGN SERVICES -------------------- */
  {
    slug: 'logo-design',
    category: 'design',
    service: 'logo',
    name: 'Logo Design',
    tagline: 'Custom brand logo + source files',
    description:
      'Modern, on-brand logo crafted by senior designers. Includes 2 rounds of revision, source files (AI / SVG / PNG) and a mini brand sheet.',
    fromPrice: 690000,
    currency: '₫',
    badges: ['popular'],
    variants: [
      { id: 'starter', label: 'Starter — 2 concepts', price: 690000 },
      { id: 'standard', label: 'Standard — 3 concepts + revisions', price: 1290000 },
      { id: 'premium', label: 'Premium — 5 concepts + brand sheet', price: 2390000 },
    ],
    highlights: [
      'Source files: AI, SVG, PNG, PDF',
      '2 rounds of revision included',
      'Delivery: 3–5 days',
    ],
  },
  {
    slug: 'shop-banner',
    category: 'design',
    service: 'shop-banner',
    name: 'Shop Banner',
    tagline: 'Storefront / shop hero banners',
    description:
      'Eye-catching shop banners optimised for Shopee, TikTok Shop, Lazada and personal storefronts. Source PSD included.',
    fromPrice: 290000,
    currency: '₫',
    badges: ['new'],
    variants: [
      { id: 'single', label: '1 banner', price: 290000 },
      { id: 'pack3', label: 'Pack of 3 banners', price: 690000 },
      { id: 'pack5', label: 'Pack of 5 banners + cover', price: 990000 },
    ],
    highlights: [
      'Optimised dimensions for each marketplace',
      'Source PSD included',
      'Delivery: 1–2 days',
    ],
  },
  {
    slug: 'thumbnail-design',
    category: 'design',
    service: 'thumbnail',
    name: 'Thumbnail Design',
    tagline: 'Click-magnet thumbnails for video',
    description:
      'High-CTR YouTube / TikTok thumbnails with bold typography and clean composition. Tuned for mobile previews.',
    fromPrice: 99000,
    currency: '₫',
    badges: ['popular'],
    variants: [
      { id: 'single', label: '1 thumbnail', price: 99000 },
      { id: 'pack5', label: 'Pack of 5', price: 449000 },
      { id: 'pack10', label: 'Pack of 10', price: 799000 },
    ],
    highlights: [
      'Optimised for mobile preview',
      'Source PSD on Premium tier',
      'Delivery: same-day for single thumbnail',
    ],
  },
  {
    slug: 'display-banner',
    category: 'design',
    service: 'display-banner',
    name: 'Display Banner',
    tagline: 'Web banners for ads & landing pages',
    description:
      'Display ad banners for Google Ads, Meta Ads and landing pages. All sizes covered with consistent visual identity.',
    fromPrice: 199000,
    currency: '₫',
    badges: [],
    variants: [
      { id: 'single', label: '1 size, 1 design', price: 199000 },
      { id: 'pack6', label: '6 standard sizes', price: 690000 },
      { id: 'pack10', label: '10 sizes + animated GIF', price: 1190000 },
    ],
    highlights: [
      'All standard IAB sizes available',
      'Animated GIF on Premium tier',
      'Delivery: 1–3 days',
    ],
  },
  {
    slug: 'youtube-banner',
    category: 'design',
    service: 'youtube-banner',
    name: 'YouTube Banner',
    tagline: 'Channel art + matching avatar',
    description:
      'YouTube channel art (2560×1440) plus matching avatar and watermark. Ready for desktop, tablet and mobile safe areas.',
    fromPrice: 249000,
    currency: '₫',
    badges: ['new'],
    variants: [
      { id: 'banner', label: 'Banner only', price: 249000 },
      { id: 'banner-avatar', label: 'Banner + avatar', price: 379000 },
      { id: 'kit', label: 'Banner + avatar + watermark', price: 549000 },
    ],
    highlights: [
      'Safe-area aware (TV, desktop, mobile)',
      'Matching avatar + watermark',
      'Delivery: 1–2 days',
    ],
  },
  {
    slug: 'icon-pack',
    category: 'design',
    service: 'icons',
    name: 'Icon Pack',
    tagline: 'Custom icons for app or web',
    description:
      'Custom icon sets crafted to match your brand. Pixel-perfect, exported as SVG and PNG with light & dark variants.',
    fromPrice: 390000,
    currency: '₫',
    badges: [],
    variants: [
      { id: 'pack6', label: 'Pack of 6 icons', price: 390000 },
      { id: 'pack12', label: 'Pack of 12 icons', price: 690000 },
      { id: 'pack24', label: 'Pack of 24 icons', price: 1190000 },
    ],
    highlights: [
      'Pixel-perfect, dual stroke + filled',
      'SVG + PNG export, light & dark',
      'Delivery: 2–4 days',
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products
    .filter((p) => p.badges.includes('popular'))
    .slice(0, limit);
}
