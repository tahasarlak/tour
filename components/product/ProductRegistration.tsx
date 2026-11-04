"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  name: string;
  price: string | number | null | undefined;
  currency: string | null | undefined;
  type: string;
  topic?: string[];
};

export default function ProductRegistration({
  name,
  price,
  currency,
}: Props) {
  const productName = name.trim();
  const priceLine = price !== null && price !== undefined && price !== ""
    ? `💰 قیمت: ${price} ${currency ?? ""}`
    : "";
  const message = `سلام وقت بخیر 🌹

برای دریافت اطلاعات تکمیلی و شرایط ثبت سفارش پیام می‌دهم:
${productName ? `
📌 نام محصول: ${productName}` : ""}
${priceLine ? `
${priceLine}` : ""}

لطفاً در صورت امکان اطلاعات کامل، شرایط رزرو و نحوه ثبت سفارش را ارسال بفرمایید.
ممنونم 🙏`;

  const encodedMessage = encodeURIComponent(message);

  const whatsappLink =
    `https://wa.me/989171050134?text=${encodedMessage}`;

  const baleLink =
    `https://ble.ir/nrasteh?text=${encodedMessage}`;

  return (
    <div className="w-full text-foreground">
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground sm:text-lg">
          اطلاعات تکمیلی {productName || "محصول"}
        </h3>

        <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
          برای دریافت اطلاعات تکمیلی، شرایط رزرو و نحوه ثبت سفارش،
          از طریق یکی از روش‌های زیر با ما در ارتباط باشید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {/* WhatsApp */}

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            flex
            min-h-[48px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-border
            bg-card
            px-3
            py-2.5
            text-sm
            font-bold
            text-primary
            shadow-sm
            transition-all
            duration-200
            hover:border-primary/40
            hover:bg-muted
            active:scale-[0.98]
          "
        >
          <MessageCircle
            className="h-5 w-5"
            strokeWidth={2.5}
          />

          <span>واتس‌اپ</span>
        </a>

        {/* Bale */}

        <a
          href={baleLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="پیام در بله"
          className="
            group
            flex
            min-h-[48px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-border
            bg-card
            px-3
            py-2.5
            text-sm
            font-bold
            text-primary
            shadow-sm
            transition-all
            duration-200
            hover:border-primary/40
            hover:bg-muted
            active:scale-[0.98]
          "
        >
          <Image
            src="/icons/logo82.png"
            alt="بله"
            width={21}
            height={21}
            className="object-contain"
          />

          <span>بله</span>
        </a>
      </div>
    </div>
  );
}