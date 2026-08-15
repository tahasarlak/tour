import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

import ProductPageContent from "@/components/product/ProductPageContent";

import {
  PRODUCT_TYPES,
  type ProductType,
} from "@/lib/product-types";

// ==========================================
// FORCE DYNAMIC
// ==========================================

export const dynamic = "force-dynamic";

// ==========================================
// TYPES
// ==========================================

type Props = {
  params: Promise<{
    type: string;
    slug: string;
  }>;
};

// ==========================================
// STATIC PARAMS
// ==========================================

export async function generateStaticParams() {
  const [
    tours,
    trainTickets,
    flightTickets,
    accommodations,
    touristVisas,
  ] = await Promise.all([
    prisma.tour.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
    }),

    prisma.trainTicket.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
    }),

    prisma.flightTicket.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
    }),

    prisma.accommodation.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
    }),

    prisma.touristVisa.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
    }),
  ]);

  return [
    // =========================
    // TOURS
    // =========================

    ...tours.map((item) => ({
      type: "tour",
      slug: item.slug,
    })),

    // =========================
    // TRAIN
    // =========================

    ...trainTickets.map((item) => ({
      type: "train",
      slug: item.slug,
    })),

    // =========================
    // FLIGHT
    // =========================

    ...flightTickets.map((item) => ({
      type: "flight",
      slug: item.slug,
    })),

    // =========================
    // ACCOMMODATION
    // =========================

    ...accommodations.map((item) => ({
      type: "accommodation",
      slug: item.slug,
    })),

    // =========================
    // VISA
    // =========================

    ...touristVisas.map((item) => ({
      type: "visa",
      slug: item.slug,
    })),
  ];
}

// ==========================================
// PRODUCT PAGE
// ==========================================

export default async function ProductPage({
  params,
}: Props) {
  const { type, slug } = await params;

  // ========================================
  // VALIDATE TYPE
  // ========================================

  if (!PRODUCT_TYPES.includes(type as ProductType)) {
    notFound();
  }

  const productType = type as ProductType;

  // ========================================
  // ADMIN SESSION
  // ========================================

  const adminSession = await getAdminSession();

  const isAdmin = !!adminSession;

  // ========================================
  // FIND PRODUCT
  // ========================================

  let product;

  switch (productType) {
    // ======================================
    // TOUR
    // ======================================

    case "tour":
      product = await prisma.tour.findUnique({
        where: {
          slug,
        },
      });
      break;

    // ======================================
    // TRAIN TICKET
    // ======================================

    case "train":
      product =
        await prisma.trainTicket.findUnique({
          where: {
            slug,
          },
        });
      break;

    // ======================================
    // FLIGHT TICKET
    // ======================================

    case "flight":
      product =
        await prisma.flightTicket.findUnique({
          where: {
            slug,
          },
        });
      break;

    // ======================================
    // ACCOMMODATION
    // ======================================

    case "accommodation":
      product =
        await prisma.accommodation.findUnique({
          where: {
            slug,
          },
        });
      break;

    // ======================================
    // TOURIST VISA
    // ======================================

    case "visa":
      product =
        await prisma.touristVisa.findUnique({
          where: {
            slug,
          },
        });
      break;

    default:
      notFound();
  }

  // ========================================
  // NOT FOUND
  // ========================================

  if (!product) {
    notFound();
  }

  // ========================================
  // HIDDEN PRODUCT
  // فقط Admin می‌تواند ببیند
  // ========================================

  if (!product.isPublished && !isAdmin) {
    notFound();
  }

  // ========================================
  // NORMALIZE PRICE
  // ========================================

  const normalizedProduct = {
    ...product,

    price: Number(product.price),

    discountedPrice:
      product.discountedPrice !== null
        ? Number(product.discountedPrice)
        : null,

    discountPercentage:
      product.discountPercentage ?? 0,

    capacity:
      "capacity" in product &&
      product.capacity !== null
        ? Number(product.capacity)
        : null,

    remainingCapacity:
      "remainingCapacity" in product &&
      product.remainingCapacity !== null
        ? Number(product.remainingCapacity)
        : null,
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <ProductPageContent
      type={productType}
      product={normalizedProduct}
      isAdmin={isAdmin}
    />
  );
}