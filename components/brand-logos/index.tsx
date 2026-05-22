import Image from 'next/image';
import type { CSSProperties, SVGProps } from 'react';

/* ============================================================
   xfein wordmark / logomark
   ============================================================ */
export function XfeinMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="xfein-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="6" fill="url(#xfein-mark)" />
      <path
        d="M7.5 7.5 16.5 16.5M16.5 7.5 7.5 16.5"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================
   Game brand registry — colors, monogram glyphs and (optional)
   image overrides.

   To attach a real image to a game (recommended for production):
     1. Drop the file at  public/games/<key>.<ext>
        e.g.  public/games/roblox.png
     2. Set the matching brand's `image` field below to that path,
        e.g.  image: '/games/roblox.png'

   When `image` is set, it overlays the gradient + glyph everywhere
   the brand is rendered (sidebar badge, showcase banner, product
   card, product detail page).
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

export interface GameBrand {
  name: string;
  /** Gradient start color — used as fallback background and behind transparent images. */
  from: string;
  /** Gradient end color. */
  to: string;
  /** Monogram glyph. Rendered when `image` is not set. */
  glyph: (p: SVGProps<SVGSVGElement>) => JSX.Element;
  /** Optional path to a brand image. Set this once you've uploaded
   *  the file to /public (see header comment for instructions). */
  image?: string;
}

const baseSvg = {
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
} as const;

/* --- Stylised monogram glyphs (use currentColor → set to white) --- */

function RobloxGlyph(p: SVGProps<SVGSVGElement>) {
  // Tilted square block with cut-out — Roblox "R" cube vibe
  return (
    <svg {...baseSvg} {...p}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        transform="rotate(8 12 12)"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="9.5"
        y="9.5"
        width="5"
        height="5"
        rx="0.5"
        transform="rotate(8 12 12)"
        fill="currentColor"
      />
    </svg>
  );
}

function LienQuanGlyph(p: SVGProps<SVGSVGElement>) {
  // Crown — Arena of Valor / Liên Quân
  return (
    <svg {...baseSvg} {...p}>
      <path
        d="M4 9.5 7 13 9.5 7 12 13 14.5 7 17 13 20 9.5l-1.5 8.5h-13L4 9.5Z"
        fill="currentColor"
      />
      <circle cx="4" cy="9" r="1.1" fill="currentColor" />
      <circle cx="20" cy="9" r="1.1" fill="currentColor" />
      <circle cx="12" cy="6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FreeFireGlyph(p: SVGProps<SVGSVGElement>) {
  // Flame
  return (
    <svg {...baseSvg} {...p}>
      <path
        d="M12 3c1.4 3 3.5 4 4.5 6.2 1.3 2.7.4 6.2-2.4 7.7-2.6 1.5-6 .5-7.4-2.2-1.2-2.4-.4-5 1.3-6.5C9.5 6.8 11 6 12 3Z"
        fill="currentColor"
      />
      <path
        d="M12 11c.7 1.6 2.4 1.7 2.6 3.6.2 1.7-1.4 3-3 2.8-1.5-.2-2.5-1.6-2.2-3 .2-1.4 1.5-1.8 2.6-3.4Z"
        fill="#fff"
        fillOpacity="0.35"
      />
    </svg>
  );
}

function PlayTogetherGlyph(p: SVGProps<SVGSVGElement>) {
  // Round smile face — Play Together
  return (
    <svg {...baseSvg} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="10.5" r="1.1" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1.1" fill="currentColor" />
      <path
        d="M8 14.5c1 1.5 2.4 2.3 4 2.3s3-.8 4-2.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function LolGlyph(p: SVGProps<SVGSVGElement>) {
  // Shield with a sword cut — League of Legends
  return (
    <svg {...baseSvg} {...p}>
      <path
        d="M12 3 4.5 6v6c0 4 3.2 7.4 7.5 9 4.3-1.6 7.5-5 7.5-9V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 8v8M15 8v8M9 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FifaGlyph(p: SVGProps<SVGSVGElement>) {
  // Soccer ball
  return (
    <svg {...baseSvg} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m12 7 3 2.2-1.1 3.6h-3.8L9 9.2 12 7Zm0 0V3.5M15 9.2l3.4-1.1M13.9 12.8l2.4 2.7M10.1 12.8l-2.4 2.7M9 9.2 5.6 8.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GenshinGlyph(p: SVGProps<SVGSVGElement>) {
  // Abstract anemo / four-pointed flower
  return (
    <svg {...baseSvg} {...p}>
      <path
        d="M12 3c.6 4.5 3.9 7.4 9 8-5.1.6-8.4 3.5-9 8-.6-4.5-3.9-7.4-9-8 5.1-.6 8.4-3.5 9-8Z"
        fill="currentColor"
      />
      <circle cx="12" cy="11" r="1.4" fill="#fff" fillOpacity="0.6" />
    </svg>
  );
}

function ValorantGlyph(p: SVGProps<SVGSVGElement>) {
  // Stylised V — solid wedge with an inner notch (Valorant logomark vibe)
  return (
    <svg {...baseSvg} {...p}>
      <path
        d="M3 4.5h4.5L12 16.4 16.5 4.5H21l-7.5 16.5h-3L3 4.5Z"
        fill="currentColor"
      />
      <path
        d="m16.5 4.5-4.5 11.9L7.5 4.5"
        stroke="#fff"
        strokeOpacity="0.22"
        strokeWidth="0.9"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* --- Brand registry --- */
export const GAME_BRANDS: Record<GameKey, GameBrand> = {
  roblox: {
    name: 'Roblox',
    from: '#FF4D4D',
    to: '#FF7A00',
    glyph: RobloxGlyph,
    // image: '/games/roblox.png',
  },
  lienquan: {
    name: 'Liên Quân',
    from: '#F59E0B',
    to: '#B45309',
    glyph: LienQuanGlyph,
    // image: '/games/lienquan.png',
  },
  freefire: {
    name: 'Free Fire',
    from: '#EF4444',
    to: '#EC4899',
    glyph: FreeFireGlyph,
    // image: '/games/freefire.png',
  },
  playtogether: {
    name: 'Play Together',
    from: '#06B6D4',
    to: '#3B82F6',
    glyph: PlayTogetherGlyph,
    // image: '/games/playtogether.png',
  },
  lol: {
    name: 'League of Legends',
    from: '#A855F7',
    to: '#0EA5E9',
    glyph: LolGlyph,
    // image: '/games/lol.png',
  },
  fifa: {
    name: 'FIFA',
    from: '#22C55E',
    to: '#0D9488',
    glyph: FifaGlyph,
    // image: '/games/fifa.png',
  },
  genshin: {
    name: 'Genshin Impact',
    from: '#A78BFA',
    to: '#F472B6',
    glyph: GenshinGlyph,
    // image: '/games/genshin.png',
  },
  valorant: {
    name: 'Valorant',
    from: '#FF4655',
    to: '#BD3944',
    glyph: ValorantGlyph,
    // image: '/games/valorant.png',
  },
};

export const GAME_KEYS = Object.keys(GAME_BRANDS) as GameKey[];

/* ============================================================
   GameBadge — gradient square with the brand monogram, OR a
   real image overlay when `brand.image` is set.
   ============================================================ */
interface GameBadgeProps {
  brand: GameKey;
  size?: number;
  rounded?: 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  style?: CSSProperties;
}

const ROUND_MAP: Record<NonNullable<GameBadgeProps['rounded']>, string> = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export function GameBadge({
  brand,
  size = 40,
  rounded = '2xl',
  className = '',
  style,
}: GameBadgeProps) {
  const b = GAME_BRANDS[brand];
  const Glyph = b.glyph;
  const glyphSize = Math.round(size * 0.55);

  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden text-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.3)] ${ROUND_MAP[rounded]} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `linear-gradient(135deg, ${b.from} 0%, ${b.to} 100%)`,
        ...style,
      }}
      aria-label={b.name}
    >
      {b.image ? (
        <Image
          src={b.image}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
          aria-hidden="true"
        />
      ) : (
        <Glyph width={glyphSize} height={glyphSize} />
      )}
    </span>
  );
}
