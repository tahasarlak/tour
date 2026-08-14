import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

import ProductCard from "@/components/ProductCard";
import CreateButton from "@/components/Button/CreateButton";

export default async function TourListPage() {
  // ==========================================
  // ADMIN SESSION
  // ==========================================

  const session = await getAdminSession();

  const isAdmin = !!session;

  // ==========================================
  // TOURS
  // ==========================================

  const tours = await prisma.tour.findMany({
    where: isAdmin
      ? undefined
      : {
          isPublished: true,
        },

    orderBy: {
      createdAt: "desc",
    },
  });

  // ==========================================
  // NO TOURS
  // ==========================================

  if (tours.length === 0) {
    notFound();
  }

  return (
    <main
      className="
        min-h-screen
        bg-background
        pb-16
        text-foreground
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          pt-10
          sm:px-6
          sm:pt-12
          lg:px-8
        "
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <header
          className="
            mb-12
            text-center
            sm:mb-16
          "
        >
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
            تورهای گردشگری
          </p>

          <h1
            className="
              mb-5
              text-4xl
              font-bold
              text-foreground
              sm:text-5xl
              md:text-6xl
            "
          >
            همه تورها
          </h1>

          <p
            className="
              mx-auto
              max-w-2xl
              text-base
              leading-8
              text-muted-foreground
              sm:text-lg
            "
          >
            لیست تورهای گردشگری را مشاهده کنید
            و مقصد مناسب خود را برای یک سفر
            خاطره‌انگیز انتخاب نمایید.
          </p>

          {/* ====================================
              CREATE TOUR
          ==================================== */}

          {isAdmin && (
            <div className="mt-8 flex justify-center">
              <CreateButton type="tour" />
            </div>
          )}
        </header>

        {/* ======================================
            TOURS
        ====================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            md:grid-cols-2
            md:gap-8
            lg:grid-cols-3
          "
        >
          {tours.map((tour) => (
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
              showAdminActions={isAdmin}
            />
          ))}
        </div>
      </div>
    </main>
  );
}