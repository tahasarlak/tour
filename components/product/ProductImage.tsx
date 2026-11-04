
"use client";

import { useEffect, useState } from "react";
import type { ProductType } from "@/lib/product-types";
import EditableSingleImage from "../admin/EditableSingleImage";

type ProductType =
  | "tour"
  | "train"
  | "flight"
  | "bus"
  | "accommodation"
  | "visa";

type Props = {
  id: number;
  src: string;
  type: ProductType;
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

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-background">
      <div
        className="
          relative mx-auto flex w-full max-w-[420px]
          aspect-[4/5] items-center justify-center
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
    </div>
  );
}
