export const PRODUCT_TYPES = [
  "tour",
  "train",
  "flight",
  "bus",
  "accommodation",
  "visa",
] as const;

export type ProductType =
  (typeof PRODUCT_TYPES)[number];