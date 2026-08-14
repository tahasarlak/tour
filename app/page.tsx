import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";

import ProductCard from "@/components/ProductCard";
import FeaturedSlider from "@/components/FeaturedSlider";

export default async function HomePage() {
  // ==========================================
  // FEATURED TOURS
  // ==========================================

  const featuredTours = await prisma.tour.findMany({
    where: {
      isSpecial: true,
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ==========================================
          HERO
      ========================================== */}

      <section
        className="
          relative
          flex
          min-h-[600px]
          items-center
          justify-center
          overflow-hidden
        "
      >
        {/* Background */}

        <Image
          src="/images/hero-bg.jpg"
          alt="تورهای گردشگری"
          fill
          className="object-cover opacity-50"
          priority
        />

        {/* Overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-b
            from-background/10
            via-background/40
            to-background
          "
        />

        {/* Content */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-6xl
            px-4
            py-20
            text-center
            md:py-32
          "
        >
          <p
            className="
              mb-4
              text-sm
              font-semibold
              uppercase
              tracking-[3px]
              text-primary
            "
          >
            سفر • تجربه • کشف
          </p>

          <h1
            className="
              mb-6
              text-4xl
              font-bold
              leading-tight
              text-foreground
              md:text-5xl
              lg:text-6xl
            "
          >
            سفرهای فراموش‌نشدنی

            <span className="mt-2 block text-primary">
              با تورهای ویژه ما
            </span>
          </h1>

          <p
            className="
              mx-auto
              mb-10
              max-w-2xl
              text-lg
              leading-relaxed
              text-muted-foreground
              md:text-xl
            "
          >
            مقصدهای جذاب را کشف کنید و با
            برنامه‌ریزی حرفه‌ای، تجربه‌ای متفاوت
            از سفر داشته باشید.
          </p>

          <div
            className="
              flex
              flex-col
              justify-center
              gap-4
              sm:flex-row
            "
          >
            {/* Tours */}

            <Link
              href="/products/tours"
              className="
                rounded-xl
                bg-primary
                px-8
                py-3.5
                text-lg
                font-bold
                text-primary-foreground
                shadow-lg
                shadow-primary/20
                transition
                hover:opacity-90
              "
            >
              مشاهده تورها
            </Link>

            {/* Contact */}

            <Link
              href="/contact"
              className="
                rounded-xl
                border
                border-primary/40
                bg-card/80
                px-8
                py-3.5
                text-lg
                font-bold
                text-primary
                backdrop-blur-sm
                transition
                hover:bg-primary
                hover:text-primary-foreground
              "
            >
              مشاوره و رزرو
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURED TOURS
      ========================================== */}

      <section className="mx-auto max-w-6xl px-4 py-16">
        {/* Header */}

        <div className="mb-12 text-center">
          <p
            className="
              mb-3
              text-sm
              font-semibold
              uppercase
              tracking-[3px]
              text-primary
            "
          >
            پیشنهاد ویژه
          </p>

          <h2
            className="
              mb-3
              text-3xl
              font-bold
              text-foreground
              sm:text-4xl
            "
          >
            تورهای ویژه
          </h2>

          <p className="text-muted-foreground">
            منتخب بهترین تورهای گردشگری برای یک
            سفر به‌یادماندنی
          </p>
        </div>

        {/* Mobile */}

        <div className="md:hidden">
          <FeaturedSlider products={featuredTours} />
        </div>

        {/* Tablet / Desktop */}

        <div
          className="
            hidden
            grid-cols-1
            gap-9
            md:grid
            md:grid-cols-3
          "
        >
          {featuredTours.map((tour) => (
            <ProductCard
              key={tour.id}
              product={{
                id: tour.id,
                slug: tour.slug,
                name: tour.name,
                shortDescription:
                  tour.shortDescription,
                image: tour.image,
                price: tour.price,
                currency: tour.currency,
                discountPercentage:
                  tour.discountPercentage,
                discountedPrice:
                  tour.discountedPrice,
                isPublished:
                  tour.isPublished,
                isSpecial:
                  tour.isSpecial,
              }}
              type="tour"
            />
          ))}
        </div>

        {/* All Tours */}

        <div className="mt-10 text-center">
          <Link
            href="/products/tours"
            className="
              inline-block
              rounded-xl
              bg-primary
              px-8
              py-3.5
              font-bold
              text-primary-foreground
              shadow-lg
              shadow-primary/10
              transition
              hover:opacity-90
            "
          >
            مشاهده همه تورها
          </Link>
        </div>
      </section>

      {/* ==========================================
          WHY US
      ========================================== */}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <p
            className="
              mb-3
              text-sm
              font-semibold
              uppercase
              tracking-[3px]
              text-primary
            "
          >
            چرا ما؟
          </p>

          <h2
            className="
              mb-3
              text-3xl
              font-bold
              text-foreground
              sm:text-4xl
            "
          >
            چرا با ما سفر کنیم؟
          </h2>

          <p
            className="
              mx-auto
              max-w-2xl
              text-muted-foreground
            "
          >
            تلاش ما این است که از انتخاب مقصد تا
            پایان سفر، تجربه‌ای راحت و لذت‌بخش
            داشته باشید.
          </p>
        </div>

        {/* Benefits */}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 1 */}

          <div
            className="
              rounded-2xl
              border
              border-primary/20
              bg-card
              p-8
              text-center
              shadow-sm
              transition
              hover:border-primary/40
              hover:shadow-lg
              hover:shadow-primary/5
            "
          >
            <div
              className="
                mb-4
                text-5xl
                font-bold
                text-primary
              "
            >
              ۱
            </div>

            <h3
              className="
                mb-3
                font-semibold
                text-card-foreground
              "
            >
              برنامه‌ریزی حرفه‌ای
            </h3>

            <p
              className="
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              برنامه سفر با دقت طراحی می‌شود تا
              بتوانید از زمان خود بیشترین استفاده
              را ببرید.
            </p>
          </div>

          {/* 2 */}

          <div
            className="
              rounded-2xl
              border
              border-primary/20
              bg-card
              p-8
              text-center
              shadow-sm
              transition
              hover:border-primary/40
              hover:shadow-lg
              hover:shadow-primary/5
            "
          >
            <div
              className="
                mb-4
                text-5xl
                font-bold
                text-primary
              "
            >
              ۲
            </div>

            <h3
              className="
                mb-3
                font-semibold
                text-card-foreground
              "
            >
              مقصدهای جذاب
            </h3>

            <p
              className="
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              بهترین مقصدها و تجربه‌های گردشگری را
              برای یک سفر متفاوت انتخاب کرده‌ایم.
            </p>
          </div>

          {/* 3 */}

          <div
            className="
              rounded-2xl
              border
              border-primary/20
              bg-card
              p-8
              text-center
              shadow-sm
              transition
              hover:border-primary/40
              hover:shadow-lg
              hover:shadow-primary/5
            "
          >
            <div
              className="
                mb-4
                text-5xl
                font-bold
                text-primary
              "
            >
              ۳
            </div>

            <h3
              className="
                mb-3
                font-semibold
                text-card-foreground
              "
            >
              پشتیبانی در سفر
            </h3>

            <p
              className="
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              قبل و در طول سفر می‌توانید برای
              دریافت راهنمایی و پشتیبانی با ما
              در ارتباط باشید.
            </p>
          </div>
        </div>

        {/* CTA */}

        <div className="mt-12 text-center">
          <Link
                        href="/products/tours"

            className="
              inline-block
              rounded-xl
              bg-primary
              px-8
              py-3.5
              text-lg
              font-bold
              text-primary-foreground
              shadow-lg
              shadow-primary/10
              transition
              hover:opacity-90
            "
          >
            شروع یک سفر جدید
          </Link>
        </div>
      </section>
    </div>
  );
}