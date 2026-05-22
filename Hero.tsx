import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteContent } from '@/content';
import { products } from '@/content/products';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StoreBanner } from '@/components/store/StoreBanner';
import { StoreGrid } from '@/components/store/StoreGrid';

export default async function StorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const site = getSiteContent(locale);
  const t = await getTranslations('A11y');

  const gamesCount = products.filter((p) => p.category === 'games').length;
  const designCount = products.filter((p) => p.category === 'design').length;

  return (
    <>
      <a href="#main" className="skip-link">
        {t('skipToContent')}
      </a>

      <Navbar brand={site.brand.name} nav={site.nav} />

      <main id="main">
        <StoreBanner
          data={site.store}
          gamesCount={gamesCount}
          designCount={designCount}
        />

        <Suspense fallback={<GridFallback />}>
          <StoreGrid products={products} strings={site.store} />
        </Suspense>
      </main>

      <Footer brand={site.brand.name} data={site.footer} />
    </>
  );
}

function GridFallback() {
  return (
    <section className="mx-auto max-w-content px-6 pb-24">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl glass-strong h-[340px] animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>
    </section>
  );
}
