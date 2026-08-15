import Link from "next/link";
import { MessageCircle, Send, Phone, MapPin } from "lucide-react";
import Image from "next/image";
export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="bg-background text-foreground"
    >
      {/* =========================
          CONTACT / INFORMATION
      ========================= */}

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          items-center
          justify-center
          gap-8
          px-4
          py-10
          sm:px-6
          lg:flex-row
          lg:items-start
          lg:px-8
        "
      >
        {/* =========================
            ABOUT
        ========================= */}

        <div className="w-full text-center lg:text-right">
          <h3 className="mb-3 text-lg font-bold text-primary">
            تورهای گردشگری
          </h3>

          <p className="text-sm leading-7 text-muted-foreground">
            تجربه‌ای متفاوت از سفر، گردش و کشف
            مقصدهای جذاب با تورهای متنوع و باکیفیت.
          </p>
        </div>

        {/* =========================
            QUICK LINKS
        ========================= */}

        <div className="w-full text-center lg:text-right">
          <p className="mb-3 font-semibold text-primary">
            دسترسی سریع
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="block transition-colors hover:text-primary"
            >
              صفحه اصلی
            </Link>

            <Link
              href="/products/tours"
              className="block transition-colors hover:text-primary"
            >
              همه تورها
            </Link>

            <Link
              href="/about"
              className="block transition-colors hover:text-primary"
            >
              درباره ما
            </Link>

            <Link
              href="/contact"
              className="block transition-colors hover:text-primary"
            >
              تماس با ما
            </Link>
          </div>
        </div>

        {/* =========================
            FAQ
        ========================= */}

        <div className="w-full text-center lg:text-right">
          <p className="mb-3 font-semibold text-primary">
            سوالات متداول
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <Link
              href="/products/tours"
              className="block transition-colors hover:text-primary"
            >
              مشاهده تورها و مقصدها
            </Link>

            <Link
              href="/contact"
              className="block transition-colors hover:text-primary"
            >
              مشاوره و رزرو تور
            </Link>
          </div>
        </div>

        {/* =========================
            CONTACT
        ========================= */}

        <div className="w-full text-center">
          <p className="mb-4 font-semibold text-primary">
            ارتباط با ما
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {/* WhatsApp */}

            <Link
              href="https://wa.me/79254212300"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                flex-col
                items-center
                gap-2
                text-primary
                transition-colors
                hover:text-primary/70
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  transition-all
                  group-hover:scale-110
                  group-hover:border-primary/40
                "
              >
                <MessageCircle className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium">
                واتس‌اپ
              </span>
            </Link>

            {/* Telegram */}

         {/* Bale */}

<Link
  href="https://ble.ir/romdental"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="پیام در بله"
  className="
    group
    flex
    flex-col
    items-center
    gap-2
    text-primary
    transition-colors
    hover:text-primary/70
  "
>
  <div
    className="
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-2xl
      border
      border-border
      bg-card
      transition-all
      group-hover:scale-110
      group-hover:border-primary/40
    "
  >
    <Image
      src="/icons/bale.svg"
      alt="بله"
      width={22}
      height={22}
      className="object-contain"
    />
  </div>

  <span className="text-sm font-medium">
    بله
  </span>
</Link>

            {/* Phone */}

            <Link
              href="tel:+79254212300"
              className="
                group
                flex
                flex-col
                items-center
                gap-2
                text-primary
                transition-colors
                hover:text-primary/70
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  transition-all
                  group-hover:scale-110
                  group-hover:border-primary/40
                "
              >
                <Phone className="h-5 w-5" />
              </div>

              <span className="text-sm font-medium">
                تماس
              </span>
            </Link>
          </div>

          {/* Contact info */}

          <div
            className="
              mt-5
              space-y-2
              text-sm
              text-muted-foreground
            "
          >
            <p dir="ltr">+79254212300</p>

            <p>
              romdental2028@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          BOTTOM
      ========================= */}

      <div className="border-t border-border">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            items-center
            gap-4
            px-4
            py-6
            sm:px-6
            lg:px-8
          "
        >
          {/* Signature */}

          <div className="mt-2">
            {/* Light */}

            <img
              src="/images/signature2.png"
              alt=""
              className="
                mx-auto
                h-10
                max-w-[120px]
                object-contain
                dark:hidden
              "
            />

            {/* Dark */}

            <img
              src="/images/signature.png"
              alt=""
              className="
                mx-auto
                hidden
                h-10
                max-w-[120px]
                object-contain
                dark:block
              "
            />
          </div>

          {/* Location */}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-muted-foreground
            "
          >
            <MapPin className="h-3.5 w-3.5" />

            <span>
              همراه شما در مسیر یک سفر به‌یادماندنی
            </span>
          </div>

          {/* Copyright */}

          <div
            className="
              flex
              items-center
              gap-3
              text-xs
              text-muted-foreground
            "
          >
            <span className="h-px w-6 bg-border" />

            <span dir="ltr">
              THS © {new Date().getFullYear()}
            </span>

            <span className="h-px w-6 bg-border" />
          </div>
        </div>
      </div>
    </footer>
  );
}