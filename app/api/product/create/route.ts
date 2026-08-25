import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
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

  return slug || `bus-${Date.now()}`;
}

// =========================================================
// UNIQUE SLUG
// =========================================================

async function getUniqueSlug(
  baseSlug: string
): Promise<string> {
  let slug = baseSlug || `bus-${Date.now()}`;
  let counter = 1;

  while (true) {
    const existing =
      await prisma.busTicket.findUnique({
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

  if (typeof value === "string") {
    try {
      const parsed =
        JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) =>
            String(item).trim()
          )
          .filter(Boolean);
      }
    } catch {
      return value
        .split("\n")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);
    }
  }

  return [];
}

// =========================================================
// BOOLEAN
// =========================================================

function parseBoolean(
  value: unknown
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return (
      value.toLowerCase() ===
        "true" ||
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

  const date = new Date(
    String(value)
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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
// POST
// =========================================================

export async function POST(
  req: Request
) {
  try {
    // =====================================================
    // ADMIN AUTH
    // =====================================================

    const session =
      await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error:
            "دسترسی غیرمجاز.",
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
      req.headers.get(
        "content-type"
      ) || "";

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
        body =
          JSON.parse(text);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error:
              "JSON نامعتبر است.",
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
          error:
            "نام بلیت اتوبوس الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // ORIGIN
    // =====================================================

    const origin = String(
      body.origin || ""
    ).trim();

    if (!origin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "مبدا الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // DESTINATION
    // =====================================================

    const destination =
      String(
        body.destination || ""
      ).trim();

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          error:
            "مقصد الزامی است.",
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
          error:
            "قیمت بلیت الزامی است.",
        },
        {
          status: 400,
        }
      );
    }

    const numericPrice =
      Number(price);

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice < 0
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

    // =====================================================
    // CURRENCY
    // =====================================================

    const currency =
      body.currency !==
        undefined &&
      String(
        body.currency
      ).trim()
        ? String(
            body.currency
          ).trim()
        : "تومان";

    // =====================================================
    // SLUG
    // =====================================================

    const requestedSlug =
      String(
        body.slug || ""
      ).trim();

    const baseSlug =
      requestedSlug
        ? createSlug(
            requestedSlug
          )
        : createSlug(name);

    const slug =
      await getUniqueSlug(
        baseSlug
      );

    // =====================================================
    // DISCOUNT
    // =====================================================

    let discountPercentage =
      Number(
        body.discountPercentage ||
          0
      );

    if (
      !Number.isFinite(
        discountPercentage
      )
    ) {
      discountPercentage = 0;
    }

    discountPercentage =
      Math.max(
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

    const discountedInput =
      String(
        body.discountedPrice ||
          ""
      ).trim();

    if (discountedInput) {
      const numericDiscounted =
        Number(
          discountedInput
        );

      if (
        Number.isFinite(
          numericDiscounted
        ) &&
        numericDiscounted >= 0 &&
        numericDiscounted <
          numericPrice
      ) {
        discountedPrice =
          String(
            numericDiscounted
          );

        if (
          discountPercentage ===
            0 &&
          numericPrice > 0
        ) {
          discountPercentage =
            Math.round(
              (
                (numericPrice -
                  numericDiscounted) /
                numericPrice
              ) *
                100
            );
        }
      }
    }

    if (
      discountPercentage > 0 &&
      !discountedPrice &&
      numericPrice > 0
    ) {
      discountedPrice =
        String(
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

    const image =
      body.image;

    if (
      image instanceof File &&
      image.size > 0
    ) {
      const blob =
        await put(
          `bus-tickets/${image.name}`,
          image,
          {
            access: "public",
            addRandomSuffix:
              true,
          }
        );

      imageUrl =
        blob.url;
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
      const blob =
        await put(
          `bus-tickets/thumbs/${thumbImage.name}`,
          thumbImage,
          {
            access: "public",
            addRandomSuffix:
              true,
          }
        );

      thumbImageUrl =
        blob.url;
    }

    // =====================================================
    // DEPARTURE DATE
    // =====================================================

    const departureDate =
      parseDate(
        body.departureDate
      );

    if (!departureDate) {
      return NextResponse.json(
        {
          success: false,
          error:
            "تاریخ حرکت الزامی و نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // ARRIVAL DATE
    // =====================================================

    const arrivalDate =
      parseDate(
        body.arrivalDate
      );

    // =====================================================
    // CAPACITY
    // =====================================================

    const capacity =
      parseInteger(
        body.capacity
      );

    const remainingCapacity =
      body.remainingCapacity !==
      undefined
        ? parseInteger(
            body.remainingCapacity
          )
        : capacity;

    // =====================================================
    // BUS TICKET
    // =====================================================

    const busTicket =
      await prisma.busTicket.create(
        {
          data: {
            // -------------------------------------------------
            // BASIC
            // -------------------------------------------------

            name,
            slug,

            price,
            currency,

            discountedPrice,
            discountPercentage,

            shortDescription:
              String(
                body.shortDescription ||
                  ""
              ).trim() || null,

            description:
              String(
                body.description ||
                  ""
              ).trim() || null,

            image: imageUrl,

            thumbImage:
              thumbImageUrl,

            gallery:
              parseArray(
                body.gallery
              ),

            // -------------------------------------------------
            // ROUTE
            // -------------------------------------------------

            origin,

            destination,

            originCity:
              String(
                body.originCity ||
                  ""
              ).trim() || null,

            destinationCity:
              String(
                body.destinationCity ||
                  ""
              ).trim() || null,

            originTerminal:
              String(
                body.originTerminal ||
                  ""
              ).trim() || null,

            destinationTerminal:
              String(
                body.destinationTerminal ||
                  ""
              ).trim() || null,

            originCode:
              String(
                body.originCode ||
                  ""
              ).trim() || null,

            destinationCode:
              String(
                body.destinationCode ||
                  ""
              ).trim() || null,

            // -------------------------------------------------
            // BUS
            // -------------------------------------------------

            busCompany:
              String(
                body.busCompany ||
                  ""
              ).trim() || null,

            busName:
              String(
                body.busName ||
                  ""
              ).trim() || null,

            busNumber:
              String(
                body.busNumber ||
                  ""
              ).trim() || null,

            busType:
              String(
                body.busType ||
                  ""
              ).trim() || null,

            // -------------------------------------------------
            // DATE / TIME
            // -------------------------------------------------

            departureDate,

            arrivalDate,

            departureTime:
              String(
                body.departureTime ||
                  ""
              ).trim() || null,

            arrivalTime:
              String(
                body.arrivalTime ||
                  ""
              ).trim() || null,

            duration:
              String(
                body.duration ||
                  ""
              ).trim() || null,

            // -------------------------------------------------
            // SEAT
            // -------------------------------------------------

            seatType:
              String(
                body.seatType ||
                  ""
              ).trim() || null,

            seatClass:
              String(
                body.seatClass ||
                  ""
              ).trim() || null,

            // -------------------------------------------------
            // CAPACITY
            // -------------------------------------------------

            capacity,

            remainingCapacity,

            // -------------------------------------------------
            // BAGGAGE
            // -------------------------------------------------

            baggage:
              String(
                body.baggage ||
                  ""
              ).trim() || null,

            // -------------------------------------------------
            // POLICIES
            // -------------------------------------------------

            refundPolicy:
              String(
                body.refundPolicy ||
                  ""
              ).trim() || null,

            cancellationPolicy:
              String(
                body.cancellationPolicy ||
                  ""
              ).trim() || null,

            // -------------------------------------------------
            // FACILITIES
            // -------------------------------------------------

            facilities:
              parseArray(
                body.facilities
              ),

            requirements:
              parseArray(
                body.requirements
              ),

            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            isSpecial:
              parseBoolean(
                body.isSpecial
              ),

            // بلیت جدید همیشه مخفی
            isPublished: false,
          },
        }
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        type: "bus",
        message:
          "بلیت اتوبوس با موفقیت ساخته شد.",
        busTicket,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "Bus ticket create error:",
      error
    );

    // =====================================================
    // DUPLICATE SLUG
    // =====================================================

    if (
      error?.code ===
      "P2002"
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

    // =====================================================
    // GENERAL ERROR
    // =====================================================

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "خطا در ساخت بلیت اتوبوس.",
      },
      {
        status: 500,
      }
    );
  }
}