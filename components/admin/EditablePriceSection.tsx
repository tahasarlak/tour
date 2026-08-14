"use client";

import { useEffect, useState } from "react";
import EditableField from "./EditableField";

type Props = {
  id: number;
  price: number;
  discountedPrice: number | null;
  discountPercentage: number | null;
  currency?: string | null;
  type?: string;
};

export default function EditablePriceSection({
  id,
  price,
  discountedPrice,
  discountPercentage,
  currency,
  type = "product",
}: Props) {
  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(
          "/api/auth/check"
        );

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();

        setIsAdmin(
          data.isAdmin === true
        );
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  const hasDiscount =
    discountedPrice !== null &&
    discountedPrice !== undefined &&
    discountPercentage !== null &&
    discountPercentage > 0 &&
    discountedPrice < price;

  const showDiscountedPrice =
    isAdmin || hasDiscount;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(
      "fa-IR"
    ).format(Math.round(value));
  };

  return (
    <section
      className="
        relative
        w-full
        rounded-xl
        border
        border-border
        bg-card
        p-4
        text-card-foreground
        sm:p-5
      "
    >
      {/* TITLE */}

      <div className="mb-3">
        <h3
          className="
            text-sm
            font-bold
            text-muted-foreground
            sm:text-base
          "
        >
          قیمت:
        </h3>

        <div
          className="
            mt-2
            h-px
            w-8
            bg-primary
          "
        />
      </div>

      {/* PRICE */}

      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        {/* ORIGINAL */}

        <EditableField
          id={id}
          field="price"
          value={String(price)}
          type={type}
          variant="value"
        >
          <div className="flex items-baseline gap-2">
            <span
              className={`
                font-bold
                leading-none
                ${
                  hasDiscount
                    ? "text-lg text-muted-foreground line-through sm:text-xl"
                    : "text-2xl text-primary sm:text-3xl"
                }
              `}
            >
              {formatPrice(price)}
            </span>

            {currency && (
              <span
                className={`
                  text-xs
                  sm:text-sm
                  ${
                    hasDiscount
                      ? "text-muted-foreground line-through"
                      : "text-muted-foreground"
                  }
                `}
              >
                {currency}
              </span>
            )}
          </div>
        </EditableField>

        {/* DISCOUNTED */}

        {showDiscountedPrice && (
          <EditableField
            id={id}
            field="discountedPrice"
            value={
              discountedPrice !== null
                ? String(discountedPrice)
                : ""
            }
            type={type}
            variant="value"
          >
            <div className="flex items-baseline gap-2">
              <span
                className="
                  text-2xl
                  font-black
                  leading-none
                  text-primary
                  sm:text-3xl
                "
              >
                {discountedPrice !== null
                  ? formatPrice(
                      discountedPrice
                    )
                  : "—"}
              </span>

              {currency && (
                <span
                  className="
                    text-xs
                    text-muted-foreground
                    sm:text-sm
                  "
                >
                  {currency}
                </span>
              )}
            </div>
          </EditableField>
        )}
      </div>

      {/* ADMIN HINT */}

      {isAdmin && !hasDiscount && (
        <p
          className="
            mt-3
            text-[11px]
            leading-5
            text-muted-foreground
          "
        >
          برای افزودن تخفیف، قیمت
          تخفیف‌خورده و درصد تخفیف را
          ویرایش کنید.
        </p>
      )}
    </section>
  );
}