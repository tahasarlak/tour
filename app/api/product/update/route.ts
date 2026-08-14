import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

type Value =
  | string
  | number
  | boolean
  | File
  | string[]
  | null
  | unknown[];

type Body = {
  id: string;
  field: string;
  value: Value;
  oldUrl?: string | null;
};

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
  if (
    typeof value === "boolean"
  ) {
    return value;
  }

  return (
    String(value)
      .toLowerCase() ===
    "true"
  );
}

// =========================================================
// DATE
// =========================================================

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

  const date =
    new Date(String(value));

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
// JSON
// =========================================================

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

  if (
    typeof value !== "string"
  ) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
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
            "دسترسی غیرمجاز است.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // READ BODY
    // =====================================================

    let body: Body;

    const contentType =
      req.headers.get(
        "content-type"
      ) || "";

    // =====================================================
    // MULTIPART
    // =====================================================

    if (
      contentType.includes(
        "multipart/form-data"
      )
    ) {
      const formData =
        await req.formData();

      const rawValue =
        formData.get("value") ??
        formData.get("image") ??
        "";

      body = {
        id: String(
          formData.get("id") || ""
        ),

        field: String(
          formData.get("field") || ""
        ),

        value:
          rawValue as Value,

        oldUrl:
          (formData.get(
            "oldUrl"
          ) as string | null) ||
          null,
      };
    }

    // =====================================================
    // JSON
    // =====================================================

    else if (
      contentType.includes(
        "application/json"
      )
    ) {
      body =
        await req.json();
    }

    // =====================================================
    // INVALID
    // =====================================================

    else {
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
    // EXTRACT
    // =====================================================

    const {
      id,
      field,
      value,
      oldUrl,
    } = body;

    if (
      !id ||
      !field
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "اطلاعات ناقص است.",
        },
        {
          status: 400,
        }
      );
    }

    const numericId =
      Number(id);

    if (
      !Number.isInteger(
        numericId
      ) ||
      numericId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "شناسه تور نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // CHECK TOUR
    // =====================================================

    const currentTour =
      await prisma.tour.findUnique({
        where: {
          id: numericId,
        },
      });

    if (!currentTour) {
      return NextResponse.json(
        {
          success: false,
          error: "تور پیدا نشد.",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // FILE UPLOAD
    // =====================================================

    let newUrl:
      | string
      | null = null;

    if (
      value instanceof File &&
      value.size > 0
    ) {
      const blob =
        await put(
          `tours/${value.name}`,
          value,
          {
            access: "public",
            addRandomSuffix: true,
          }
        );

      newUrl = blob.url;
    }

    // =====================================================
    // UPDATE DATA
    // =====================================================

    const updateData: Record<
      string,
      any
    > = {};

    // =====================================================
    // PRICE
    // =====================================================

    if (
      field === "price"
    ) {
      const newPrice =
        Number(value);

      if (
        !Number.isFinite(
          newPrice
        ) ||
        newPrice < 0
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

      updateData.price =
        String(newPrice);

      const currentPercentage =
        currentTour.discountPercentage;

      if (
        currentPercentage > 0
      ) {
        updateData.discountedPrice =
          String(
            Math.round(
              newPrice -
                (newPrice *
                  currentPercentage) /
                  100
            )
          );
      }
    }

    // =====================================================
    // DISCOUNTED PRICE
    // =====================================================

    else if (
      field ===
      "discountedPrice"
    ) {
      const original =
        Number(
          currentTour.price
        );

      const discounted =
        Number(value);

      if (
        !Number.isFinite(
          discounted
        ) ||
        discounted <= 0 ||
        discounted >= original
      ) {
        updateData.discountedPrice =
          null;

        updateData.discountPercentage =
          0;
      } else {
        const percentage =
          Math.round(
            (
              (original -
                discounted) /
              original
            ) * 100
          );

        updateData.discountedPrice =
          String(discounted);

        updateData.discountPercentage =
          percentage;
      }
    }

    // =====================================================
    // DISCOUNT PERCENTAGE
    // =====================================================

    else if (
      field ===
      "discountPercentage"
    ) {
      let percentage =
        Number(value);

      if (
        !Number.isFinite(
          percentage
        )
      ) {
        percentage = 0;
      }

      percentage =
        Math.round(
          Math.min(
            Math.max(
              percentage,
              0
            ),
            100
          )
        );

      if (
        percentage === 0
      ) {
        updateData.discountPercentage =
          0;

        updateData.discountedPrice =
          null;
      } else {
        const original =
          Number(
            currentTour.price
          );

        if (
          !Number.isFinite(
            original
          ) ||
          original <= 0
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "قیمت اصلی باید بیشتر از صفر باشد.",
            },
            {
              status: 400,
            }
          );
        }

        const discounted =
          Math.round(
            original -
              (original *
                percentage) /
                100
          );

        updateData.discountPercentage =
          percentage;

        updateData.discountedPrice =
          String(discounted);
      }
    }

    // =====================================================
    // ARRAY FIELDS
    // =====================================================

    else if (
      [
        "highlights",
        "included",
        "excluded",
        "requirements",
        "gallery",
      ].includes(field)
    ) {
      updateData[field] =
        parseArray(value);
    }

    // =====================================================
    // ITINERARY
    // =====================================================

    else if (
      field === "itinerary"
    ) {
      updateData.itinerary =
        parseJson(value);
    }

    // =====================================================
    // BOOLEAN
    // =====================================================

    else if (
      field ===
        "isPublished" ||
      field ===
        "isSpecial"
    ) {
      updateData[field] =
        parseBoolean(value);
    }

    // =====================================================
    // DATES
    // =====================================================

    else if (
      field ===
        "departureDate" ||
      field ===
        "returnDate"
    ) {
      const date =
        parseDate(value);

      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !date
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

      updateData[field] =
        date;
    }

    // =====================================================
    // CAPACITY
    // =====================================================

    else if (
      field ===
        "capacity" ||
      field ===
        "remainingCapacity"
    ) {
      const number =
        Number(value);

      if (
        !Number.isInteger(
          number
        ) ||
        number < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "ظرفیت نامعتبر است.",
          },
          {
            status: 400,
          }
        );
      }

      updateData[field] =
        number;
    }

    // =====================================================
    // IMAGE
    // =====================================================

    else if (
      field === "image" ||
      field ===
        "thumbImage"
    ) {
      if (
        !newUrl
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "فایل تصویر ارسال نشده است.",
          },
          {
            status: 400,
          }
        );
      }

      updateData[field] =
        newUrl;
    }

    // =====================================================
    // STRING FIELDS
    // =====================================================

    else {
      if (
        value instanceof File
      ) {
        if (!newUrl) {
          return NextResponse.json(
            {
              success: false,
              error:
                "فایل معتبر نیست.",
            },
            {
              status: 400,
            }
          );
        }

        updateData[field] =
          newUrl;
      } else {
        updateData[field] =
          value === ""
            ? null
            : String(value);
      }
    }

    // =====================================================
    // NO UPDATE
    // =====================================================

    if (
      Object.keys(
        updateData
      ).length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "اطلاعاتی برای آپدیت وجود ندارد.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // UPDATE TOUR
    // =====================================================

    const updatedTour =
      await prisma.tour.update({
        where: {
          id: numericId,
        },

        data: updateData,
      });

    // =====================================================
    // DELETE OLD IMAGE
    // =====================================================

    if (
      oldUrl &&
      newUrl &&
      oldUrl !== newUrl
    ) {
      try {
        await fetch(
          oldUrl,
          {
            method: "DELETE",
          }
        );
      } catch (error) {
        console.warn(
          "Could not delete old blob:",
          error
        );
      }
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      type: "tour",
      field,
      tour: updatedTour,
    });
  } catch (error: any) {
    console.error(
      "Tour update error:",
      error
    );

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (
      error?.code === "P2025"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "تور پیدا نشد.",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // DUPLICATE
    // =====================================================

    if (
      error?.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "این مقدار قبلاً استفاده شده است.",
        },
        {
          status: 409,
        }
      );
    }

    // =====================================================
    // FINAL ERROR
    // =====================================================

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "خطا در بروزرسانی تور.",
      },
      {
        status: 500,
      }
    );
  }
}