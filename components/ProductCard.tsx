import Image from "next/image";
import Link from "next/link";
import DeleteButton from "@/components/Button/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import SpecialButton from "@/components/admin/SpecialButton";
import type { ProductType } from "@/lib/product-types";

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

type Props = {
  product: Product;
  type: ProductType;
  showAdminActions?: boolean;
  className?: string;
  buttonText?: string;
  showDiscount?: boolean;
  showDescription?: boolean;
  href?: string;
};

export default function ProductCard({
  product,
  type,
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

  const finalPrice = `${discountedPrice ?? price} ${currency || ""}`.trim();
  const hasDiscount = Number(discountPercentage) > 0;

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

  const href = customHref || `/products/${type}/${slug}`;

  return (
    <div
      className={`
        group relative flex h-full min-w-0 flex-col overflow-hidden
        rounded-2xl border border-border bg-card text-card-foreground
        shadow-sm transition-all duration-300
        hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5
        ${className}
      `}
    >
      {/* IMAGE */}
      <div className="relative w-full overflow-hidden bg-background">
        {image ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="scale-110 object-cover opacity-30 blur-2xl"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-background/30" />
            <div className="relative flex aspect-[3/4] w-full items-center justify-center">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </>
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center bg-muted text-sm text-muted-foreground">
            بدون تصویر
          </div>
        )}
      </div>

      {/* ADMIN ACTIONS */}
      {showAdminActions && (
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
          <SpecialButton id={id} type={type} isSpecial={isSpecial} />
          <PublishButton id={id} type={type} isPublished={isPublished} />
          <DeleteButton id={id} type={type} />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 md:p-6">
        {/* NAME */}
        <div className="mb-2 min-w-0">
          <h3 className="line-clamp-2 break-words text-[15px] font-bold leading-7 text-card-foreground sm:text-lg">
            {name}
          </h3>
        </div>

        {/* DESCRIPTION
            Important: no fixed-height wrapper here. The old h-[48px]
            wrapper was shorter than 3 lines of leading-6 text (72px),
            so the description visually overflowed into the price section.
        */}
        {showDescription && shortDescription ? (
          <p className="mt-1 min-w-0 break-words text-xs leading-6 text-muted-foreground [overflow-wrap:anywhere] line-clamp-3 sm:text-sm">
            {shortDescription}
          </p>
        ) : null}

        {/* PRICE
            Natural height prevents wrapped prices and discounts from
            colliding with the description or the button on narrow screens.
        */}
        <div className="mt-4 min-w-0 border-t border-border/60 pt-3">
          <p className="text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
            شروع قیمت از
          </p>

          <p className="mt-1 block min-w-0 break-words text-xl font-bold leading-tight text-primary sm:text-2xl [overflow-wrap:anywhere]">
            {finalPrice}
          </p>

          {showDiscount && hasDiscount && (
            <div className="mt-1">
              <span className="text-xs font-semibold text-green-600">
                {discountPercentage}% تخفیف
              </span>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-primary/40 bg-secondary px-2 py-3 text-center text-sm font-bold leading-6 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground sm:px-4 sm:text-base"
          >
            <span className="break-words [overflow-wrap:anywhere]">
              {buttonText || defaultButtonText}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
