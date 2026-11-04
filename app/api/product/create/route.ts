import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

import {
  PRODUCT_TYPES,
  type ProductType,
} from "@/lib/product-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = {
  type?: unknown;
  name?: unknown;
  price?: unknown;
  currency?: unknown;
};

function isProductType(
  value: unknown
): value is ProductType {
  return PRODUCT_TYPES.includes(
    value as ProductType
  );
}

// ==========================================
// CREATE SLUG
// ==========================================

function createBaseSlug(
  name: string,
  type: ProductType
): string {
  const slug = name
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `${type}-${Date.now()}`;
}

// ==========================================
// CHECK SLUG
// ==========================================

async function slugExists(
  type: ProductType,
  slug: string
): Promise<boolean> {
  switch (type) {
    case "tour":
      return Boolean(
        await prisma.tour.findUnique({
          where: { slug },
          select: { id: true },
        })
      );

    case "train":
      return Boolean(
        await prisma.trainTicket.findUnique({
          where: { slug },
          select: { id: true },
        })
      );

    case "flight":
      return Boolean(
        await prisma.flightTicket.findUnique({
          where: { slug },
          select: { id: true },
        })
      );

    case "bus":
      return Boolean(
        await prisma.busTicket.findUnique({
          where: { slug },
          select: { id: true },
        })
      );

    case "accommodation":
      return Boolean(
        await prisma.accommodation.findUnique({
          where: { slug },
          select: { id: true },
        })
      );

    case "visa":
      return Boolean(
        await prisma.touristVisa.findUnique({
          where: { slug },
          select: { id: true },
        })
      );
  }
}

// ==========================================
// UNIQUE SLUG
// ==========================================

async function getUniqueSlug(
  type: ProductType,
  name: string
): Promise<string> {
  const baseSlug = createBaseSlug(name, type);

  let candidate = baseSlug;
  let suffix = 1;

  while (
    await slugExists(type, candidate)
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return candidate;
}

// ==========================================
// POST
// ==========================================

export async function POST(
  request: Request
) {
  try {
    // ADMIN AUTH

    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی غیرمجاز است.",
        },
        { status: 401 }
      );
    }

    // READ BODY

    let body: CreateBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "اطلاعات ارسالی معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // PRODUCT TYPE

    const typeValue = String(
      body.type ?? ""
    ).trim();

    if (!isProductType(typeValue)) {
      return NextResponse.json(
        {
          success: false,
          error: "نوع محصول معتبر نیست.",
        },
        { status: 400 }
      );
    }

    const type: ProductType = typeValue;

    // NAME

    const name = String(
      body.name ?? ""
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "نام محصول الزامی است.",
        },
        { status: 400 }
      );
    }

    // PRICE

    const priceText = String(
      body.price ?? ""
    )
      .replace(/,/g, "")
      .trim();

    const numericPrice = Number(priceText);

    if (
      !priceText ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "قیمت محصول معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // CURRENCY

    const currency =
      String(body.currency ?? "تومان").trim() ||
      "تومان";

    // SLUG

    const slug = await getUniqueSlug(
      type,
      name
    );

    // ======================================
    // CREATE DRAFT
    // ======================================

    let product: {
      id: number;
      slug: string;
    } | null = null;

    switch (type) {

      // TOUR

      case "tour": {
        product = await prisma.tour.create({
          data: {
            name,
            slug,
            price: priceText,
            currency,
            destination: "",
            isPublished: false,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        break;
      }

      // TRAIN

      case "train": {
        product =
          await prisma.trainTicket.create({
            data: {
              name,
              slug,
              price: priceText,
              currency,
              isPublished: false,
            },
            select: {
              id: true,
              slug: true,
            },
          });

        break;
      }

      // FLIGHT

      case "flight": {
        product =
          await prisma.flightTicket.create({
            data: {
              name,
              slug,
              price: priceText,
              currency,
              isPublished: false,
            },
            select: {
              id: true,
              slug: true,
            },
          });

        break;
      }

      // BUS

      case "bus": {
        product =
          await prisma.busTicket.create({
            data: {
              name,
              slug,
              price: priceText,
              currency,
              isPublished: false,
            },
            select: {
              id: true,
              slug: true,
            },
          });

        break;
      }

      // ACCOMMODATION

      case "accommodation": {
        product =
          await prisma.accommodation.create({
            data: {
              name,
              slug,
              price: priceText,
              currency,
              city: "",
              isPublished: false,
            },
            select: {
              id: true,
              slug: true,
            },
          });

        break;
      }

      // VISA

      case "visa": {
        product =
          await prisma.touristVisa.create({
            data: {
              name,
              slug,
              price: priceText,
              currency,
              country: "",
              isPublished: false,
            },
            select: {
              id: true,
              slug: true,
            },
          });

        break;
      }
    }

    if (!product) {
      throw new Error(
        "ساخت محصول در دیتابیس انجام نشد."
      );
    }

    console.log(
      "[PRODUCT CREATE] Draft created",
      {
        type,
        id: product.id,
        slug: product.slug,
        name,
        price: priceText,
        isPublished: false,
      }
    );

    return NextResponse.json(
      {
        success: true,
        type,
        product,
        message:
          "محصول به‌صورت پیش‌نویس ساخته شد.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "[PRODUCT CREATE] Error",
      error
    );

    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String(
            (error as { code?: unknown }).code
          )
        : "";

    if (code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error:
            "این شناسه قبلاً استفاده شده است. دوباره تلاش کن.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "خطا در ساخت محصول.",
      },
      { status: 500 }
    );
  }
}
