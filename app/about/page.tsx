"use client";

import Image from "next/image";
import { Send, Phone } from "lucide-react";

export default function AboutPage() {
  return (
    <div
      dir="rtl"
      className="mx-auto max-w-3xl px-4 py-16"
    >
      {/* =========================================
          TITLE
      ========================================= */}

      <h1 className="mb-8 text-center text-3xl font-bold text-primary">
        درباره سفرخوش
      </h1>

      {/* =========================================
          ABOUT SAFARKHOSH
      ========================================= */}

      <div className="mb-12 space-y-5 leading-relaxed text-foreground">
        <h2 className="text-2xl font-bold text-primary">
          سفرخوش؛ همراه شما برای یک سفر خاطره‌انگیز
        </h2>

        <p>
          سفرخوش با هدف ارائه خدمات حرفه‌ای گردشگری و مسافرتی،
          همراه شماست تا برنامه‌ریزی و رزرو سفر را ساده‌تر،
          مطمئن‌تر و لذت‌بخش‌تر تجربه کنید.
        </p>

        <p>
          ما در سفرخوش تلاش می‌کنیم با ارائه مجموعه‌ای از خدمات
          گردشگری، متناسب با نیاز و بودجه شما، بهترین گزینه‌ها را
          در اختیارتان قرار دهیم؛ از انتخاب مقصد و رزرو هتل گرفته
          تا تهیه بلیط و برنامه‌ریزی تورهای داخلی و خارجی.
        </p>
      </div>

      {/* =========================================
          WHY SAFARKHOSH
      ========================================= */}

      <div className="mb-12 space-y-8">
        <div>
          <h2 className="mb-5 text-center text-2xl font-bold text-primary">
            چرا سفرخوش؟
          </h2>

          <p className="text-center leading-8 text-muted-foreground">
            ما باور داریم یک سفر خوب، از برنامه‌ریزی درست شروع می‌شود.
            به همین دلیل تلاش می‌کنیم خدماتی با کیفیت، قیمت مناسب
            و پشتیبانی قابل اعتماد ارائه دهیم تا شما با خیال راحت سفر کنید.
          </p>

          <p className="mt-5 text-center font-semibold text-primary">
            سفرخوش، از انتخاب مقصد تا بازگشت به خانه، همراه شماست.
          </p>
        </div>

        {/* =========================================
            FEATURES
        ========================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* سفر خوش، خاطره‌ساز */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              text-center
              text-card-foreground
              shadow-sm
              transition-all
              duration-300
              hover:border-primary/40
              hover:shadow-md
            "
          >
            <h3 className="mb-3 text-lg font-semibold text-primary">
              سفر خوش، خاطره‌ساز
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              تلاش می‌کنیم هر سفر برای شما به تجربه‌ای شیرین،
              لذت‌بخش و به‌یادماندنی تبدیل شود.
            </p>
          </div>

          {/* سفری امن و مطمئن */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              text-center
              text-card-foreground
              shadow-sm
              transition-all
              duration-300
              hover:border-primary/40
              hover:shadow-md
            "
          >
            <h3 className="mb-3 text-lg font-semibold text-primary">
              سفری امن و مطمئن
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              با خیال راحت و بدون نگرانی، برنامه‌ریزی سفر خود را
              به ما بسپارید و از مسیر سفر لذت ببرید.
            </p>
          </div>

          {/* سفری با کیفیت */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              text-center
              text-card-foreground
              shadow-sm
              transition-all
              duration-300
              hover:border-primary/40
              hover:shadow-md
            "
          >
            <h3 className="mb-3 text-lg font-semibold text-primary">
              سفری با کیفیت
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              با ارائه خدمات مناسب و باکیفیت تلاش می‌کنیم
              بهترین تجربه ممکن را برای شما فراهم کنیم.
            </p>
          </div>

          {/* سریع و در دسترس */}

          <div
            className="
              rounded-2xl
              border
              border-border
              bg-card
              p-6
              text-center
              text-card-foreground
              shadow-sm
              transition-all
              duration-300
              hover:border-primary/40
              hover:shadow-md
            "
          >
            <h3 className="mb-3 text-lg font-semibold text-primary">
              سریع و در دسترس
            </h3>

            <p className="text-sm leading-7 text-muted-foreground">
              امکان تهیه بلیط و رزرو تورهای مختلف را در هر زمان
              برای شما فراهم می‌کنیم.
            </p>
          </div>

        </div>
      </div>

      {/* =========================================
          CONTACT
      ========================================= */}

      <div
        className="
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          text-card-foreground
          shadow-sm
        "
      >
        <h2 className="mb-5 text-center text-xl font-semibold text-primary">
          راه‌های ارتباطی
        </h2>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">

          {/* =========================================
              BALE
          ========================================= */}

          <a
            href="https://ble.ir/nrasteh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ارتباط در بله"
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-border
              bg-secondary
              px-5
              py-3
              font-medium
              text-secondary-foreground
              transition
              hover:bg-accent
              hover:text-accent-foreground
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

          {/* =========================================
              WHATSAPP
          ========================================= */}

          <a
            href="https://wa.me/989171050134"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ارتباط در واتساپ"
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-primary
              px-5
              py-3
              font-medium
              text-primary-foreground
              transition
              hover:opacity-90
            "
          >
            <Send size={20} />

            <span>
              واتساپ
            </span>
          </a>

          {/* =========================================
              PHONE
          ========================================= */}

          <a
            href="tel:+989171050134"
            aria-label="تماس تلفنی"
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-border
              bg-secondary
              px-5
              py-3
              font-medium
              text-secondary-foreground
              transition
              hover:bg-accent
              hover:text-accent-foreground
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
  );
}