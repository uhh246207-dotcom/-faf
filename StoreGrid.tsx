import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { XfeinMark } from '@/components/brand-logos';
import type { FooterColumn } from '@/content/types';

interface Props {
  brand: string;
  data: {
    tagline: string;
    columns: FooterColumn[];
    copyright: string;
  };
}

const SOCIALS: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Mail, label: 'Email', href: 'mailto:hi@xfein.com' },
];

export function Footer({ brand, data }: Props) {
  return (
    <footer className="relative border-t border-border bg-white">
      {/* Top accent gradient line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-1/40 to-transparent"
      />

      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <XfeinMark className="h-7 w-7" />
              <span className="text-base font-bold text-fg tracking-tightish">
                {brand}
              </span>
            </div>
            <p className="text-[14px] leading-6 text-fg-body max-w-xs mb-6">
              {data.tagline}
            </p>

            {/* Social row */}
            <ul className="flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="group inline-flex items-center justify-center h-9 w-9 rounded-full border border-border bg-white text-fg-body hover:text-white hover:bg-accent-grad hover:border-transparent hover:-translate-y-0.5 hover:shadow-pill transition-all duration-200"
                    >
                      <Icon
                        className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {data.columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[13px] font-semibold uppercase tracking-eyebrow text-fg-muted mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="group relative inline-flex items-center text-[14px] text-fg-body hover:text-accent-1 transition-colors"
                      >
                        <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-px w-2 bg-accent-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[13px] text-fg-muted">
          <p>{data.copyright}</p>
          <p className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
