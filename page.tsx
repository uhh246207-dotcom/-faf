import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        'bg-soft': '#F7F8FC',
        fg: '#0B0B0F',
        'fg-body': '#4B5563',
        'fg-muted': '#9CA3AF',
        border: '#E5E7EB',
        'accent-1': '#7C3AED',
        'accent-2': '#2563EB',
      },
      fontFamily: {
        sans: [
          'Inter',
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tightish: '-0.025em',
        eyebrow: '0.12em',
      },
      boxShadow: {
        pill: '0 8px 24px rgba(124, 58, 237, 0.18)',
        card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)',
        'card-hover':
          '0 2px 4px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'accent-grad':
          'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
      },
      maxWidth: {
        content: '1200px',
        prose60: '60ch',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 3s ease-out 1',
      },
    },
  },
  plugins: [],
};

export default config;
