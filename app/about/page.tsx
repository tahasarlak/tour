import { MessageCircle, Send, Phone } from "lucide-react";

export default function AboutPage() {
  const trustItems = [
    {
      title: "تجربه در برگزاری تور",
      desc: "برنامه‌ریزی و اجرای تورها با تمرکز بر تجربه‌ای راحت، منظم و خاطره‌انگیز برای مسافران.",
    },
    {
      title: "برنامه‌ریزی دقیق سفر",
      desc: "برنامه سفر، اقامت، حمل‌ونقل و بازدیدها از قبل با دقت برنامه‌ریزی می‌شوند.",
    },
    {
      title: "اقامت و خدمات مناسب",
      desc: "تلاش می‌کنیم برای هر تور، اقامت و خدماتی متناسب با شرایط و بودجه مسافران فراهم کنیم.",
    },
    {
      title: "پشتیبانی مستقیم",
      desc: "در طول مراحل رزرو و سفر، برای پاسخگویی به سؤالات و راهنمایی مسافران در کنار شما هستیم.",
    },
    {
      title: "تورهای متنوع",
      desc: "از سفرهای شهری و طبیعت‌گردی تا تورهای خارجی و سفرهای گروهی، انتخاب‌های متنوعی برای شما داریم.",
    },
    {
      title: "چرا با ما سفر کنم؟",
      desc: "هدف ما این است که سفر را برای شما ساده‌تر، مطمئن‌تر و لذت‌بخش‌تر کنیم.",
    },
  ];

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-3xl px-4 py-16"
    >
      {/* =========================================
          TITLE
      ========================================= */}

      <h1 className="mb-8 text-center text-3xl font-bold text-primary">
        درباره ما
      </h1>

      {/* =========================================
          INTRO
      ========================================= */}

      <div className="mb-12 space-y-5 leading-relaxed text-foreground">
        <p>
          ما با هدف ایجاد یک تجربه متفاوت و لذت‌بخش برای مسافران،
          در زمینه طراحی و برگزاری تورهای داخلی و خارجی فعالیت می‌کنیم.
        </p>

        <p>
          تلاش ما این است که هر سفر از مرحله انتخاب مقصد و رزرو
          تا پایان سفر، با برنامه‌ریزی دقیق و پشتیبانی مناسب همراه باشد.
        </p>

        <p>
          برای ما فقط مقصد مهم نیست؛ کیفیت مسیر، اقامت، برنامه سفر
          و آرامش مسافر هم بخش مهمی از یک سفر خوب است.
        </p>

        <p>
          اگر درباره تورها، مقصدها، شرایط ثبت‌نام یا برنامه سفر
          سؤالی دارید، از طریق راه‌های ارتباطی زیر با ما در تماس باشید.
        </p>
      </div>

      {/* =========================================
          WHY US
      ========================================= */}

      <div className="mb-12 space-y-10">
        <div>
          <h2 className="mb-6 text-center text-2xl font-bold text-primary">
            چرا به ما اعتماد کنم؟
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {trustItems.map((item, i) => (
              <div
                key={i}
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-6
                  text-card-foreground
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-primary/40
                  hover:shadow-md
                "
              >
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-primary">
                  <span className="text-primary">✓</span>
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            ABOUT US
        ========================================= */}

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-10
            text-card-foreground
            shadow-sm
          "
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-primary">
            درباره تیم ما
          </h2>

          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            {/* IMAGE */}

            <div
              className="
                h-40
                w-40
                flex-shrink-0
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-muted
                md:h-48
                md:w-48
              "
            >
              <img
                src="/images/travel-team.jpg"
                alt="تیم برگزارکننده تور"
                className="h-full w-full object-cover"
              />
            </div>

            {/* INFO */}

            <div className="flex-1 leading-relaxed text-foreground">
              <p className="mb-2 text-xl font-semibold text-primary">
                تیم گردشگری ما
              </p>

              <p className="mb-4 text-primary/80">
                همراه شما برای ساختن یک سفر خاطره‌انگیز
              </p>

              <p className="text-sm leading-7 text-muted-foreground">
                ما تلاش می‌کنیم با شناخت بهتر مقصدها و توجه به نیازهای
                مسافران، تورهایی با برنامه‌ریزی مناسب و خدمات قابل اعتماد
                ارائه کنیم.
              </p>

              <div className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
                <p className="text-foreground">
                  <span className="font-semibold text-primary">✓</span>{" "}
                  برنامه‌ریزی دقیق سفر
                </p>

                <p className="text-foreground">
                  <span className="font-semibold text-primary">✓</span>{" "}
                  پشتیبانی قبل و هنگام سفر
                </p>

                <p className="text-foreground">
                  <span className="font-semibold text-primary">✓</span>{" "}
                  توجه به کیفیت و رضایت مسافران
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            TRAVEL EXPERIENCE
        ========================================= */}

        <div className="space-y-8">
          <div
            className="
              rounded-3xl
              border
              border-border
              bg-card
              p-9
              text-card-foreground
              shadow-sm
            "
          >
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-primary">
              🌍 تجربه سفر با ما
            </h3>

            <div
              className="
                rounded-3xl
                border
                border-border
                bg-background
                p-8
                text-center
                shadow-sm
                transition-transform
                duration-300
                hover:scale-105
              "
            >
              <p className="text-5xl font-bold tracking-tighter text-primary sm:text-6xl">
                سفر
              </p>

              <p className="mt-3 text-xs uppercase tracking-[3px] text-muted-foreground">
                مقصد جدید، تجربه‌ای جدید
              </p>
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://t.me/romdental/3503?single"
                target="_blank"
                rel="noopener noreferrer"
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
                <MessageCircle size={28} />

                <span>
                  مشاهده تجربیات مسافران و ارتباط مستقیم در تلگرام
                </span>
              </a>
            </div>
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
          {/* TELEGRAM */}

          <a
            href="https://t.me/Ahmadreza_raste"
            target="_blank"
            rel="noopener noreferrer"
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
            <MessageCircle size={20} />
            تلگرام
          </a>

          {/* WHATSAPP */}

          <a
            href="https://wa.me/79254212300"
            target="_blank"
            rel="noopener noreferrer"
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
            واتساپ
          </a>

          {/* PHONE */}

          <a
            href="tel:+79254212300"
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
            تماس تلفنی
          </a>
        </div>
      </div>
    </div>
  );
}