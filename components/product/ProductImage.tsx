"use client";

import { useEffect, useState } from "react";

import EditableSingleImage from "../admin/EditableSingleImage";
import EditableField from "../admin/EditableField";

type Props = {
  id: number;
  src: string;
  type: string;
  discountedPrice: number | null;
  discountPercentage: number | null;
  currency: string | null;
};

export default function ProductImage({
  id,
  src,
  type,
  discountedPrice,
  discountPercentage,
  currency,
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

  const hasDiscount =
    discountPercentage !== null &&
    discountPercentage > 0 &&
    discountedPrice !== null;

  const showDiscount = isAdmin || hasDiscount;

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-xl
        bg-background
      "
    >
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-[420px]
          items-center
          justify-center
          aspect-[4/5]
          sm:max-w-[460px]
          md:aspect-[4/5]
          lg:max-w-[480px]
        "
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <EditableSingleImage
            id={id}
            src={src}
            type={type}
          />
        </div>
      </div>

      {showDiscount && (
        <div className="absolute right-3 top-3 z-50 sm:right-4 sm:top-4">
          <div
            className="
              rounded-full
              border-primary/30
              bg-primary
              px-3
              py-1.5
              text-xs
              font-bold
              text-destructive-foreground
              shadow-lg
              shadow-destructive/20
              sm:px-4
              sm:py-2
              sm:text-sm
            "
          >
            <EditableField
              id={id}
              field="discountPercentage"
              value={String(discountPercentage ?? 0)}
              type={type}
            >
              {discountPercentage ?? 0}%
            </EditableField>
          </div>
        </div>
      )}
    </div>
  );
}