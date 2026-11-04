import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductType = "tour" | "train" | "flight" | "bus" | "accommodation" | "visa";
type Body = { type?: unknown; id?: unknown; field?: unknown; value?: unknown; imageUrl?: unknown };

const fieldsByType: Record<ProductType, Set<string>> = {
  tour: new Set(["name","price","currency","discountedPrice","discountPercentage","shortDescription","description","image","thumbImage","destination","country","city","duration","departureDate","returnDate","capacity","remainingCapacity","accommodation","transportation","meals","guide","meetingPoint","mapUrl","highlights","included","excluded","requirements","itinerary","gallery","isSpecial","isPublished"]),
  train: new Set(["name","price","currency","discountedPrice","discountPercentage","shortDescription","description","image","thumbImage","gallery","origin","destination","originCity","destinationCity","originStation","destinationStation","originCode","destinationCode","trainCompany","trainName","trainNumber","trainType","departureDate","arrivalDate","departureTime","arrivalTime","duration","carriageType","seatType","capacity","remainingCapacity","baggage","refundPolicy","cancellationPolicy","facilities","requirements","isSpecial","isPublished"]),
  flight: new Set(["name","price","currency","discountedPrice","discountPercentage","shortDescription","description","image","thumbImage","gallery","origin","destination","originCity","destinationCity","originAirport","destinationAirport","originAirportCode","destinationAirportCode","airline","airlineCode","flightNumber","departureDate","arrivalDate","departureTime","arrivalTime","duration","cabinClass","baggage","handBaggage","stops","refundable","refundPolicy","cancellationPolicy","facilities","requirements","capacity","remainingCapacity","isSpecial","isPublished"]),
  bus: new Set(["name","price","currency","discountedPrice","discountPercentage","shortDescription","description","image","thumbImage","gallery","origin","destination","originCity","destinationCity","originTerminal","destinationTerminal","originCode","destinationCode","busCompany","busName","busNumber","busType","departureDate","arrivalDate","departureTime","arrivalTime","duration","seatType","seatClass","capacity","remainingCapacity","baggage","refundPolicy","cancellationPolicy","facilities","requirements","isSpecial","isPublished"]),
  accommodation: new Set(["name","price","currency","discountedPrice","discountPercentage","shortDescription","description","country","city","address","latitude","longitude","mapUrl","image","thumbImage","gallery","accommodationType","starRating","roomType","capacity","remainingCapacity","rooms","checkInTime","checkOutTime","minimumNights","mealPlan","amenities","services","cancellationPolicy","houseRules","requirements","isSpecial","isPublished"]),
  visa: new Set(["name","price","currency","discountedPrice","discountPercentage","shortDescription","description","image","thumbImage","gallery","country","countryCode","destination","visaType","entryType","validityPeriod","stayDuration","processingTime","urgentProcessing","urgentProcessingTime","requirements","requiredDocuments","additionalDocuments","included","excluded","interviewRequired","biometricsRequired","cancellationPolicy","notes","isSpecial","isPublished"]),
};

const stringFields = new Set(["name","currency","shortDescription","description","destination","country","city","duration","origin","originCity","destinationCity","originStation","destinationStation","originCode","destinationCode","trainCompany","trainName","trainNumber","trainType","departureTime","arrivalTime","carriageType","seatType","baggage","refundPolicy","cancellationPolicy","originAirport","destinationAirport","originAirportCode","destinationAirportCode","airline","airlineCode","flightNumber","cabinClass","handBaggage","originTerminal","destinationTerminal","busCompany","busName","busNumber","busType","seatClass","address","mapUrl","accommodationType","roomType","checkInTime","checkOutTime","mealPlan","houseRules","countryCode","visaType","entryType","validityPeriod","stayDuration","processingTime","urgentProcessingTime","notes","accommodation","transportation","meals","guide","meetingPoint"]);
const decimalFields = new Set(["price","discountedPrice"]);
const integerFields = new Set(["discountPercentage","capacity","remainingCapacity","starRating","rooms","minimumNights","stops"]);
const floatFields = new Set(["latitude","longitude"]);
const booleanFields = new Set(["isSpecial","isPublished","refundable","urgentProcessing","interviewRequired","biometricsRequired"]);
const dateFields = new Set(["departureDate","returnDate","arrivalDate"]);
const arrayFields = new Set(["gallery","highlights","included","excluded","requirements","facilities","amenities","services","requiredDocuments","additionalDocuments"]);
const jsonFields = new Set(["itinerary"]);
const nullableBooleanFields = new Set(["refundable","urgentProcessing","interviewRequired","biometricsRequired"]);

function isProductType(value: unknown): value is ProductType {
  return value === "tour" || value === "train" || value === "flight" || value === "bus" || value === "accommodation" || value === "visa";
}
function isAllowedImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}
function parseString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const result = String(value).trim();
  return result || null;
}
function parseDecimal(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(/,/g, "").trim();
  const number = Number(normalized);
  if (!normalized || !Number.isFinite(number) || number < 0) throw new Error("مقدار عددی معتبر نیست.");
  return normalized;
}
function parseInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number)) throw new Error("مقدار باید عدد صحیح باشد.");
  return number;
}
function parseFloatValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error("مختصات معتبر نیست.");
  return number;
}
function parseDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("تاریخ معتبر نیست.");
  return date;
}
function parseBoolean(value: unknown): boolean | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true","1","yes","on"].includes(normalized)) return true;
    if (["false","0","no","off"].includes(normalized)) return false;
  }
  throw new Error("مقدار بله/خیر معتبر نیست.");
}
function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (value === null || value === undefined || value === "") return [];
  if (typeof value !== "string") throw new Error("ساختار فهرست معتبر نیست.");
  const text = value.trim();
  if (!text) return [];
  try {
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch { /* plain newline-separated text is also supported */ }
  return text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}
function parseJson(value: unknown): unknown {
  if (value === null || value === undefined || value === "") return [];
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); }
  catch { throw new Error("ساختار JSON معتبر نیست."); }
}

async function findProduct(type: ProductType, id: number) {
  switch (type) {
    case "tour": return prisma.tour.findUnique({ where: { id } });
    case "train": return prisma.trainTicket.findUnique({ where: { id } });
    case "flight": return prisma.flightTicket.findUnique({ where: { id } });
    case "bus": return prisma.busTicket.findUnique({ where: { id } });
    case "accommodation": return prisma.accommodation.findUnique({ where: { id } });
    case "visa": return prisma.touristVisa.findUnique({ where: { id } });
  }
}
async function updateProduct(type: ProductType, id: number, field: string, value: unknown) {
  const data = { [field]: value } as any;
  switch (type) {
    case "tour": return prisma.tour.update({ where: { id }, data });
    case "train": return prisma.trainTicket.update({ where: { id }, data });
    case "flight": return prisma.flightTicket.update({ where: { id }, data });
    case "bus": return prisma.busTicket.update({ where: { id }, data });
    case "accommodation": return prisma.accommodation.update({ where: { id }, data });
    case "visa": return prisma.touristVisa.update({ where: { id }, data });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ success: false, error: "دسترسی غیرمجاز است." }, { status: 401 });

    let body: Body;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json({ success: false, error: "ساختار درخواست معتبر نیست." }, { status: 400 });
      }
      body = parsed as Body;
    } catch {
      return NextResponse.json({ success: false, error: "JSON نامعتبر است." }, { status: 400 });
    }

    const typeValue = typeof body.type === "string" ? body.type.trim() : "";
    if (!isProductType(typeValue)) return NextResponse.json({ success: false, error: "نوع محصول نامعتبر است." }, { status: 400 });
    const type = typeValue;
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ success: false, error: "شناسه محصول نامعتبر است." }, { status: 400 });
    const field = typeof body.field === "string" ? body.field.trim() : "";
    if (!field || !fieldsByType[type].has(field)) return NextResponse.json({ success: false, error: "فیلد انتخاب‌شده برای این محصول مجاز نیست." }, { status: 400 });
    if (["id","slug","createdAt","updatedAt"].includes(field)) return NextResponse.json({ success: false, error: "ویرایش این فیلد مجاز نیست." }, { status: 400 });

    const product = await findProduct(type, id);
    if (!product) return NextResponse.json({ success: false, error: "محصول پیدا نشد." }, { status: 404 });

    let value: unknown;
    if (field === "image" || field === "thumbImage") {
      const imageUrl = typeof body.imageUrl === "string"
        ? body.imageUrl.trim()
        : typeof body.value === "string"
          ? body.value.trim()
          : "";
      if (!imageUrl) {
        value = null;
      } else {
        if (!isAllowedImageUrl(imageUrl)) return NextResponse.json({ success: false, error: "آدرس تصویر معتبر نیست." }, { status: 400 });
        value = imageUrl;
      }
    } else if (arrayFields.has(field)) {
      value = parseArray(body.value);
    } else if (jsonFields.has(field)) {
      value = parseJson(body.value);
    } else if (booleanFields.has(field)) {
      value = parseBoolean(body.value);
      if ((field === "isSpecial" || field === "isPublished") && value === null) value = false;
      if (!nullableBooleanFields.has(field) && value === null) value = false;
    } else if (decimalFields.has(field)) {
      value = parseDecimal(body.value);
    } else if (integerFields.has(field)) {
      const parsedInteger = parseInteger(body.value);
      value = parsedInteger;
      if (parsedInteger !== null) {
        if (field === "discountPercentage" && (parsedInteger < 0 || parsedInteger > 100)) throw new Error("درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.");
        if (["capacity","remainingCapacity","rooms","minimumNights","stops"].includes(field) && parsedInteger < 0) throw new Error("مقدار نمی‌تواند منفی باشد.");
        if (field === "starRating" && (parsedInteger < 0 || parsedInteger > 5)) throw new Error("تعداد ستاره باید بین ۰ تا ۵ باشد.");
      }
    } else if (floatFields.has(field)) {
      value = parseFloatValue(body.value);
    } else if (dateFields.has(field)) {
      value = parseDate(body.value);
    } else if (stringFields.has(field)) {
      value = parseString(body.value);
    } else {
      return NextResponse.json({ success: false, error: "نوع فیلد پشتیبانی نمی‌شود." }, { status: 400 });
    }

    const updated = await updateProduct(type, id, field, value);
    return NextResponse.json({ success: true, type, id, field, value, product: updated, message: "اطلاعات با موفقیت ذخیره شد." });
  } catch (error) {
    console.error("Product update error:", error);
    const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : "";
    if (code === "P2025") return NextResponse.json({ success: false, error: "محصول پیدا نشد." }, { status: 404 });
    if (code === "P2002") return NextResponse.json({ success: false, error: "مقدار واردشده تکراری است." }, { status: 409 });
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "خطا در ذخیره اطلاعات." }, { status: 400 });
  }
}
