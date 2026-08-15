export const PRODUCT_TYPES = [
  "tour",
  "train",
  "flight",
  "accommodation",
  "visa",
] as const;

export type ProductType =
  (typeof PRODUCT_TYPES)[number];