import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getSiteContent } from '@/content';
import { getFeaturedProducts } from '@/content/products';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BrandShowcase } from '@/components/BrandShowcase';
import { ServiceCommitment } from '@/components/ServiceCommitment';
import { HowItWorks } from '@/components/HowItWorks';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { FAQ } from '@/components/FAQ';
import { CTABanner } from '@/components/CTABanner';
import { Footer } from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const site = getSiteContent(locale);
  const t = await getTranslations('A11y');
  const featured = getFeaturedProducts(4);

  return (
    <>
      <a href="#main" className="skip-link">
        {t('skipToContent')}
      </a>

      <Navbar brand={site.brand.name} nav={site.nav} />

      <main id="main">
        <Hero hero={site.hero} />
        <BrandShowcase
          data={site.showcase}
          designItems={site.designServices.items}
          store={site.store}
        />
        <FeaturedProducts
          data={site.featured}
          products={featured}
          storeStrings={site.store}
        />
        <ServiceCommitment data={site.serviceCommitment} />
        <HowItWorks data={site.howItWorks} />
        <FAQ data={site.faq} />
        <CTABanner data={site.ctaBanner} />
      </main>

      <Footer brand={site.brand.name} data={site.footer} />
    </>
  );
}
