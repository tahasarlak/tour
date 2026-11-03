import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

import ProductCard from "@/components/ProductCard";
import CreateButton from "@/components/Button/CreateButton";

import {
  PRODUCT_TYPES,
  type ProductType,
} from "@/lib/product-types";

type Props = {
  params: Promise<{
    type: string;
  }>;
};

export default async function ProductListPage({
  params,
}: Props) {
  const { type } = await params;

  // ==========================================
  // VALIDATE TYPE
  // ==========================================

  if (!PRODUCT_TYPES.includes(type as ProductType)) {
    notFound();
  }

  const productType = type as ProductType;

  // ==========================================
  // ADMIN
  // ==========================================

  const session = await getAdminSession();

  const isAdmin = !!session;

  // ==========================================
  // WHERE
  // ==========================================

  const where = isAdmin
    ? undefined
    : {
        isPublished: true,
      };

  // ==========================================
  // PRODUCTS
  // ==========================================

  let products;

  switch (productType) {
    case "bus":
  products =
    await prisma.busTicket.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  break;
    // ========================================
    // TOUR
    // ========================================

    case "tour":
      products = await prisma.tour.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });
      break;

    // ========================================
    // TRAIN TICKET
    // ========================================

    case "train":
      products =
        await prisma.trainTicket.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
        });
      break;

    // ========================================
    // FLIGHT TICKET
    // ========================================

    case "flight":
      products =
        await prisma.flightTicket.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
        });
      break;

    // ========================================
    // ACCOMMODATION
    // ========================================

    case "accommodation":
      products =
        await prisma.accommodation.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
        });
      break;

    // ========================================
    // TOURIST VISA
    // ========================================

    case "visa":
      products =
        await prisma.touristVisa.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
        });
      break;

    default:
      notFound();
  }

  // ==========================================
  // NO PRODUCTS
  // ==========================================

  

  // ==========================================
  // TITLES
  // ==========================================

const titles: Record<ProductType, string> = {
  tour: "همه تورها",
  train: "بلیط‌های قطار",
  flight: "بلیط‌های هواپیما",
  bus: "بلیط‌های اتوبوس",
  accommodation: "اقامتگاه‌ها",
  visa: "ویزای توریستی",
};
  // ==========================================
  // DESCRIPTIONS
  // ==========================================

const descriptions: Record<ProductType, string> = {
  tour:
    "تورهای گردشگری را مشاهده کنید و مقصد مناسب خود را برای یک سفر خاطره‌انگیز انتخاب نمایید.",

  train:
    "بلیط‌های قطار را مشاهده کنید و مسیر و زمان مناسب سفر ریلی خود را انتخاب نمایید.",

  flight:
    "بلیط‌های هواپیما را مشاهده کنید و پرواز مناسب خود را با بهترین شرایط انتخاب نمایید.",

  bus:
    "بلیط‌های اتوبوس را مشاهده کنید و مسیر و زمان مناسب سفر خود را انتخاب نمایید.",

  accommodation:
    "اقامتگاه‌های موجود را مشاهده کنید و هتل یا محل اقامت مناسب خود را برای سفر انتخاب نمایید.",

  visa:
    "خدمات ویزای توریستی کشورهای مختلف را مشاهده کنید و درخواست ویزای مناسب خود را ثبت نمایید.",
};

  // ==========================================
  // RENDER
  // ==========================================

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
            خدمات سفر
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
            {titles[productType]}
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
            {descriptions[productType]}
          </p>

          {/* ====================================
              CREATE
          ==================================== */}

          {isAdmin && (
            <div className="mt-8 flex justify-center">
              <CreateButton
                type={productType}
              />
            </div>
          )}
        </header>

        {/* ======================================
            PRODUCTS
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
       {products.map((product) => (
  <ProductCard
    key={product.id}
    product={{
      id: product.id,

      slug: product.slug,

      name: product.name ?? "",

      shortDescription:
        product.shortDescription,

      image: product.image,

      // Prisma Decimal → number
      price: Number(product.price),

      currency:
        product.currency,

      discountPercentage:
        product.discountPercentage,

      // Prisma Decimal → number | null
      discountedPrice:
        product.discountedPrice !== null
          ? Number(product.discountedPrice)
          : null,

      isPublished:
        product.isPublished,

      isSpecial:
        product.isSpecial,
    }}
    type={productType}
    showAdminActions={isAdmin}
  />
))}
        </div>
      </div>
    </main>
  );
}
