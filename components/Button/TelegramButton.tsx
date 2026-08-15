"use client";

import Image from "next/image";

import Button from "../ui/Button";

export default function BaleButton() {
  return (
    <a
       href="https://ble.ir/nrasteh"

      target="_blank"
      rel="noopener noreferrer"
      aria-label="پیام در بله"
      className="
        fixed
        bottom-8
        right-8
        z-50
        hover:scale-110
        active:scale-95
        transition-transform
      "
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        icon={
          <Image
            src="/icons/bale.svg"
            alt="بله"
            width={32}
            height={32}
          />
        }
        aria-label="پیام در بله"
      />
    </a>
  );
}