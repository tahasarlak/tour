import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

// ======================================================
// TYPES
// ======================================================

type ProductType =
  | "tour"
  | "train"
  | "flight"
  | "bus"
  | "accommodation"
  | "visa";

type Body = Record<string, unknown>;

// ======================================================
// HELPERS
// ======================================================

function isProductType(
  value: unknown
): value is ProductType {
  return (
    value === "tour" ||
    value === "train" ||
    value === "flight" ||
    value === "bus" ||
    value === "accommodation" ||
    value === "visa"
  );
}

// ======================================================
// STRING
// ======================================================

function parseString(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const result = String(value).trim();

  return result === "" ? null : result;
}

// ======================================================
// BOOLEAN
// ======================================================

function parseBoolean(
  value: unknown
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized =
      value.trim().toLowerCase();

    return (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "on"
    );
  }

  return Boolean(value);
}

// ======================================================
// INTEGER
// ======================================================

function parseInteger(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  if (!Number.isInteger(number)) {
    return null;
  }

  return number;
}

// ======================================================
// DECIMAL / PRICE
// ======================================================

function parseDecimal(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalized = String(value)
    .replace(/,/g, "")
    .trim();

  const number = Number(normalized);

  if (!Number.isFinite(number)) {
    return null;
  }

  if (number < 0) {
    return null;
  }

  return normalized;
}

// ======================================================
// DATE
// ======================================================

function parseDate(
  value: unknown
): Date | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

// ======================================================
// ARRAY
// ======================================================

function parseArray(
  value: unknown
): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item).trim()
      )
      .filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const text = value.trim();

  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) =>
          String(item).trim()
        )
        .filter(Boolean);
    }
  } catch {
    // continue
  }

  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// ======================================================
// JSON
// ======================================================

function parseJson(
  value: unknown
): unknown {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// ======================================================
// COMMON STRING FIELDS
// ======================================================

const commonStringFields = new Set([
  "name",
  "currency",
  "shortDescription",
  "description",
  "image",
  "thumbImage",
  "destination",
  "country",
  "city",
  "duration",
  "origin",
  "originCity",
  "destinationCity",
  "originStation",
  "destinationStation",
  "originCode",
  "destinationCode",
  "trainCompany",
  "trainName",
  "trainNumber",
  "trainType",
  "departureTime",
  "arrivalTime",
  "carriageType",
  "seatType",
  "baggage",
  "refundPolicy",
  "cancellationPolicy",
  "originAirport",
  "destinationAirport",
  "originAirportCode",
  "destinationAirportCode",
  "airline",
  "airlineCode",
  "flightNumber",
  "cabinClass",
  "handBaggage",
  "originTerminal",
  "destinationTerminal",
  "busCompany",
  "busName",
  "busNumber",
  "busType",
  "seatClass",
  "address",
  "mapUrl",
  "accommodationType",
  "roomType",
  "checkInTime",
  "checkOutTime",
  "mealPlan",
  "houseRules",
  "countryCode",
  "visaType",
  "entryType",
  "validityPeriod",
  "stayDuration",
  "processingTime",
  "urgentProcessingTime",
  "notes",
]);

// ======================================================
// COMMON PRICE FIELDS
// ======================================================

const priceFields = new Set([
  "price",
  "discountedPrice",
]);

// ======================================================
// COMMON INTEGER FIELDS
// ======================================================

const integerFields = new Set([
  "discountPercentage",
  "capacity",
  "remainingCapacity",
  "starRating",
  "rooms",
  "minimumNights",
  "stops",
]);

// ======================================================
// COMMON BOOLEAN FIELDS
// ======================================================

const booleanFields = new Set([
  "isSpecial",
  "isPublished",
  "refundable",
  "urgentProcessing",
  "interviewRequired",
  "biometricsRequired",
]);

// ======================================================
// COMMON DATE FIELDS
// ======================================================

const dateFields = new Set([
  "departureDate",
  "returnDate",
  "arrivalDate",
]);

// ======================================================
// COMMON ARRAY FIELDS
// ======================================================

const arrayFields = new Set([
  "gallery",
  "highlights",
  "included",
  "excluded",
  "requirements",
  "facilities",
  "amenities",
  "services",
  "requiredDocuments",
  "additionalDocuments",
]);

// ======================================================
// JSON FIELDS
// ======================================================

const jsonFields = new Set([
  "itinerary",
]);

// ======================================================
// VALID FIELD BY TYPE
// ======================================================

const fieldsByType: Record<
  ProductType,
  Set<string>
> = {
  tour: new Set([
    "name",
    "price",
    "currency",
    "discountedPrice",
    "discountPercentage",
    "shortDescription",
    "description",
    "image",
    "thumbImage",
    "destination",
    "country",
    "city",
    "duration",
    "departureDate",
    "returnDate",
    "capacity",
    "remainingCapacity",
    "accommodation",
    "transportation",
    "meals",
    "guide",
    "meetingPoint",
    "mapUrl",
    "highlights",
    "included",
    "excluded",
    "requirements",
    "itinerary",
    "gallery",
    "isSpecial",
    "isPublished",
  ]),

  train: new Set([
    "name",
    "price",
    "currency",
    "discountedPrice",
    "discountPercentage",
    "shortDescription",
    "description",
    "image",
    "thumbImage",
    "gallery",
    "origin",
    "destination",
    "originCity",
    "destinationCity",
    "originStation",
    "destinationStation",
    "originCode",
    "destinationCode",
    "trainCompany",
    "trainName",
    "trainNumber",
    "trainType",
    "departureDate",
    "arrivalDate",
    "departureTime",
    "arrivalTime",
    "duration",
    "carriageType",
    "seatType",
    "capacity",
    "remainingCapacity",
    "baggage",
    "refundPolicy",
    "cancellationPolicy",
    "facilities",
    "requirements",
    "isSpecial",
    "isPublished",
  ]),

  flight: new Set([
    "name",
    "price",
    "currency",
    "discountedPrice",
    "discountPercentage",
    "shortDescription",
    "description",
    "image",
    "thumbImage",
    "gallery",
    "origin",
    "destination",
    "originCity",
    "destinationCity",
    "originAirport",
    "destinationAirport",
    "originAirportCode",
    "destinationAirportCode",
    "airline",
    "airlineCode",
    "flightNumber",
    "departureDate",
    "arrivalDate",
    "departureTime",
    "arrivalTime",
    "duration",
    "cabinClass",
    "baggage",
    "handBaggage",
    "stops",
    "refundable",
    "refundPolicy",
    "cancellationPolicy",
    "facilities",
    "requirements",
    "capacity",
    "remainingCapacity",
    "isSpecial",
    "isPublished",
  ]),

  // ====================================================
  // BUS
  // ====================================================

  bus: new Set([
    "name",
    "price",
    "currency",
    "discountedPrice",
    "discountPercentage",
    "shortDescription",
    "description",
    "image",
    "thumbImage",
    "gallery",
    "origin",
    "destination",
    "originCity",
    "destinationCity",
    "originTerminal",
    "destinationTerminal",
    "originCode",
    "destinationCode",
    "busCompany",
    "busName",
    "busNumber",
    "busType",
    "departureDate",
    "arrivalDate",
    "departureTime",
    "arrivalTime",
    "duration",
    "seatType",
    "seatClass",
    "capacity",
    "remainingCapacity",
    "baggage",
    "refundPolicy",
    "cancellationPolicy",
    "facilities",
    "requirements",
    "isSpecial",
    "isPublished",
  ]),

  accommodation: new Set([
    "name",
    "price",
    "currency",
    "discountedPrice",
    "discountPercentage",
    "shortDescription",
    "description",
    "country",
    "city",
    "address",
    "latitude",
    "longitude",
    "mapUrl",
    "image",
    "thumbImage",
    "gallery",
    "accommodationType",
    "starRating",
    "roomType",
    "capacity",
    "remainingCapacity",
    "rooms",
    "checkInTime",
    "checkOutTime",
    "minimumNights",
    "mealPlan",
    "amenities",
    "services",
    "cancellationPolicy",
    "houseRules",
    "requirements",
    "isSpecial",
    "isPublished",
  ]),

  visa: new Set([
    "name",
    "price",
    "currency",
    "discountedPrice",
    "discountPercentage",
    "shortDescription",
    "description",
    "image",
    "thumbImage",
    "gallery",
    "country",
    "countryCode",
    "destination",
    "visaType",
    "entryType",
    "validityPeriod",
    "stayDuration",
    "processingTime",
    "urgentProcessing",
    "urgentProcessingTime",
    "requirements",
    "requiredDocuments",
    "additionalDocuments",
    "included",
    "excluded",
    "interviewRequired",
    "biometricsRequired",
    "cancellationPolicy",
    "notes",
    "isSpecial",
    "isPublished",
  ]),
};

// ======================================================
// FIND PRODUCT
// ======================================================

async function findProduct(
  type: ProductType,
  id: number
) {
  switch (type) {
    case "tour":
      return prisma.tour.findUnique({
        where: { id },
      });

    case "train":
      return prisma.trainTicket.findUnique({
        where: { id },
      });

    case "flight":
      return prisma.flightTicket.findUnique({
        where: { id },
      });

    case "bus":
      return prisma.busTicket.findUnique({
        where: { id },
      });

    case "accommodation":
      return prisma.accommodation.findUnique({
        where: { id },
      });

    case "visa":
      return prisma.touristVisa.findUnique({
        where: { id },
      });
  }
}

// ======================================================
// UPDATE PRODUCT
// ======================================================

async function updateProduct(
  type: ProductType,
  id: number,
  field: string,
  value: unknown
) {
  switch (type) {
    case "tour":
      return prisma.tour.update({
        where: { id },
        data: {
          [field]: value,
        },
      });

    case "train":
      return prisma.trainTicket.update({
        where: { id },
        data: {
          [field]: value,
        },
      });

    case "flight":
      return prisma.flightTicket.update({
        where: { id },
        data: {
          [field]: value,
        },
      });

    case "bus":
      return prisma.busTicket.update({
        where: { id },
        data: {
          [field]: value,
        },
      });

    case "accommodation":
      return prisma.accommodation.update({
        where: { id },
        data: {
          [field]: value,
        },
      });

    case "visa":
      return prisma.touristVisa.update({
        where: { id },
        data: {
          [field]: value,
        },
      });
  }
}

// ======================================================
// DELETE BLOB
// ======================================================

async function deleteBlob(
  url: string | null | undefined
) {
  if (!url) return;

  try {
    await fetch(url, {
      method: "DELETE",
    });
  } catch (error) {
    console.warn(
      "Could not delete blob:",
      url,
      error
    );
  }
}

// ======================================================
// POST
// ======================================================

export async function POST(
  req: Request
) {
  try {
    // ====================================================
    // AUTH
    // ====================================================

    const session =
      await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی غیرمجاز است.",
        },
        {
          status: 401,
        }
      );
    }

    // ====================================================
    // CONTENT TYPE
    // ====================================================

    const contentType =
      req.headers.get(
        "content-type"
      ) || "";

    let body: Body = {};

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      const text =
        await req.text();

      if (!text.trim()) {
        return NextResponse.json(
          {
            success: false,
            error:
              "اطلاعاتی ارسال نشده است.",
          },
          {
            status: 400,
          }
        );
      }

      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "JSON نامعتبر است.",
          },
          {
            status: 400,
          }
        );
      }
    } else if (
      contentType.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await req.formData();

      formData.forEach(
        (value, key) => {
          body[key] = value;
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "نوع درخواست نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // ====================================================
    // TYPE
    // ====================================================

    const type =
      String(
        body.type || ""
      ).trim();

    if (!isProductType(type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "نوع محصول نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // ====================================================
    // ID
    // ====================================================

    const id = Number(body.id);

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "شناسه محصول نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // ====================================================
    // FIELD
    // ====================================================

    const field =
      String(
        body.field || ""
      ).trim();

    if (!field) {
      return NextResponse.json(
        {
          success: false,
          error:
            "فیلد برای ویرایش مشخص نشده است.",
        },
        {
          status: 400,
        }
      );
    }

    // ====================================================
    // FIELD SECURITY
    // ====================================================

    if (
      !fieldsByType[type].has(
        field
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `فیلد "${field}" برای محصول "${type}" مجاز نیست.`,
        },
        {
          status: 400,
        }
      );
    }

    // ====================================================
    // PROTECTED FIELDS
    // ====================================================

    const protectedFields =
      new Set([
        "id",
        "slug",
        "createdAt",
        "updatedAt",
      ]);

    if (
      protectedFields.has(field)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `ویرایش فیلد "${field}" از این API مجاز نیست.`,
        },
        {
          status: 400,
        }
      );
    }

    // ====================================================
    // FIND PRODUCT
    // ====================================================

    const product =
      await findProduct(
        type,
        id
      );

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error:
            "محصول پیدا نشد.",
        },
        {
          status: 404,
        }
      );
    }

    // ====================================================
    // IMAGE
    // ====================================================

    if (
      field === "image" ||
      field === "thumbImage"
    ) {
      const directUrl =
        typeof body.imageUrl === "string"
          ? body.imageUrl.trim()
          : "";

      if (directUrl) {
        let parsedUrl: URL;

        try {
          parsedUrl = new URL(directUrl);
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: "آدرس عکس نامعتبر است.",
            },
            { status: 400 }
          );
        }

        const validHost =
          parsedUrl.hostname ===
            "public.blob.vercel-storage.com" ||
          parsedUrl.hostname.endsWith(
            ".public.blob.vercel-storage.com"
          );

        if (
          parsedUrl.protocol !== "https:" ||
          !validHost
        ) {
          return NextResponse.json(
            {
              success: false,
              error: "آدرس عکس مجاز نیست.",
            },
            { status: 400 }
          );
        }

        const updated = await updateProduct(
          type,
          id,
          field,
          directUrl
        );

        return NextResponse.json({
          success: true,
          type,
          field,
          product: updated,
        });
      }

      const image =
        body.image;

      if (
        !(image instanceof File) ||
        image.size <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "فایل تصویر معتبر نیست.",
          },
          {
            status: 400,
          }
        );
      }

      // ----------------------------------------------
      // UPLOAD
      // ----------------------------------------------

      const folder =
        field ===
        "thumbImage"
          ? `${type}/thumbs`
          : `${type}`;

      const blob =
        await put(
          `${folder}/${image.name}`,
          image,
          {
            access: "public",
            addRandomSuffix: true,
          }
        );

      // ----------------------------------------------
      // OLD URL
      // ----------------------------------------------

      const oldUrl =
        String(
          body.oldUrl ||
            ""
        ).trim();

      // ----------------------------------------------
      // UPDATE
      // ----------------------------------------------

      
const updated = await updateProduct(
  type,
  id,
  field,
  directUrl
);

const savedImage =
  (updated as Record<string, unknown>)[field];

console.log("[IMAGE UPDATE DEBUG]", {
  type,
  id,
  field,
  receivedUrl: !!directUrl,
  savedUrl: savedImage,
  matches: savedImage === directUrl,
});

if (savedImage !== directUrl) {
  throw new Error(
    "Image URL was not saved correctly"
  );
}

return NextResponse.json({
  success: true,
  type,
  id,
  field,
  savedUrl: savedImage,
  product: updated,
});


      // ----------------------------------------------
      // DELETE OLD
      // ----------------------------------------------

      if (
        oldUrl &&
        oldUrl !== blob.url
      ) {
        await deleteBlob(
          oldUrl
        );
      }

      return NextResponse.json({
        success: true,
        type,
        field,
        product: updated,
        message:
          "تصویر با موفقیت تغییر کرد.",
      });
    }

    // ====================================================
    // ARRAY
    // ====================================================

    if (
      arrayFields.has(field)
    ) {
      const value =
        parseArray(
          body.value ??
            body[field]
        );

      const updated =
        await updateProduct(
          type,
          id,
          field,
          value
        );

      return NextResponse.json({
        success: true,
        type,
        field,
        value,
        product: updated,
        message:
          "لیست با موفقیت بروزرسانی شد.",
      });
    }

    // ====================================================
    // JSON
    // ====================================================

    if (
      jsonFields.has(field)
    ) {
      const value =
        parseJson(
          body.value ??
            body[field]
        );

      const updated =
        await updateProduct(
          type,
          id,
          field,
          value
        );

      return NextResponse.json({
        success: true,
        type,
        field,
        value,
        product: updated,
        message:
          "اطلاعات با موفقیت بروزرسانی شد.",
      });
    }

    // ====================================================
    // BOOLEAN
    // ====================================================

    if (
      booleanFields.has(field)
    ) {
      const value =
        parseBoolean(
          body.value ??
            body[field]
        );

      const updated =
        await updateProduct(
          type,
          id,
          field,
          value
        );

      return NextResponse.json({
        success: true,
        type,
        field,
        value,
        product: updated,
        message:
          "مقدار با موفقیت بروزرسانی شد.",
      });
    }

    // ====================================================
    // INTEGER
    // ====================================================

    if (
      integerFields.has(field)
    ) {
      const value =
        parseInteger(
          body.value ??
            body[field]
        );

      if (
        value === null
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "مقدار عددی نامعتبر است.",
          },
          {
            status: 400,
          }
        );
      }

      // ----------------------------------------------
      // DISCOUNT PERCENTAGE
      // ----------------------------------------------

      if (
        field ===
        "discountPercentage"
      ) {
        if (
          value < 0 ||
          value > 100
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "درصد تخفیف باید بین ۰ تا ۱۰۰ باشد.",
            },
            {
              status: 400,
            }
          );
        }
      }

      // ----------------------------------------------
      // CAPACITY
      // ----------------------------------------------

      if (
        field ===
          "capacity" ||
        field ===
          "remainingCapacity"
      ) {
        if (value < 0) {
          return NextResponse.json(
            {
              success: false,
              error:
                "ظرفیت نمی‌تواند منفی باشد.",
            },
            {
              status: 400,
            }
          );
        }
      }

      // ----------------------------------------------
      // STAR
      // ----------------------------------------------

      if (
        field ===
        "starRating"
      ) {
        if (
          value < 0 ||
          value > 5
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "امتیاز هتل باید بین ۰ تا ۵ باشد.",
            },
            {
              status: 400,
            }
          );
        }
      }

      const updated =
        await updateProduct(
          type,
          id,
          field,
          value
        );

      return NextResponse.json({
        success: true,
        type,
        field,
        value,
        product: updated,
        message:
          "مقدار عددی با موفقیت بروزرسانی شد.",
      });
    }

    // ====================================================
    // PRICE / DECIMAL
    // ====================================================

    if (
      priceFields.has(field)
    ) {
      const value =
        parseDecimal(
          body.value ??
            body[field]
        );

      if (
        value === null
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "قیمت نامعتبر است.",
          },
          {
            status: 400,
          }
        );
      }

      const numericValue =
        Number(value);

      // ----------------------------------------------
      // GET CURRENT PRICE DATA
      // ----------------------------------------------

      const currentPrice =
        Number(
          product.price
        );

      // ----------------------------------------------
      // DISCOUNTED PRICE
      // ----------------------------------------------

      if (
        field ===
        "discountedPrice"
      ) {
        if (
          numericValue >=
          currentPrice
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "قیمت تخفیف‌خورده باید کمتر از قیمت اصلی باشد.",
            },
            {
              status: 400,
            }
          );
        }
      }

      
console.log("[IMAGE UPDATE] REQUEST", {
  type,
  id,
  field,
  hasImageUrl: Boolean(directUrl),
  imageUrlHost: parsedUrl.hostname,
});

const updated = await updateProduct(
  type,
  id,
  field,
  directUrl
);

const verified = await findProduct(type, id);

const savedValue =
  verified && field in verified
    ? (verified as Record<string, unknown>)[field]
    : null;

console.log("[IMAGE UPDATE] RESULT", {
  type,
  id,
  field,
  savedValue,
  matches: savedValue === directUrl,
  updatedAt: verified?.updatedAt,
});

if (savedValue !== directUrl) {
  console.error("[IMAGE UPDATE] DATABASE MISMATCH");

  return NextResponse.json(
    {
      success: false,
      error: "آدرس عکس در دیتابیس ذخیره نشد.",
    },
    { status: 500 }
  );
}

return NextResponse.json({
  success: true,
  type,
  id,
  field,
  savedUrl: savedValue,
  updatedAt: verified?.updatedAt,
});

    }

    // ====================================================
    // DATE
    // ====================================================

    if (
      dateFields.has(field)
    ) {
      const value =
        parseDate(
          body.value ??
            body[field]
        );

      if (
        value === null
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "تاریخ نامعتبر است.",
          },
          {
            status: 400,
          }
        );
      }

      
    }

    // ====================================================
    // STRING
    // ====================================================

    if (
      commonStringFields.has(
        field
      )
    ) {
      const value =
        parseString(
          body.value ??
            body[field]
        );

      // ----------------------------------------------
      // REQUIRED FIELDS
      // ----------------------------------------------

      const requiredFields =
        new Set([
          "name",
          "destination",
          "origin",
          "city",
          "country",
        ]);

      if (
        requiredFields.has(
          field
        ) &&
        !value
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `فیلد "${field}" نمی‌تواند خالی باشد.`,
          },
          {
            status: 400,
          }
        );
      }

      const updated =
        await updateProduct(
          type,
          id,
          field,
          value
        );

      return NextResponse.json({
        success: true,
        type,
        field,
        value,
        product: updated,
        message:
          "اطلاعات با موفقیت بروزرسانی شد.",
      });
    }

    // ====================================================
    // UNKNOWN FIELD
    // ====================================================

    return NextResponse.json(
      {
        success: false,
        error:
          `نوع فیلد "${field}" پشتیبانی نمی‌شود.`,
      },
      {
        status: 400,
      }
    );
  } catch (error: any) {
    console.error(
      "Product update error:",
      error
    );

    // ====================================================
    // PRISMA NOT FOUND
    // ====================================================

    if (
      error?.code ===
      "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "محصول پیدا نشد.",
        },
        {
          status: 404,
        }
      );
    }

    // ====================================================
    // UNIQUE
    // ====================================================

    if (
      error?.code ===
      "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "مقدار وارد شده تکراری است.",
        },
        {
          status: 409,
        }
      );
    }

    // ====================================================
    // GENERAL
    // ====================================================

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "خطا در بروزرسانی محصول.",
      },
      {
        status: 500,
      }
    );
  }
}
