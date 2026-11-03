
"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
};

export default function SafeProductImage({
  src,
  alt,
  className,
  sizes,
}: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted px-4 text-center text-sm text-muted-foreground">
        تصویر به‌زودی اضافه می‌شود
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
