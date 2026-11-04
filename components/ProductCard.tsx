
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import DeleteButton from "@/components/Button/DeleteButton";
import PublishButton from "@/components/admin/PublishButton";
import SpecialButton from "@/components/admin/SpecialButton";
import type { ProductType } from "@/lib/product-types";

const FALLBACK_IMAGE = "/images/logo.png";

type Product = {
  id: number;
  slug: string;
  name: string | null;
  shortDescription?: string | null;
  image: string | null;
  price: string | number | null;
  currency?: string | null;
  discountPercentage?: number | null;
  discountedPrice?: string | number | null;
  isPublished?: boolean;
  isSpecial?: boolean;
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
    discountPercentage,
    discountedPrice,
    isPublished,
    isSpecial,
  } = product;

  const [imageFailed, setImageFailed] = useState(false);

  // با تغییر عکس محصول، وضعیت خطای عکس پاک شود
  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  const nameText = name?.trim() ?? "";
  const hasName = nameText.length > 0;

  // عکس اصلی یا لوگوی پیش‌فرض
  const originalImage =
    image?.trim() || FALLBACK_IMAGE;

  // اگر عکس اصلی بارگذاری نشد، لوگو نمایش داده شود
  const imageSrc = imageFailed
    ? FALLBACK_IMAGE
    : originalImage;

  const priceNumber =
    price === null ||
    price === undefined ||
    price === ""
      ? null
      : Number(price);

  const discountNumber =
    discountedPrice === null ||
    discountedPrice === undefined ||
    discountedPrice === ""
      ? null
      : Number(discountedPrice);

  const hasPrice =
    priceNumber !== null &&
    Number.isFinite(priceNumber);

  const hasDiscountValue =
    discountNumber !== null &&
    Number.isFinite(discountNumber);

  const hasDiscount =
    showDiscount &&
    hasPrice &&
    hasDiscountValue &&
    (discountPercentage ?? 0) > 0 &&
    (discountNumber as number) <
      (priceNumber as number);

  const displayPrice =
    hasDiscount
      ? discountNumber
      : hasPrice
        ? priceNumber
        : hasDiscountValue
          ? discountNumber
          : null;

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
              : "مشاهده ویزا";

  const href =
    customHref || `/products/${type}/${slug}`;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(
      Math.round(value)
    );

  return (
    <div
      className={`
        group relative flex h-full min-w-0 flex-col
        overflow-hidden rounded-2xl
        border border-border bg-card
        text-card-foreground shadow-sm
        transition-all duration-300
        hover:border-primary/40
        hover:shadow-lg hover:shadow-primary/5
        ${className}
      `}
    >

      {/* تصویر محصول همیشه نمایش داده می‌شود */}
      <div className="relative w-full overflow-hidden bg-background">

        <div className="relative flex aspect-[3/4] w-full items-center justify-center">

          <Image
            src={imageSrc}
            alt={nameText || "تصویر محصول"}
            fill
            sizes="
              (max-width: 768px) 100vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            className="
              object-contain
              transition-transform duration-300
              group-hover:scale-[1.02]
            "
            onError={() => {
              if (imageSrc !== FALLBACK_IMAGE) {
                setImageFailed(true);
              }
            }}
          />

        </div>

      </div>

      {/* دکمه‌های مدیریت ادمین */}
      {showAdminActions && (
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">

          <SpecialButton
            id={id}
            type={type}
            isSpecial={isSpecial === true}
          />

          <PublishButton
            id={id}
            type={type}
            isPublished={isPublished === true}
          />

          <DeleteButton
            id={id}
            type={type}
          />

        </div>
      )}

      {/* اطلاعات محصول */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-6">

        {(hasName || showAdminActions) && (
          <div className="mb-2 min-w-0">

            <h3 className="line-clamp-2 break-words text-base font-bold leading-7 text-card-foreground sm:text-lg">

              {hasName
                ? nameText
                : "نام محصول ثبت نشده"}

            </h3>

          </div>
        )}

        {/* توضیحات */}
        {showDescription &&
          Boolean(shortDescription?.trim()) && (
            <p className="mb-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {shortDescription}
            </p>
          )}

        {/* قیمت */}
        {displayPrice !== null && (
          <div className="mb-6">

            {hasDiscount &&
              priceNumber !== null && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(priceNumber)}{" "}
                  {currency || ""}
                </p>
              )}

            <p className="text-lg font-bold text-primary">

              {hasDiscount
                ? "قیمت با تخفیف"
                : "شروع قیمت از"}

              {" "}

              <span className="text-2xl">
                {formatPrice(displayPrice)}
              </span>

              {" "}

              {currency || ""}

            </p>

            {hasDiscount && (
              <span className="mt-1 inline-block text-xs font-semibold text-green-600">
                {discountPercentage}% تخفیف
              </span>
            )}

          </div>
        )}

        {/* دکمه مشاهده محصول */}
        <div className="mt-auto">

          <Link
            href={href}
            className="
              block w-full rounded-xl
              border border-primary/40
              bg-secondary px-4 py-3
              text-center font-bold text-primary
              transition-all duration-200
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
