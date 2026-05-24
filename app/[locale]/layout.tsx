import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getSiteContent } from '@/content';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WishlistDrawer } from '@/components/cart/WishlistDrawer';
import { SearchPalette } from '@/components/search/SearchPalette';
import { MobileMenu } from '@/components/MobileMenu';
import { Toaster } from '@/components/Toaster';
import { ScrollToTop } from '@/components/ScrollToTop';
import '../globals.css';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    title: t('title'),
    description: t('description'),
    icons: { icon: '/favicon.svg' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const site = getSiteContent(locale);

  return (
    <html lang={locale}>
      <body className="font-sans bg-bg text-fg antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}

          {/* Global overlays — mounted once at the layout root so they
              float above every route. All read state from lib/ui-store
              and lib/cart, so they're SSR-safe (initial closed/empty). */}
          <MobileMenu brand={site.brand.name} nav={site.nav} />
          <CartDrawer />
          <WishlistDrawer />
          <SearchPalette />
          <Toaster />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
