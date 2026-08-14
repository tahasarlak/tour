import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

type Body = Record<string, unknown>;

// =========================================================
// SLUG
// =========================================================

function createSlug(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `tour-${Date.now()}`;
}

// =========================================================
// UNIQUE SLUG
// =========================================================

async function getUniqueSlug(
  baseSlug: string
): Promise<string> {
  let slug = baseSlug || `tour-${Date.now()}`;
  let counter = 1;

  while (true) {
    const existing = await prisma.tour.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return slug;
    }

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

// =========================================================
// ARRAY
// =========================================================

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

// =========================================================
// BOOLEAN
// =========================================================

function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return (
      value.toLowerCase() === "true" ||
      value === "1"
    );
  }

  return Boolean(value);
}

// =========================================================
// DATE
// =========================================================

function parseDate(
  value: unknown
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

// =========================================================
// INTEGER
// =========================================================

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

  if (!Number.isInteger(number)) {
    return null;
  }

  return number;
}

// =========================================================
// JSON
// =========================================================

function parseJson(
  value: unknown,
  fallback: unknown
): unknown {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// =========================================================
// POST
// =========================================================

export async function POST(req: Request) {
  try {
    // =====================================================
    // ADMIN AUTH
    // =====================================================

    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی غیرمجاز.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // BODY
    // =====================================================

    let body: Body = {};

    const contentType =
      req.headers.get("content-type") || "";

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      const text = await req.text();

      if (!text.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: "اطلاعاتی ارسال نشده است.",
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
      const formData = await req.formData();

      formData.forEach((value, key) => {
        body[key] = value;
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "نوع درخواست نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // NAME
    // =====================================================

    const name = String(
      body.name || ""
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "نام تور الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // DESTINATION
    // =====================================================

    const destination = String(
      body.destination || ""
    ).trim();

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          error: "مقصد تور الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // PRICE
    // =====================================================

    const price = String(
      body.price ?? "0"
    ).trim();

    if (!price) {
      return NextResponse.json(
        {
          success: false,
          error: "قیمت تور الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // CURRENCY
    // =====================================================

    const currency =
      body.currency !== undefined &&
      String(body.currency).trim()
        ? String(body.currency).trim()
        : "₽";

    // =====================================================
    // SLUG
    // =====================================================

    const requestedSlug = String(
      body.slug || ""
    ).trim();

    const baseSlug = requestedSlug
      ? createSlug(requestedSlug)
      : createSlug(name);

    const slug =
      await getUniqueSlug(baseSlug);

    // =====================================================
    // DISCOUNT
    // =====================================================

    let discountPercentage = Number(
      body.discountPercentage || 0
    );

    if (
      !Number.isFinite(
        discountPercentage
      )
    ) {
      discountPercentage = 0;
    }

    discountPercentage = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          discountPercentage
        )
      )
    );

    // =====================================================
    // DISCOUNTED PRICE
    // =====================================================

    let discountedPrice:
      | string
      | null = null;

    const discountedInput = String(
      body.discountedPrice || ""
    ).trim();

    const numericPrice = Number(price);

    if (discountedInput) {
      const numericDiscounted =
        Number(discountedInput);

      if (
        Number.isFinite(
          numericDiscounted
        ) &&
        numericDiscounted >= 0 &&
        numericDiscounted < numericPrice
      ) {
        discountedPrice =
          String(numericDiscounted);

        if (
          discountPercentage === 0 &&
          numericPrice > 0
        ) {
          discountPercentage =
            Math.round(
              (
                (numericPrice -
                  numericDiscounted) /
                numericPrice
              ) * 100
            );
        }
      }
    }

    if (
      discountPercentage > 0 &&
      !discountedPrice &&
      numericPrice > 0
    ) {
      discountedPrice = String(
        Math.round(
          numericPrice -
            (numericPrice *
              discountPercentage) /
              100
        )
      );
    }

    // =====================================================
    // IMAGE
    // =====================================================

    let imageUrl:
      | string
      | null = null;

    const image = body.image;

    if (
      image instanceof File &&
      image.size > 0
    ) {
      const blob = await put(
        `tours/${image.name}`,
        image,
        {
          access: "public",
          addRandomSuffix: true,
        }
      );

      imageUrl = blob.url;
    }

    // =====================================================
    // THUMB IMAGE
    // =====================================================

    let thumbImageUrl:
      | string
      | null = null;

    const thumbImage =
      body.thumbImage;

    if (
      thumbImage instanceof File &&
      thumbImage.size > 0
    ) {
      const blob = await put(
        `tours/thumbs/${thumbImage.name}`,
        thumbImage,
        {
          access: "public",
          addRandomSuffix: true,
        }
      );

      thumbImageUrl = blob.url;
    }

    // =====================================================
    // DATES
    // =====================================================

    const departureDate =
      parseDate(
        body.departureDate
      );

    const returnDate =
      parseDate(
        body.returnDate
      );

    // =====================================================
    // CAPACITY
    // =====================================================

    const capacity =
      parseInteger(body.capacity);

    const remainingCapacity =
      body.remainingCapacity !==
      undefined
        ? parseInteger(
            body.remainingCapacity
          )
        : capacity;

    // =====================================================
    // TOUR
    // =====================================================

    const tour =
      await prisma.tour.create({
        data: {
          name,
          slug,

          price,
          currency,

          discountedPrice,
          discountPercentage,

          shortDescription:
            String(
              body.shortDescription || ""
            ).trim() || null,

          description:
            String(
              body.description || ""
            ).trim() || null,

          image: imageUrl,
          thumbImage:
            thumbImageUrl,

          destination,

          country:
            String(
              body.country || ""
            ).trim() || null,

          city:
            String(
              body.city || ""
            ).trim() || null,

          duration:
            String(
              body.duration || ""
            ).trim() || null,

          departureDate,
          returnDate,

          capacity,
          remainingCapacity,

          accommodation:
            String(
              body.accommodation || ""
            ).trim() || null,

          transportation:
            String(
              body.transportation || ""
            ).trim() || null,

          meals:
            String(
              body.meals || ""
            ).trim() || null,

          guide:
            String(
              body.guide || ""
            ).trim() || null,

          meetingPoint:
            String(
              body.meetingPoint || ""
            ).trim() || null,

          mapUrl:
            String(
              body.mapUrl || ""
            ).trim() || null,

          highlights:
            parseArray(
              body.highlights
            ),

          included:
            parseArray(
              body.included
            ),

          excluded:
            parseArray(
              body.excluded
            ),

          requirements:
            parseArray(
              body.requirements
            ),

          itinerary:
            parseJson(
              body.itinerary,
              []
            ) as any,

          gallery:
            parseArray(
              body.gallery
            ),

          isSpecial:
            parseBoolean(
              body.isSpecial
            ),

          // تور جدید همیشه مخفی
          isPublished: false,
        },
      });

    return NextResponse.json(
      {
        success: true,
        type: "tour",
        message:
          "تور با موفقیت ساخته شد.",
        tour,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "Tour create error:",
      error
    );

    if (
      error?.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "این slug قبلاً استفاده شده است.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "خطا در ساخت تور.",
      },
      {
        status: 500,
      }
    );
  }
}