/* ============================================================
   Coupon codes. The list is intentionally small and shipped on
   the client — anyone with the page source can read them. For
   real promo flows the validation should move to the server.
   ============================================================ */

export interface Coupon {
  /** User-typed code, normalised to upper case. */
  code: string;
  /** "percent" → percent off subtotal, "flat" → fixed VND off. */
  kind: 'percent' | 'flat';
  /** Either 0–100 (percent) or VND amount (flat). */
  value: number;
  /** Optional cap on total discount (VND). */
  maxOff?: number;
  /** Minimum subtotal required (VND). */
  minSubtotal?: number;
}

const COUPONS: readonly Coupon[] = [
  { code: 'XFEIN10', kind: 'percent', value: 10, maxOff: 200_000 },
  { code: 'WELCOME', kind: 'flat', value: 50_000, minSubtotal: 200_000 },
  {
    code: 'GAMEDAY',
    kind: 'percent',
    value: 15,
    maxOff: 300_000,
    minSubtotal: 500_000,
  },
];

export function findCoupon(raw: string): Coupon | undefined {
  const code = raw.trim().toUpperCase();
  if (!code) return undefined;
  return COUPONS.find((c) => c.code === code);
}

/**
 * Compute the discount applied to `subtotal` for a given coupon.
 * Returns 0 if the coupon doesn't apply (e.g. minimum not met).
 */
export function discountFor(coupon: Coupon | undefined, subtotal: number): number {
  if (!coupon) return 0;
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;

  let off =
    coupon.kind === 'percent'
      ? Math.floor((subtotal * coupon.value) / 100)
      : coupon.value;

  if (coupon.maxOff != null) off = Math.min(off, coupon.maxOff);
  // Never give more than the subtotal back.
  off = Math.min(off, subtotal);
  return Math.max(0, Math.floor(off));
}

export type CouponValidation =
  | { ok: true; coupon: Coupon }
  | { ok: false; reason: 'unknown' | 'min-subtotal'; coupon?: Coupon };

export function validateCoupon(raw: string, subtotal: number): CouponValidation {
  const coupon = findCoupon(raw);
  if (!coupon) return { ok: false, reason: 'unknown' };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { ok: false, reason: 'min-subtotal', coupon };
  }
  return { ok: true, coupon };
}
