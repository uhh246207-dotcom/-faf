'use client';

import { useEffect } from 'react';
import { hydrateRecent, recentStore } from '@/lib/recently-viewed';

interface Props {
  slug: string;
}

/**
 * Side-effect-only component dropped onto the product detail page.
 * Pushes the slug to the recently-viewed store on mount, so the
 * /store page can surface a "recently viewed" rail.
 */
export function TrackProductView({ slug }: Props) {
  useEffect(() => {
    hydrateRecent();
    recentStore.push(slug);
  }, [slug]);

  return null;
}
