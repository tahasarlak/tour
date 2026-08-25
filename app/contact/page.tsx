"use client";
import Image from "next/image";

import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 text-foreground">
      <div className="mx-auto max-w-3xl">

        {/* عنوان اصلی */}

        <h1 className="mb-4 text-center text-3xl font-bold text-primary">
          تماس با ما
        </h1>

        <p className="mb-10 text-center leading-relaxed text-muted-foreground">
          برای دریافت اطلاعات تورها، زمان حرکت، قیمت‌ها، رزرو و
          هماهنگی سفر می‌توانید از طریق راه‌های ارتباطی زیر با ما
          در تماس باشید.
        </p>

        {/* کارت اصلی */}

        <div
          className="
            space-y-7
            rounded-3xl
            border
            border-border
            bg-card
            p-6
            text-card-foreground
            shadow-sm
            md:p-8
          "
        >

          {/* شماره تماس */}

          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <Phone size={21} />
            </div>

            <div>
              <h2 className="mb-1 text-lg font-semibold text-primary">
                شماره تماس
              </h2>

              <a
                href="tel:+989171050134"
                className="
                  text-lg
                  text-foreground
                  transition
                  hover:text-primary
                "
              >
                +989171050134
              </a>

              <p className="mt-1 text-sm text-muted-foreground">
                برای هماهنگی و رزرو تور
              </p>
            </div>
          </div>

    
          {/* زمان پاسخ */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-background
              p-5
            "
          >
            <h2 className="mb-2 font-semibold text-primary">
              پشتیبانی و پاسخگویی
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              برای اطلاع از ظرفیت باقی‌مانده تورها، تاریخ حرکت،
              شرایط رزرو و سایر جزئیات سفر می‌توانید با ما در
              ارتباط باشید. معمولاً در کمتر از ۲۴ ساعت پاسخ می‌دهیم.
            </p>
          </div>

          {/* دکمه‌های ارتباطی */}

          <div className="border-t border-border pt-6">

            <h2 className="mb-4 text-center text-lg font-semibold text-primary">
              ارتباط سریع
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

              {/* واتساپ */}

              <a
                href="https://wa.me/989171050134"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-4
                  py-3
                  font-bold
                  text-primary-foreground
                  shadow-lg
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                "
              >
                <MessageCircle size={20} />

                <span>
                  واتساپ
                </span>
              </a>

        {/* بله */}

<a
    href="https://ble.ir/nrasteh"

  target="_blank"
  rel="noopener noreferrer"
  aria-label="ارتباط در بله"
  className="
    flex
    min-h-[52px]
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-border
    bg-secondary
    px-4
    py-3
    font-bold
    text-secondary-foreground
    transition
    hover:bg-accent
    hover:text-accent-foreground
    active:scale-[0.98]
  "
>
  <Image
    src="/icons/logo82.png"
    alt="بله"
    width={20}
    height={20}
    className="object-contain"
  />

  <span>
    بله
  </span>
</a>
              {/* تماس */}

              <a
                href="tel:+989171050134"
                className="
                  flex
                  min-h-[52px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  bg-accent
                  px-4
                  py-3
                  font-bold
                  text-accent-foreground
                  shadow-lg
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                "
              >
                <Phone size={20} />

                <span>
                  تماس تلفنی
                </span>
              </a>

            </div>
          </div>

        </div>

        {/* متن پایین صفحه */}

        <div className="mt-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            قبل از رزرو تور، می‌توانید برای دریافت اطلاعات کامل
            درباره مقصد، برنامه سفر، اقامت، حمل‌ونقل و شرایط تور
            با پشتیبانی در ارتباط باشید.
          </p>
        </div>

      </div>
    </div>
  );
}