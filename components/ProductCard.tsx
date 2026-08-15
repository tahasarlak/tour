import Image from "next/image";
import Link from "next/link";

import DeleteButton from "@/components/Button/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import SpecialButton from "@/components/admin/SpecialButton";

// =========================================================
// PRODUCT TYPE
// =========================================================

type ProductType =
  | "tour"
  | "train"
  | "flight"
  | "bus"
  | "accommodation"
  | "visa"
  | string;

// =========================================================
// PRODUCT
// =========================================================

type Product = {
  id: number;

  slug: string;

  name: string;

  shortDescription?: string | null;

  image: string | null;

  price: string | number;

  currency?: string | null;

  discountPercentage?: number | null;

  discountedPrice?: string | number | null;

  isPublished: boolean;

  isSpecial: boolean;
};

// =========================================================
// PROPS
// =========================================================

type Props = {
  product: Product;

  type?: ProductType;

  showAdminActions?: boolean;

  className?: string;

  buttonText?: string;

  showDiscount?: boolean;

  showDescription?: boolean;

  href?: string;
};

// =========================================================
// COMPONENT
// =========================================================

export default function ProductCard({
  product,
  type = "product",
  showAdminActions = false,
  className = "",
  buttonText,
  showDiscount = true,
  showDescription = true,
  href: customHref,
}: Props) {
  const {
    id,
    slug,
    name,
    shortDescription,
    image,
    price,
    currency,
    discountPercentage = 0,
    discountedPrice,
    isPublished,
    isSpecial,
  } = product;

  // =======================================================
  // PRICE
  // =======================================================

  const originalPrice =
    `${price} ${currency || ""}`.trim();

  const finalPrice =
    `${discountedPrice ?? price} ${
      currency || ""
    }`.trim();

  // =======================================================
  // DISCOUNT
  // =======================================================

  const hasDiscount =
    Number(discountPercentage) > 0;

  const discountText = hasDiscount
    ? `${discountPercentage}% تخفیف`
    : "";

  // =======================================================
  // DEFAULT BUTTON TEXT
  // =======================================================

  const defaultButtonText =
    type === "tour"
      ? "مشاهده تور"
      : type === "train"
      ? "مشاهده بلیط قطار"
      : type === "flight"
      ? "مشاهده بلیط هواپیما"
      : type === "bus"
      ? "مشاهده بلیط اتوبوس"
      : type === "accommodation"
      ? "مشاهده اقامتگاه"
      : type === "visa"
      ? "مشاهده ویزا"
      : "مشاهده جزئیات";

  // =======================================================
  // LINK
  // =======================================================

  const href =
    customHref ||
    `/products/${type}/${slug}`;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className={`
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        text-card-foreground
        shadow-sm
        transition-all
        duration-300
        hover:border-primary/40
        hover:shadow-lg
        hover:shadow-primary/5
        ${className}
      `}
    >
      {/* ===================================================
          IMAGE
      =================================================== */}

      <div className="relative w-full overflow-hidden bg-background">
        {image ? (
          <>
            {/* Blurred Background */}

            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="
                scale-110
                object-cover
                opacity-30
                blur-2xl
              "
              aria-hidden="true"
            />

            {/* Overlay */}

            <div className="absolute inset-0 bg-background/30" />

            {/* Main Image */}

            <div className="relative flex aspect-[3/4] w-full items-center justify-center">
              <Image
                src={image}
                alt={name}
                fill
                sizes="
                  (max-width: 768px) 100vw,
                  (max-width: 1024px) 50vw,
                  33vw
                "
                className="
                  object-contain
                  transition-transform
                  duration-300
                  group-hover:scale-[1.02]
                "
              />
            </div>
          </>
        ) : (
          <div
            className="
              flex
              aspect-[3/4]
              items-center
              justify-center
              bg-muted
              text-sm
              text-muted-foreground
            "
          >
            بدون تصویر
          </div>
        )}
      </div>

      {/* ===================================================
          ADMIN ACTIONS
      =================================================== */}

      {showAdminActions && (
        <div
          className="
            absolute
            left-3
            top-3
            z-20
            flex
            flex-col
            gap-2
          "
        >
          <SpecialButton
            id={id}
            type={type}
            isSpecial={isSpecial}
          />

          <PublishButton
            id={id}
            type={type}
            isPublished={isPublished}
          />

          <DeleteButton
            id={id}
            type={type}
          />
        </div>
      )}

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-6">

        {/* =================================================
            NAME
        ================================================= */}

        <div className="mb-2 flex h-[56px] items-start">
          <h3
            className="
              line-clamp-2
              text-xl
              font-bold
              text-card-foreground
              transition-colors
              group-hover:text-primary
            "
          >
            {name}
          </h3>
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="mb-1 flex h-[48px] items-start">
          {showDescription && shortDescription ? (
            <p
              className="
                line-clamp-3
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {shortDescription}
            </p>
          ) : null}
        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="mb-6 h-[58px]">

          {/* Final Price */}

          <div className="flex h-[34px] items-center">
            <p
              className="
                text-lg
                font-bold
                text-primary
              "
            >
              شروع قیمت از{" "}
              <span className="text-2xl">
                {finalPrice}
              </span>
            </p>
          </div>

        </div>

        {/* =================================================
            BUTTON
        ================================================= */}

        <div className="mt-auto">
          <Link
            href={href}
            className="
              block
              w-full
              rounded-xl
              border
              border-primary/40
              bg-secondary
              px-4
              py-3
              text-center
              font-bold
              text-primary
              transition-all
              duration-200
              hover:bg-primary
              hover:text-primary-foreground
            "
          >
            {buttonText || defaultButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
}