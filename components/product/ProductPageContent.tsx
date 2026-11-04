
"use client";

import ProductImage from "./ProductImage";
import ProductRegistration from "./ProductRegistration";
import ProductBasicInfo from "./ProductBasicInfo";
import BackLink from "../Button/BackLinkButton";
import type { ProductType } from "@/lib/product-types";

const FALLBACK_IMAGE = "/images/logo.png";

export type ProductPageProduct = {
  id: number;
  name: string;
  image: string | null;
  price: number | null;
  discountedPrice: number | null;
  discountPercentage: number | null;
  currency: string | null;
  duration?: string | null;
  shortDescription: string | null;
  description: string | null;
  isPublished?: boolean;
  isSpecial?: boolean;
  details?: Record<string, unknown>;
};

type Props = {
  type: ProductType;
  product: ProductPageProduct;
  isAdmin: boolean;
};

const typeLabels: Record<ProductType, string> = {
  tour: "تور",
  train: "بلیط قطار",
  flight: "بلیط هواپیما",
  bus: "بلیط اتوبوس",
  accommodation: "اقامتگاه",
  visa: "ویزای توریستی",
};

export default function ProductPageContent({
  type,
  product,
  isAdmin,
}: Props) {
  // عکس پیش‌فرض برای محصولات بدون تصویر
  const productImage =
    product.image?.trim() || FALLBACK_IMAGE;

  const hasRegistration =
    Boolean(product.name?.trim()) ||
    product.price !== null ||
    product.discountedPrice !== null;

  return (
    <main className="min-h-screen bg-background text-foreground">

      <BackLink
        href={`/products/${type}`}
        label={`بازگشت به ${typeLabels[type]}`}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-14">

          {/* ستون تصویر و ثبت سفارش */}
          <section className="min-w-0 space-y-5 lg:sticky lg:top-6 lg:self-start">

            {/* تصویر محصول همیشه نمایش داده می‌شود */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow)]">

              <div className="mx-auto w-full max-w-[520px] p-3 sm:p-4 lg:p-5">

                <ProductImage
                  id={product.id}
                  src={productImage}
                  type={type}
                  discountedPrice={product.discountedPrice}
                  discountPercentage={product.discountPercentage}
                  currency={product.currency}
                />

              </div>

            </div>

            {/* اطلاعات ثبت سفارش فقط در صورت وجود اطلاعات */}
            {hasRegistration && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow)] sm:p-5">

                <ProductRegistration
                  name={product.name}
                  price={
                    product.discountedPrice ??
                    product.price
                  }
                  currency={product.currency}
                  type={type}
                />

              </div>
            )}

          </section>

          {/* ستون اطلاعات محصول */}
          <section className="min-w-0">

            <ProductBasicInfo
              id={product.id}
              name={product.name}
              price={product.price}
              discountedPrice={product.discountedPrice}
              discountPercentage={product.discountPercentage}
              currency={product.currency}
              duration={product.duration ?? null}
              description={product.description}
              shortDescription={product.shortDescription}
              type={type}
              isAdmin={isAdmin}
              details={product.details ?? product}
              isSpecial={product.isSpecial === true}
              isPublished={product.isPublished === true}
            />

          </section>

        </div>

      </div>

    </main>
  );
}
