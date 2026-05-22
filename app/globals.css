@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg: #ffffff;
    --bg-soft: #f7f8fc;
    --fg: #0b0b0f;
    --fg-body: #4b5563;
    --fg-muted: #9ca3af;
    --border: #e5e7eb;
    --accent-1: #7c3aed;
    --accent-2: #2563eb;
    --shadow-pill: 0 8px 24px rgba(124, 58, 237, 0.18);
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background: var(--bg);
    color: var(--fg);
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  }

  ::selection {
    background: rgba(124, 58, 237, 0.85);
    color: #ffffff;
  }

  *:focus-visible {
    outline: 2px solid var(--accent-1);
    outline-offset: 2px;
    border-radius: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer utilities {
  /* Pastel gradient mesh background — used behind the hero */
  .hero-mesh {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }

  .hero-mesh::before,
  .hero-mesh::after {
    content: '';
    position: absolute;
    border-radius: 9999px;
    filter: blur(80px);
    opacity: 0.7;
  }

  .hero-mesh::before {
    width: 60vw;
    height: 60vw;
    top: -20vw;
    left: -10vw;
    background: radial-gradient(
      circle at 30% 30%,
      #ede9fe 0%,
      #dbeafe 45%,
      transparent 70%
    );
  }

  .hero-mesh::after {
    width: 55vw;
    height: 55vw;
    top: -10vw;
    right: -15vw;
    background: radial-gradient(
      circle at 70% 30%,
      #fce7f3 0%,
      #dbeafe 50%,
      transparent 75%
    );
  }

  .hero-mesh-bottom {
    position: absolute;
    bottom: -10vw;
    left: 20%;
    width: 60vw;
    height: 40vw;
    border-radius: 9999px;
    filter: blur(80px);
    opacity: 0.55;
    background: radial-gradient(
      circle at 50% 50%,
      #ede9fe 0%,
      #fce7f3 50%,
      transparent 80%
    );
  }

  /* Gradient text */
  .text-grad {
    background: linear-gradient(90deg, #7c3aed 0%, #2563eb 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* Animated shimmer over the gradient text on first paint */
  .text-grad-shimmer {
    background: linear-gradient(
      90deg,
      #7c3aed 0%,
      #c4b5fd 25%,
      #2563eb 50%,
      #c4b5fd 75%,
      #7c3aed 100%
    );
    background-size: 200% 100%;
    background-position: 0% 0;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 3s ease-out 1 forwards;
  }

  /* Marquee mask fade on edges */
  .marquee-mask {
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      #000 10%,
      #000 90%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      #000 10%,
      #000 90%,
      transparent 100%
    );
  }

  /* Dotted gradient connector for "How it works" steps */
  .dotted-connector {
    background-image: radial-gradient(
      circle,
      #c4b5fd 0,
      #c4b5fd 1.5px,
      transparent 1.5px
    );
    background-size: 12px 2px;
    background-repeat: repeat-x;
    background-position: 0 50%;
  }

  /* Radix Accordion height animations are defined globally below */

  /* ============================================================
     GLASS effect — modern frosted card surfaces
     ============================================================ */
  .glass {
    background: rgba(255, 255, 255, 0.55);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.7) inset,
      0 8px 32px rgba(31, 38, 135, 0.08);
  }
  .glass-strong {
    background: rgba(255, 255, 255, 0.7);
    -webkit-backdrop-filter: blur(28px) saturate(200%);
    backdrop-filter: blur(28px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.95) inset,
      0 12px 40px rgba(31, 38, 135, 0.1);
  }
  .glass-dark {
    background: rgba(11, 11, 15, 0.5);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.08) inset,
      0 12px 40px rgba(0, 0, 0, 0.25);
  }
  /* Glow ring used on hover for premium cards */
  .glass-hover-ring:hover {
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.95) inset,
      0 0 0 1px rgba(124, 58, 237, 0.18),
      0 16px 48px rgba(124, 58, 237, 0.18);
  }

  /* Soft holographic sheen often layered over glass cards */
  .holo-sheen {
    background: linear-gradient(
      135deg,
      rgba(124, 58, 237, 0.1) 0%,
      rgba(236, 72, 153, 0.06) 35%,
      rgba(37, 99, 235, 0.1) 70%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  /* ============================================================
     Aurora — drifting multi-layer gradient orbs.
     Used as an ambient backdrop on Hero / CTA / featured grids.
     Sits behind content; pointer-events disabled.
     ============================================================ */
  .aurora {
    position: absolute;
    inset: -10%;
    z-index: -2;
    overflow: hidden;
    pointer-events: none;
  }
  .aurora::before,
  .aurora::after,
  .aurora > .aurora-blob {
    content: '';
    position: absolute;
    border-radius: 9999px;
    filter: blur(96px);
    opacity: 0.55;
    will-change: transform;
    animation: aurora-float 18s ease-in-out infinite;
  }
  .aurora::before {
    width: 50vw;
    height: 50vw;
    top: -8%;
    left: 8%;
    background: radial-gradient(circle, #c4b5fd 0%, transparent 70%);
    animation-delay: -3s;
  }
  .aurora::after {
    width: 44vw;
    height: 44vw;
    top: 18%;
    right: 4%;
    background: radial-gradient(circle, #fbcfe8 0%, transparent 70%);
    animation-delay: -9s;
  }
  .aurora > .aurora-blob {
    width: 38vw;
    height: 38vw;
    bottom: -8%;
    left: 28%;
    background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
    animation-delay: -14s;
  }
  @keyframes aurora-float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(4%, -3%) scale(1.05);
    }
    66% {
      transform: translate(-3%, 4%) scale(0.95);
    }
  }

  /* ============================================================
     Subtle film noise overlay — adds tactile depth on glass
     surfaces and CTA banners.
     ============================================================ */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.06;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>");
    background-size: 160px 160px;
  }

  /* ============================================================
     Rotating conic-gradient ring — appears on hover for cards.
     Falls back gracefully on browsers without @property.
     ============================================================ */
  .gradient-ring {
    position: relative;
  }
  .gradient-ring::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1.5px;
    background: conic-gradient(
      from var(--ring-angle, 0deg),
      #7c3aed,
      #ec4899,
      #2563eb,
      #7c3aed
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.35s ease;
    animation: ring-spin 6s linear infinite;
    pointer-events: none;
  }
  .gradient-ring:hover::before,
  .gradient-ring:focus-within::before {
    opacity: 1;
  }
  @keyframes ring-spin {
    to {
      --ring-angle: 360deg;
    }
  }

  /* ============================================================
     Shimmer sweep — light bar that travels across primary CTAs
     every few seconds. Subtle, never repeats too fast.
     ============================================================ */
  .shimmer-btn {
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }
  .shimmer-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 60%;
    background: linear-gradient(
      115deg,
      transparent 35%,
      rgba(255, 255, 255, 0.45) 50%,
      transparent 65%
    );
    transform: translateX(-120%);
    animation: shimmer-sweep 5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes shimmer-sweep {
    0%,
    55% {
      transform: translateX(-120%);
    }
    85%,
    100% {
      transform: translateX(220%);
    }
  }

  /* ============================================================
     Glow halo — radial accent glow placed behind premium pieces
     (e.g., HowItWorks number badges).
     ============================================================ */
  .glow-halo {
    position: relative;
  }
  .glow-halo::before {
    content: '';
    position: absolute;
    inset: -28%;
    z-index: -1;
    background: radial-gradient(
      circle at center,
      rgba(124, 58, 237, 0.22),
      transparent 65%
    );
    filter: blur(28px);
    pointer-events: none;
  }

  /* ============================================================
     Twinkle — slow opacity pulse for sparkles on CTA banner.
     ============================================================ */
  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(0.85);
    }
    50% {
      opacity: 0.95;
      transform: scale(1.1);
    }
  }
  .animate-twinkle {
    animation: twinkle 3.5s ease-in-out infinite;
  }

  /* Skip link */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 8px;
    z-index: 100;
    background: var(--fg);
    color: #fff;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 14px;
  }
  .skip-link:focus {
    left: 8px;
  }
}


/* Register --ring-angle so the conic gradient on .gradient-ring can tween.
   Browsers without @property simply fall back to a static angled gradient. */
@property --ring-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* Radix Accordion height animations (must be top-level for keyframe lookup) */
@keyframes acc-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}
@keyframes acc-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}
