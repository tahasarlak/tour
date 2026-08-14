"use client";

import {
  MessageCircle,
  Send,
} from "lucide-react";

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
  const productName = "این محصول";

  const message = `سلام، می‌خوام ${productName} رو ثبت‌نام کنم:

📌 ${name}
💰 ${price ?? "—"} ${currency ?? "—"}`;

  const encodedMessage =
    encodeURIComponent(message);

  const whatsappLink =
    `https://wa.me/79254212300?text=${encodedMessage}`;

  const telegramLink =
    `https://t.me/Ahmadreza_raste?text=${encodedMessage}`;

  return (
    <div className="w-full text-foreground">
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground sm:text-lg">
          ثبت‌نام در {productName}
        </h3>

        <p className="mt-1 text-xs leading-6 text-muted-foreground sm:text-sm">
          برای ثبت‌نام، یکی از روش‌های زیر را انتخاب کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex min-h-[48px] w-full
            items-center justify-center gap-2
            rounded-xl
            bg-primary
            px-3 py-2.5
            text-sm font-bold
            text-primary-foreground
            shadow-md
            transition-all
            duration-200
            hover:opacity-90
            active:scale-[0.98]
          "
        >
          <MessageCircle size={19} strokeWidth={2.5} />
          <span>واتساپ</span>
        </a>

        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex min-h-[48px] w-full
            items-center justify-center gap-2
            rounded-xl
            border border-border
            bg-secondary
            px-3 py-2.5
            text-sm font-bold
            text-secondary-foreground
            transition-all
            duration-200
            hover:bg-accent
            hover:text-accent-foreground
            active:scale-[0.98]
          "
        >
          <Send size={19} strokeWidth={2.5} />
          <span>تلگرام</span>
        </a>
      </div>
    </div>
  );
}