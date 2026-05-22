'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SVGProps,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Flame,
  Grid3x3,
  Image as ImageIcon,
  Megaphone,
  Palette,
  Pause,
  Play,
  ShoppingBag,
  Sparkles,
  Tag,
  Youtube,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  GAME_BRANDS,
  GAME_KEYS,
  GameBadge,
} from '@/components/brand-logos';
import { products } from '@/content/products';
import {
  fadeUp,
  inViewOnce,
  staggerParent,
} from '@/lib/animations';
import { cn } from '@/lib/utils';
import type {
  DesignServiceCard,
  DesignServiceKey,
  GameKey,
  Product,
  ProductBadge,
  SiteContent,
} from '@/content/types';

interface Props {
  data: SiteContent['showcase'];
  designItems: DesignServiceCard[];
  store: SiteContent['store'];
}

/* ============================================================
   Theming for design services (mirrors ProductCard / DesignServices
   so a service keeps the same visual language across the site)
   ============================================================ */
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

const BADGE_META: Record<
  ProductBadge,
  { icon: LucideIcon; classes: string; label: (s: SiteContent['store']) => string }
> = {
  new: {
    icon: Sparkles,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: (s) => s.badgeNew,
  },
  popular: {
    icon: Flame,
    classes: 'bg-violet-50 text-accent-1 border-violet-200',
    label: (s) => s.badgePopular,
  },
  sale: {
    icon: Tag,
    classes: 'bg-pink-50 text-pink-700 border-pink-200',
    label: (s) => s.badgeSale,
  },
};

/* ============================================================
   Unified showcase item shape
   ============================================================ */
type ShowcaseItem = {
  id: string;
  kind: 'game' | 'design';
  name: string;
  desc: string;
  product?: Product;
  fromPrice: number;
  currency: string;
  gradFrom: string;
  gradTo: string;
  /** present for `kind==='game'` */
  game?: {
    key: GameKey;
    Glyph: (p: SVGProps<SVGSVGElement>) => JSX.Element;
    image?: string;
  };
  /** present for `kind==='design'` */
  design?: { key: DesignServiceKey; Icon: LucideIcon };
  badges: ProductBadge[];
  highlights: string[];
};

const AUTOPLAY_MS = 6000;

export function BrandShowcase({ data, designItems, store }: Props) {
  /* ---------- Build items once ---------- */
  const items = useMemo<ShowcaseItem[]>(() => {
    const games: ShowcaseItem[] = GAME_KEYS.map((k) => {
      const brand = GAME_BRANDS[k];
      const product = products.find((p) => p.brand === k);
      return {
        id: `game-${k}`,
        kind: 'game',
        name: brand.name,
        desc: product?.tagline ?? '',
        product,
        fromPrice: product?.fromPrice ?? 0,
        currency: product?.currency ?? '₫',
        gradFrom: brand.from,
        gradTo: brand.to,
        game: { key: k, Glyph: brand.glyph, image: brand.image },
        badges: product?.badges ?? [],
        highlights: product?.highlights.slice(0, 3) ?? [],
      };
    });

    const design: ShowcaseItem[] = designItems.map((item) => {
      const product = products.find((p) => p.service === item.key);
      const theme = DESIGN_THEME[item.key];
      return {
        id: `design-${item.key}`,
        kind: 'design',
        name: item.title,
        desc: item.desc,
        product,
        fromPrice: item.fromPrice,
        currency: item.currency,
        gradFrom: theme.from,
        gradTo: theme.to,
        design: { key: item.key, Icon: DESIGN_ICON[item.key] },
        badges: product?.badges ?? [],
        highlights: product?.highlights.slice(0, 3) ?? [],
      };
    });

    return [...games, ...design];
  }, [designItems]);

  const games = items.filter((i) => i.kind === 'game');
  const designs = items.filter((i) => i.kind === 'design');

  /* ---------- Active state ---------- */
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const active = items[activeIndex] ?? items[0];

  const goTo = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const step = useCallback(
    (delta: number) => {
      const next = (activeIndex + delta + items.length) % items.length;
      setActiveId(items[next].id);
    },
    [activeIndex, items]
  );

  /* ---------- Autoplay tick (resets on activeId change) ---------- */
  useEffect(() => {
    if (!autoplay || paused) return;
    const t = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, paused, activeId, step]);

  /* ---------- Keyboard nav (when focus is within section) ---------- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [step]);

  /* ---------- Render ---------- */
  return (
    <section
      ref={sectionRef}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!sectionRef.current?.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        {/* Heading */}
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="text-[13px] font-semibold uppercase tracking-eyebrow text-accent-1 mb-4"
          >
            {data.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-bold text-fg tracking-tightish text-[clamp(32px,4vw,56px)] leading-[1.1]"
          >
            {data.heading}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-prose60 text-fg-body leading-7"
          >
            {data.sub}
          </motion.p>
        </motion.div>

        {/* Sidebar + banner */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          {/* ===================== Sidebar ===================== */}
          <aside
            aria-label={data.eyebrow}
            className="lg:col-span-4 xl:col-span-4"
          >
            <div className="rounded-3xl glass-strong shadow-card p-3 sm:p-4 lg:sticky lg:top-24">
              {/* Games group */}
              <SidebarGroup
                label={data.gamesLabel}
                count={games.length}
              >
                {games.map((item) => (
                  <SidebarRow
                    key={item.id}
                    item={item}
                    active={item.id === activeId}
                    fromPrefix={store.fromPrefix}
                    onSelect={() => goTo(item.id)}
                  />
                ))}
              </SidebarGroup>

              {/* Design group */}
              <SidebarGroup
                label={data.designLabel}
                count={designs.length}
                className="mt-2"
              >
                {designs.map((item) => (
                  <SidebarRow
                    key={item.id}
                    item={item}
                    active={item.id === activeId}
                    fromPrefix={store.fromPrefix}
                    onSelect={() => goTo(item.id)}
                  />
                ))}
              </SidebarGroup>

              {/* Toolbar — autoplay + prev/next + counter */}
              <div className="mt-3 flex items-center justify-between gap-2 px-1.5 pt-3 border-t border-border/70">
                <div className="flex items-center gap-1">
                  <IconButton
                    label={data.prevLabel}
                    onClick={() => step(-1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={data.nextLabel}
                    onClick={() => step(1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={autoplay ? data.autoplayPause : data.autoplayPlay}
                    onClick={() => setAutoplay((v) => !v)}
                    pressed={autoplay}
                  >
                    {autoplay ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </IconButton>
                </div>
                <span className="text-[12px] font-medium text-fg-muted tabular-nums pr-1">
                  {String(activeIndex + 1).padStart(2, '0')}
                  <span className="opacity-50"> / </span>
                  {String(items.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </aside>

          {/* ===================== Banner ===================== */}
          <div className="lg:col-span-8 xl:col-span-8">
            <div className="relative rounded-3xl glass-strong shadow-card overflow-hidden min-h-[460px]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="grid md:grid-cols-2"
                >
                  {/* Visual hero */}
                  <div
                    className="relative aspect-[16/12] md:aspect-auto md:min-h-[460px] overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${active.gradFrom} 0%, ${active.gradTo} 100%)`,
                    }}
                  >
                    {/* Brand image (overlays gradient when set) */}
                    {active.game?.image && (
                      <Image
                        src={active.game.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        priority
                        aria-hidden="true"
                      />
                    )}

                    {/* Decorations only when no image is set */}
                    {!active.game?.image && (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/30 blur-2xl"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-black/20 blur-2xl"
                        />
                        <span
                          aria-hidden="true"
                          className="holo-sheen absolute inset-0 opacity-60 mix-blend-soft-light"
                        />
                      </>
                    )}

                    {/* Centered glyph (hidden when image is set) */}
                    {!active.game?.image && (
                      <div className="absolute inset-0 grid place-items-center">
                        {active.game ? (
                          <active.game.Glyph
                            className="h-32 w-32 md:h-40 md:w-40 text-white/95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                            aria-hidden="true"
                          />
                        ) : active.design ? (
                          <active.design.Icon
                            className="h-24 w-24 md:h-32 md:w-32 text-white/95 drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    )}

                    {/* Subtle bottom gradient over image for legibility of pills */}
                    {active.game?.image && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"
                      />
                    )}

                    {/* Top-left pill: kind */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur px-3 h-7 text-[11.5px] font-semibold uppercase tracking-eyebrow text-fg">
                      {active.kind === 'game'
                        ? data.gamesLabel
                        : data.designLabel}
                    </div>

                    {/* Top-right product badges */}
                    {active.badges.length > 0 && (
                      <div className="absolute top-4 right-4 flex gap-1.5">
                        {active.badges.map((b) => {
                          const meta = BADGE_META[b];
                          const Icon = meta.icon;
                          return (
                            <span
                              key={b}
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full border px-2.5 h-6 text-[11px] font-semibold',
                                meta.classes
                              )}
                            >
                              <Icon className="h-3 w-3" aria-hidden="true" />
                              {meta.label(store)}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Bottom-left mini badge — game brand only */}
                    {active.game && (
                      <span className="absolute bottom-4 left-4">
                        <GameBadge
                          brand={active.game.key}
                          size={48}
                          rounded="2xl"
                        />
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="relative p-7 md:p-9 flex flex-col">
                    <h3 className="text-2xl md:text-[28px] font-bold tracking-tightish text-fg leading-tight">
                      {active.product?.name ?? active.name}
                    </h3>
                    <p className="mt-2 text-[14.5px] md:text-[15px] leading-7 text-fg-body">
                      {active.product?.description ?? active.desc}
                    </p>

                    {/* Highlights */}
                    {active.highlights.length > 0 && (
                      <div className="mt-6">
                        <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-fg-muted mb-3">
                          {data.highlightsLabel}
                        </p>
                        <ul className="space-y-2">
                          {active.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex items-start gap-2.5 text-[14px] text-fg-body leading-6"
                            >
                              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50 text-accent-1">
                                <Check className="h-3 w-3" />
                              </span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Price + CTAs */}
                    <div className="mt-auto pt-6 flex flex-wrap items-end gap-4 justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-eyebrow text-fg-muted">
                          {store.fromPrefix}
                        </p>
                        <p className="text-3xl font-bold tracking-tightish text-fg mt-0.5">
                          {active.currency}
                          {active.fromPrice.toLocaleString('en-US')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={
                            active.product
                              ? `/store/${active.product.slug}`
                              : '/store'
                          }
                          className="group inline-flex items-center gap-2 rounded-full bg-accent-grad text-white h-11 px-5 text-[14px] font-medium shadow-pill hover:-translate-y-0.5 transition-all duration-200"
                        >
                          {store.primaryCta}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                          href={
                            active.product
                              ? `/store/${active.product.slug}`
                              : '/store'
                          }
                          className="inline-flex items-center gap-2 rounded-full glass text-fg h-11 px-4 text-[14px] font-medium hover:text-accent-1 transition-colors"
                        >
                          {store.detailsCta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              {/* Autoplay progress bar */}
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/5">
                <motion.div
                  key={`${active.id}-${autoplay}-${paused}`}
                  className="h-full bg-accent-grad"
                  initial={{ width: '0%' }}
                  animate={{
                    width: autoplay && !paused ? '100%' : '0%',
                  }}
                  transition={{
                    duration: autoplay && !paused ? AUTOPLAY_MS / 1000 : 0,
                    ease: 'linear',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* See all */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inViewOnce}
          className="mt-10 text-center"
        >
          <Link
            href="/store"
            className="group inline-flex items-center gap-2 text-[14px] font-medium text-accent-1 hover:text-accent-2 transition-colors"
          >
            {data.seeAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   Sidebar internals
   ============================================================ */

function SidebarGroup({
  label,
  count,
  children,
  className,
}: {
  label: string;
  count: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between px-2.5 pt-1 pb-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-eyebrow text-fg-muted">
          {label}
        </h3>
        <span className="text-[11px] font-semibold text-fg-muted tabular-nums">
          {count}
        </span>
      </div>
      <ul role="tablist" className="space-y-1">
        {children}
      </ul>
    </div>
  );
}

function SidebarRow({
  item,
  active,
  fromPrefix,
  onSelect,
}: {
  item: ShowcaseItem;
  active: boolean;
  fromPrefix: string;
  onSelect: () => void;
}) {
  return (
    <li role="presentation" className="relative">
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onSelect}
        onMouseEnter={onSelect}
        onFocus={onSelect}
        className={cn(
          'relative w-full flex items-center gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors',
          active
            ? 'bg-white shadow-card text-fg'
            : 'text-fg-body hover:bg-white/60 hover:text-fg'
        )}
      >
        {/* Active marker pill (animated via layoutId) */}
        {active && (
          <motion.span
            layoutId="brand-showcase-active-pill"
            aria-hidden="true"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-accent-grad"
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}

        {/* Icon / badge */}
        <span className="shrink-0">
          {item.game ? (
            <GameBadge brand={item.game.key} size={36} rounded="xl" />
          ) : item.design ? (
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]"
              style={{
                backgroundImage: `linear-gradient(135deg, ${item.gradFrom} 0%, ${item.gradTo} 100%)`,
              }}
            >
              <item.design.Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          ) : null}
        </span>

        {/* Text */}
        <span className="flex flex-col min-w-0 flex-1">
          <span className="text-[14px] font-semibold leading-tight truncate">
            {item.name}
          </span>
          <span className="text-[11.5px] text-fg-muted truncate">
            {fromPrefix} {item.currency}
            {item.fromPrice.toLocaleString('en-US')}
          </span>
        </span>

        <ArrowRight
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-all',
            active
              ? 'text-accent-1 translate-x-0 opacity-100'
              : 'text-fg-muted -translate-x-1 opacity-0'
          )}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

function IconButton({
  children,
  label,
  onClick,
  pressed,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-fg-body hover:bg-white hover:text-accent-1 transition-colors"
    >
      {children}
    </button>
  );
}
