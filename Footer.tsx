import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Zap,
  Star,
} from 'lucide-react';
import {
  Palette,
  ShoppingBag,
  Image as ImageIcon,
  Megaphone,
  Youtube,
  Grid3x3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getSiteContent } from '@/content';
import {
  products,
  getProductBySlug,
  getFeaturedProducts,
} from '@/content/products';
import type {
  DesignServiceKey,
  GameKey,
} from '@/content/types';
import { GameBadge, GAME_BRANDS } from '@/components/brand-logos';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { ProductPurchasePanel } from '@/components/store/ProductPurchasePanel';

const DESIGN_ICON: Record<DesignServiceKey, LucideIcon> = {
  logo: Palette,
  'shop-banner': ShoppingBag,
  thumbnail: ImageIcon,
  'display-banner': Megaphone,
  'youtube-banner': Youtube,
  icons: Grid3x3,
};

const DESIGN_THEME: Record<DesignServiceKey, { from: string; to: string }> = {
  logo: { from: '#A78BFA', to: '#7C3AED' },
  'shop-banner': { from: '#F472B6', to: '#EC4899' },
  thumbnail: { from: '#60A5FA', to: '#2563EB' },
  'display-banner': { from: '#34D399', to: '#0D9488' },
  'youtube-banner': { from: '#F87171', to: '#DC2626' },
  icons: { from: '#FBBF24', to: '#F97316' },
};

export async function generateStaticParams() {
  // Static-render every locale × slug combination
  const locales = ['zh', 'en'];
  return locales.flatMap((locale) =>
    products.map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const site = getSiteContent(locale);
  const t = await getTranslations('A11y');

  const isGame = product.category === 'games';
  const game =
    isGame && product.brand ? GAME_BRANDS[product.brand as GameKey] : null;
  const theme =
    !isGame && product.service ? DESIGN_THEME[product.service] : null;
  const DesignIcon =
    !isGame && product.service ? DESIGN_ICON[product.service] : null;

  const heroBg = game
    ? `linear-gradient(135deg, ${game.from} 0%, ${game.to} 100%)`
    : theme
      ? `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
      : 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)';

  const related = getFeaturedProducts(4).filter((p) => p.slug !== slug);

  return (
    <>
      <a href="#main" className="skip-link">
        {t('skipToContent')}
      </a>

      <Navbar brand={site.brand.name} nav={site.nav} />

      <main id="main" className="pt-32 md:pt-36">
        {/* Pastel mesh behind the hero */}
        <div className="hero-mesh" aria-hidden="true" />

        <div className="mx-auto max-w-content px-6">
          {/* Back */}
          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 text-[13px] text-fg-muted hover:text-accent-1 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {site.nav.store}
          </Link>

          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* Visual hero (sticky on desktop) */}
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-28 space-y-4">
                <div
                  className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-card-hover"
                  style={{ backgroundImage: heroBg }}
                >
                  {game?.image && (
                    <Image
                      src={game.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      className="object-cover"
                      priority
                      aria-hidden="true"
                    />
                  )}
                  {!game?.image && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute -top-16 -right-16 h-60 w-60 rounded-full bg-white/30 blur-3xl"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-20 -left-12 h-60 w-60 rounded-full bg-black/20 blur-3xl"
                      />
                      <div className="absolute inset-0 grid place-items-center">
                        {game && (
                          <game.glyph
                            className="h-44 w-44 text-white/95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                            aria-hidden="true"
                          />
                        )}
                        {DesignIcon && (
                          <DesignIcon
                            className="h-36 w-36 text-white/95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </>
                  )}
                  {game?.image && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
                    />
                  )}
                  {game && (
                    <span className="absolute top-5 left-5">
                      <GameBadge brand={product.brand as GameKey} size={48} />
                    </span>
                  )}
                </div>

                {/* Trust strip */}
                <div className="grid grid-cols-3 gap-3">
                  <TrustItem
                    icon={ShieldCheck}
                    label={isGame ? 'Authorised channel' : 'Source files included'}
                  />
                  <TrustItem
                    icon={Zap}
                    label={isGame ? 'Delivered in minutes' : 'On-time delivery'}
                  />
                  <TrustItem
                    icon={Star}
                    label={isGame ? '99% success rate' : '2 free revisions'}
                  />
                </div>
              </div>
            </div>

            {/* Purchase panel */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl glass-strong p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tightish text-fg leading-tight">
                  {product.name}
                </h1>
                <p className="mt-2 text-fg-body leading-7">{product.tagline}</p>

                <div className="mt-5 mb-6 h-px bg-border" />

                <ProductPurchasePanel
                  product={product}
                  primaryCta={site.store.primaryCta}
                  detailsCta={site.store.detailsCta}
                />

                <div className="mt-7">
                  <h2 className="text-[12px] font-semibold uppercase tracking-eyebrow text-fg-muted mb-3">
                    Highlights
                  </h2>
                  <ul className="space-y-2.5">
                    {product.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-[14.5px] leading-7 text-fg-body"
                      >
                        <Check
                          className="h-4 w-4 shrink-0 text-accent-1 mt-1.5"
                          aria-hidden="true"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mt-20 md:mt-28 max-w-[720px]">
            <h2 className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1 mb-3">
              About this product
            </h2>
            <p className="text-fg-body leading-8 text-[15.5px]">
              {product.description}
            </p>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-24 md:mt-32 pb-24 md:pb-32">
              <h2 className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1 mb-4">
                You may also like
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-fg tracking-tightish mb-10">
                More from {site.brand.name}
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.slice(0, 4).map((p) => (
                  <ProductCard key={p.slug} product={p} strings={site.store} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer brand={site.brand.name} data={site.footer} />
    </>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-2.5">
      <Icon className="h-4 w-4 text-accent-1 shrink-0" aria-hidden="true" />
      <span className="text-[12.5px] font-medium text-fg leading-tight">
        {label}
      </span>
    </div>
  );
}
