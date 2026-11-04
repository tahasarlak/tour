"use client";

import ProductImage from "./ProductImage";
import ProductRegistration from "./ProductRegistration";
import ProductBasicInfo from "./ProductBasicInfo";
import BackLink from "../Button/BackLinkButton";

import type { ProductType } from "@/lib/product-types";

type Product = {
  id: number;
  name: string;
  image: string | null;

  price: number;
  discountedPrice: number | null;
  discountPercentage: number | null;

  currency: string | null;
  duration?: string | null;

  shortDescription: string | null;
  description: string | null;

  isPublished: boolean;
  isSpecial: boolean;

  [key: string]: unknown;
};

type Props = {
  type: ProductType;
  product: Product;
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
  const productImage =
    product.image ||
    "/images/default-product.jpg";

  const typeLabel = typeLabels[type];

  return (
    <main className="min-h-screen bg-background text-foreground">

      <BackLink
        href={`/products/${type}`}
        label={`بازگشت به ${typeLabel}`}
      />

      {isAdmin && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          {/* Admin buttons */}
        </div>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-14">

          {/* IMAGE AND REGISTRATION */}

          <section className="min-w-0 lg:sticky lg:top-6 lg:self-start">

            <div className="space-y-5">

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

            </div>
          </section>

          {/* PRODUCT DETAILS */}

          <section className="min-w-0">

            <div className="space-y-6">

              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)] sm:p-6 lg:p-7">

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
                  details={product}
                />

              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
