// app/tours/[slug]/page.tsx

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

import ProductPageContent from "@/components/product/ProductPageContent";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// ==========================================
// STATIC PARAMS
// ==========================================

export async function generateStaticParams() {
  const tours = await prisma.tour.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
    },
  });

  return tours.map((tour) => ({
    slug: tour.slug,
  }));
}

// ==========================================
// TOUR PAGE
// ==========================================

export default async function TourPage({
  params,
}: Props) {
  const { slug } = await params;

  // ========================================
  // ADMIN
  // ========================================

  const adminSession = await getAdminSession();

  const isAdmin = !!adminSession;

  // ========================================
  // FIND TOUR
  // ========================================

  const tour = await prisma.tour.findUnique({
    where: {
      slug,
    },
  });

  // ========================================
  // NOT FOUND
  // ========================================

  if (!tour) {
    notFound();
  }

  // ========================================
  // HIDDEN TOUR
  // فقط Admin می‌تواند ببیند
  // ========================================

  if (!tour.isPublished && !isAdmin) {
    notFound();
  }

  // ========================================
  // NORMALIZE
  // ========================================

  const normalizedTour = {
    ...tour,

    price: Number(tour.price),

    discountedPrice:
      tour.discountedPrice !== null
        ? Number(tour.discountedPrice)
        : null,

    discountPercentage:
      tour.discountPercentage ?? 0,

    capacity:
      tour.capacity !== null
        ? Number(tour.capacity)
        : null,

    remainingCapacity:
      tour.remainingCapacity !== null
        ? Number(tour.remainingCapacity)
        : null,
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <ProductPageContent
      type="tour"
      product={normalizedTour}
      isAdmin={isAdmin}
    />
  );
}