"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/images/logo.png";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

export default function ProductImageFallback({
  src,
  ...props
}: Props) {
  const validSrc =
    typeof src === "string" && src.trim()
      ? src.trim()
      : FALLBACK_IMAGE;

  const [imageSrc, setImageSrc] = useState(validSrc);

  useEffect(() => {
    setImageSrc(validSrc);
  }, [validSrc]);

  return (
    <Image
      {...props}
      src={imageSrc}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) {
          setImageSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
