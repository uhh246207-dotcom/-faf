'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Flame, Tag } from 'lucide-react';
import {
  Palette,
  ShoppingBag,
  Image as ImageIcon,
  Megaphone,
  Youtube,
  Grid3x3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GameBadge, GAME_BRANDS } from '@/components/brand-logos';
import type {
  DesignServiceKey,
  GameKey,
  Product,
  ProductBadge,
  SiteContent,
} from '@/content/types';
import { cn } from '@/lib/utils';

interface Props {
  product: Product;
  strings: SiteContent['store'];
}

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
  {
    icon: LucideIcon;
    classes: string;
    label: (s: SiteContent['store']) => string;
  }
> = {
  new: {
    icon: Sparkles,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: (s) => s.badgeNew,
  },
  popular: {
    icon: Flame,
    classes:
      'bg-violet-50 text-accent-1 border-violet-200',
    label: (s) => s.badgePopular,
  },
  sale: {
    icon: Tag,
    classes: 'bg-pink-50 text-pink-700 border-pink-200',
    label: (s) => s.badgeSale,
  },
};

export function ProductCard({ product, strings }: Props) {
  const isGame = product.category === 'games';
  const theme =
    !isGame && product.service ? DESIGN_THEME[product.service] : null;
  const DesignIcon =
    !isGame && product.service ? DESIGN_ICON[product.service] : null;
  const game = isGame && product.brand ? GAME_BRANDS[product.brand as GameKey] : null;

  const heroBg = game
    ? `linear-gradient(135deg, ${game.from} 0%, ${game.to} 100%)`
    : theme
      ? `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`
      : 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)';

  return (
    <Link
      href={`/store/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl glass-strong glass-hover-ring transition-all duration-300 hover:-translate-y-1"
    >
      {/* Visual hero — colored block with brand glyph + decorative orbs */}
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{ backgroundImage: heroBg }}
      >
        {/* Real brand image overlay (when configured on the brand) */}
        {game?.image && (
          <Image
            src={game.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            aria-hidden="true"
          />
        )}

        {/* Decorations & glyph only when no image is set */}
        {!game?.image && (
          <>
            <span
              aria-hidden="true"
              className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/25 blur-2xl"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-black/15 blur-2xl"
            />

            <div className="absolute inset-0 grid place-items-center">
              {game && (
                <game.glyph
                  className="h-20 w-20 text-white/95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  aria-hidden="true"
                />
              )}
              {DesignIcon && (
                <DesignIcon
                  className="h-16 w-16 text-white/95 drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                  aria-hidden="true"
                />
              )}
            </div>
          </>
        )}

        {/* Subtle dim over image for badge legibility */}
        {game?.image && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15"
          />
        )}

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.badges.map((b) => {
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
                  {meta.label(strings)}
                </span>
              );
            })}
          </div>
        )}

        {/* Top-right brand badge */}
        {game && (
          <span className="absolute top-3 right-3">
            <GameBadge brand={product.brand as GameKey} size={32} rounded="lg" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-fg leading-tight">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[13.5px] text-fg-muted line-clamp-2">
          {product.tagline}
        </p>

        <div className="mt-auto pt-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-eyebrow text-fg-muted">
              {strings.fromPrefix}
            </p>
            <p className="text-xl md:text-[22px] font-bold tracking-tightish text-fg mt-0.5">
              {product.currency}
              {product.fromPrice.toLocaleString('en-US')}
            </p>
          </div>
          <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white border border-border text-fg group-hover:bg-accent-grad group-hover:border-transparent group-hover:text-white transition-all duration-300">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
