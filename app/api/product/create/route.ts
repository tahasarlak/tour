import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { PRODUCT_TYPES, type ProductType } from "@/lib/product-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = {
  type?: unknown;
  name?: unknown;
  price?: unknown;
  currency?: unknown;
};

function isProductType(value: unknown): value is ProductType {
  return PRODUCT_TYPES.includes(value as ProductType);
}

function optionalName(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new Error("نام محصول معتبر نیست.");
  return value.trim() || null;
}

function optionalPrice(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(/,/g, "").trim();
  const number = Number(normalized);
  if (!normalized || !Number.isFinite(number) || number < 0) {
    throw new Error("قیمت باید یک عدد معتبر و غیرمنفی باشد.");
  }
  return normalized;
}

function createBaseSlug(name: string | null, type: ProductType): string {
  const latin = (name ?? "")
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return latin || `${type}-${Date.now()}-${randomUUID().slice(0, 8)}`;
}

async function slugExists(type: ProductType, slug: string): Promise<boolean> {
  switch (type) {
    case "tour": return Boolean(await prisma.tour.findUnique({ where: { slug }, select: { id: true } }));
    case "train": return Boolean(await prisma.trainTicket.findUnique({ where: { slug }, select: { id: true } }));
    case "flight": return Boolean(await prisma.flightTicket.findUnique({ where: { slug }, select: { id: true } }));
    case "bus": return Boolean(await prisma.busTicket.findUnique({ where: { slug }, select: { id: true } }));
    case "accommodation": return Boolean(await prisma.accommodation.findUnique({ where: { slug }, select: { id: true } }));
    case "visa": return Boolean(await prisma.touristVisa.findUnique({ where: { slug }, select: { id: true } }));
    default: return false;
  }
}

async function getUniqueSlug(type: ProductType, name: string | null): Promise<string> {
  const base = createBaseSlug(name, type);
  let candidate = base;
  let suffix = 1;
  while (await slugExists(type, candidate)) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "دسترسی غیرمجاز است." }, { status: 401 });
  }

  let body: CreateBody;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ success: false, error: "ساختار درخواست معتبر نیست." }, { status: 400 });
    }
    body = parsed as CreateBody;
  } catch {
    return NextResponse.json({ success: false, error: "اطلاعات ارسالی معتبر نیست." }, { status: 400 });
  }

  const typeValue = typeof body.type === "string" ? body.type.trim() : "";
  if (!isProductType(typeValue)) {
    return NextResponse.json({ success: false, error: "نوع محصول معتبر نیست." }, { status: 400 });
  }

  try {
    const type = typeValue;
    const name = optionalName(body.name);
    const price = optionalPrice(body.price);
    const currency = typeof body.currency === "string" && body.currency.trim()
      ? body.currency.trim()
      : "تومان";
    const slug = await getUniqueSlug(type, name);

    // Name, price and image are all optional. The image is uploaded after
    // the record is created, through the existing secure Vercel Blob flow.
    const data = {
      slug,
      name,
      price,
      currency,
      isSpecial: false,
      isPublished: false,
    };

    let product: { id: number; slug: string; name: string | null; price: unknown } | null = null;
    switch (type) {
      case "tour":
        product = await prisma.tour.create({ data, select: { id: true, slug: true, name: true, price: true } });
        break;
      case "train":
        product = await prisma.trainTicket.create({ data, select: { id: true, slug: true, name: true, price: true } });
        break;
      case "flight":
        product = await prisma.flightTicket.create({ data, select: { id: true, slug: true, name: true, price: true } });
        break;
      case "bus":
        product = await prisma.busTicket.create({ data, select: { id: true, slug: true, name: true, price: true } });
        break;
      case "accommodation":
        product = await prisma.accommodation.create({ data, select: { id: true, slug: true, name: true, price: true } });
        break;
      case "visa":
        product = await prisma.touristVisa.create({ data, select: { id: true, slug: true, name: true, price: true } });
        break;
    }

    if (!product) throw new Error("ساخت محصول انجام نشد.");

    return NextResponse.json({
      success: true,
      type,
      product: { ...product, price: product.price === null ? null : Number(product.price) },
      message: "محصول به‌صورت پیش‌نویس ساخته شد.",
    }, { status: 201 });
  } catch (error) {
    console.error("[PRODUCT CREATE] Error:", error);
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
    if (code === "P2002") {
      return NextResponse.json({ success: false, error: "شناسه تکراری است؛ دوباره تلاش کن." }, { status: 409 });
    }
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "خطا در ساخت محصول.",
    }, { status: 400 });
  }
}
