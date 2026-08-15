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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/check");

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();

        setIsAdmin(data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  // =========================
  // FINAL PRICE
  // =========================

  const hasDiscount =
    discountedPrice !== null &&
    discountPercentage !== null &&
    Number(discountPercentage) > 0 &&
    discountedPrice < price;

  const finalPrice = hasDiscount
    ? discountedPrice
    : price;

  // =========================
  // FORMAT
  // =========================

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fa-IR").format(
      Math.round(value)
    );
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

   <div className="flex items-baseline gap-3">
  <span
    className="
      whitespace-nowrap
      text-base
      font-bold
      text-muted-foreground
      sm:text-lg
    "
  >
    شروع قیمت از
  </span>


        <EditableField
          id={id}
          field={hasDiscount ? "discountedPrice" : "price"}
          value={String(finalPrice)}
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
              {formatPrice(finalPrice)}
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
      </div>

      {/* ADMIN HINT */}

      {isAdmin && (
        <p
          className="
            mt-3
            text-[11px]
            leading-5
            text-muted-foreground
          "
        >
          برای تغییر قیمت، روی قیمت کلیک کنید.
        </p>
      )}
    </section>
  );
}