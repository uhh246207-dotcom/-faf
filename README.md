# xfein

A modern game top-up + visual design store. Pivot of the original 11AI clone
into a one-stop shop for **game top-ups** (Roblox, Liên Quân, Free Fire,
Play Together, LoL, FIFA, Genshin) and **design services** (logo, shop banner,
thumbnail, display banner, YouTube banner, icon packs).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS 3.4** with a full custom design-token layer + glass utilities
- **Framer Motion** for entrance + scroll animations
- **next-intl** for `zh` (default) and `en` locales
- **Radix UI Accordion** for the FAQ
- **Lucide React** icons + inline custom brand glyphs

## Pages

| Route | Description |
|---|---|
| `/zh` · `/en` | Homepage |
| `/zh/store` · `/en/store` | Store grid (filterable by category, sortable) |
| `/zh/store/[slug]` · `/en/store/[slug]` | Product detail / purchase page |

13 products are statically generated for each locale → **26 detail pages**.

## Run

```bash
npm install
npm run dev      # http://localhost:3000  (defaults to /zh)
npm run build    # production build, statically generates 33 pages
npm run start
```

## Project layout

```
app/
  [locale]/
    layout.tsx              # html, body, NextIntlClientProvider
    page.tsx                # Homepage composition
    not-found.tsx
    store/
      page.tsx              # Store banner + grid
      [slug]/
        page.tsx            # Product detail / purchase
  globals.css               # design tokens, glass utilities, hero mesh
  favicon.svg
components/
  Navbar.tsx                # Floating glass pill, scroll-state
  Hero.tsx                  # Glass eyebrow + shimmering gradient headline
  GameShowcase.tsx          # 7 game brand glass cards (Roblox, Liên Quân, …)
  DesignServices.tsx        # 6 design service glass cards
  ServiceCommitment.tsx
  HowItWorks.tsx
  FeaturedProducts.tsx      # Top 4 popular products
  FAQ.tsx
  CTABanner.tsx
  Footer.tsx
  brand-logos/index.tsx     # XfeinMark + GameBadge + 7 game glyphs
  store/
    StoreBanner.tsx         # Top banner with quick category chips
    StoreGrid.tsx           # Filter tabs + sort + grid
    ProductCard.tsx         # Glass product card with branded gradient hero
    ProductPurchasePanel.tsx# Variant selector + checkout buttons (client)
  ui/accordion.tsx
content/
  site.zh.ts / site.en.ts   # All UI copy
  products.ts               # 13 products with variants + highlights
  types.ts
  index.ts
i18n/
  routing.ts / request.ts
messages/
  zh.json / en.json
lib/
  animations.ts             # Framer Motion variants
  utils.ts                  # cn() helper
middleware.ts
tailwind.config.ts
```

## Catalogue

### Games (7)
Roblox · Liên Quân · Free Fire · Play Together · League of Legends · FIFA · Genshin Impact

### Design services (6)
Logo · Shop banner · Thumbnail · Display banner · YouTube banner · Icon packs

Each entry has 3–5 variants and a full purchase page at `/store/[slug]`.

## Design notes

- **Light mode pastel** — soft mesh gradient (lavender / sky-blue / pink)
  sits behind the hero. Calm white-space, premium boutique vibe.
- **Glass effect** is implemented via three reusable utilities (`.glass`,
  `.glass-strong`, `.glass-dark`) using `backdrop-filter: blur + saturate`.
  Hover state adds a subtle violet ring + glow (`.glass-hover-ring`).
- **Brand gradients** — each game has its own brand-inspired gradient
  applied to its badge and product hero (Roblox red-orange, Free Fire
  red-pink, Liên Quân gold, etc.). The overall layout stays calm; the
  brand colors pop on demand.
- **Accent gradient** `#7C3AED → #2563EB` is the global brand accent —
  used on primary CTAs, the headline gradient word, and the bottom CTA banner.

## Build verification

- ✓ `tsc --noEmit` clean
- ✓ `next build` succeeds
- ✓ 33 pages statically generated
