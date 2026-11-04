
"use client";

import EditableSingleImage from "../admin/EditableSingleImage";
import type { ProductType } from "@/lib/product-types";

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
}: Props) {
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
