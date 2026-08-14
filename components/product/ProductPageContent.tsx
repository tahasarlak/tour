"use client";

import ProductImage from "./ProductImage";
import ProductRegistration from "./ProductRegistration";
import ProductBasicInfo from "./ProductBasicInfo";
import BackLink from "../Button/BackLinkButton";

type Product = {
  id: number;
  name: string;
  image: string | null;

  price: number;
  discountedPrice: number | null;
  discountPercentage: number | null;

  currency: string | null;
  duration: string | null;

  shortDescription: string | null;
  description: string | null;

  isPublished: boolean;
  isSpecial: boolean;

  [key: string]: unknown;
};

type Props = {
  type: string;
  product: Product;
  isAdmin: boolean;
};

export default function ProductPageContent({
  type,
  product,
  isAdmin,
}: Props) {
  const productImage =
    product.image || "/images/default-product.jpg";

  return (
    <main
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >
      {/* =========================
          BACK LINK
      ========================= */}

      <BackLink
        href={`/products/${type}`}
        label={`بازگشت به ${type}`}
      />

      {/* =========================
          ADMIN ACTIONS
      ========================= */}

      {isAdmin && (
        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            pt-6
            sm:px-6
            lg:px-8
          "
        >
          {/* Admin buttons can be added here */}
        </div>
      )}

      {/* =========================
          MAIN PRODUCT
      ========================= */}

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6
          sm:px-6
          sm:py-8
          lg:px-8
          lg:py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]
            lg:gap-10
            xl:gap-14
          "
        >
          {/* =========================
              LEFT
              IMAGE + REGISTRATION
          ========================= */}

          <section
            className="
              min-w-0
              lg:sticky
              lg:top-6
              lg:self-start
            "
          >
            <div className="space-y-5">

              {/* IMAGE CARD */}

              <div
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  shadow-[var(--shadow)]
                "
              >
                <div
                  className="
                    mx-auto
                    w-full
                    max-w-[520px]
                    p-3
                    sm:p-4
                    lg:p-5
                  "
                >
                  <ProductImage
                    id={product.id}
                    src={productImage}
                    type={type}
                    discountedPrice={
                      product.discountedPrice
                    }
                    discountPercentage={
                      product.discountPercentage
                    }
                    currency={product.currency}
                  />
                </div>
              </div>

              {/* REGISTRATION */}

              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-4
                  shadow-[var(--shadow)]
                  sm:p-5
                "
              >
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

          {/* =========================
              RIGHT
              PRODUCT INFORMATION
          ========================= */}

          <section className="min-w-0">
            <div className="space-y-6">

              {/* BASIC INFO */}

              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-5
                  shadow-[var(--shadow)]
                  sm:p-6
                  lg:p-7
                "
              >
                <ProductBasicInfo
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discountedPrice={
                    product.discountedPrice
                  }
                  discountPercentage={
                    product.discountPercentage
                  }
                  currency={product.currency}
                  duration={product.duration}
                  description={product.description}
                  shortDescription={
                    product.shortDescription
                  }
                  type={type}
                  isAdmin={isAdmin}
                />
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}