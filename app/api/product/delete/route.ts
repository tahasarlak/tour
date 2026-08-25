import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

// =====================================================
// PRODUCT TYPE
// =====================================================

type ProductType =
  | "tour"
  | "train"
  | "flight"
  | "bus"
  | "accommodation"
  | "visa";

// =====================================================
// REQUEST BODY
// =====================================================

type DeleteBody = {
  id?: unknown;
  type?: unknown;
};

// =====================================================
// DELETE BLOBS
// =====================================================

async function deleteBlobs(
  urls: Array<string | null | undefined>
) {
  const uniqueUrls = [
    ...new Set(
      urls.filter(
        (url): url is string =>
          typeof url === "string" &&
          url.trim().length > 0
      )
    ),
  ];

  for (const url of uniqueUrls) {
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
}

// =====================================================
// POST
// =====================================================

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
          error: "دسترسی غیرمجاز است.",
        },
        {
          status: 401,
        }
      );
    }

    // =====================================================
    // BODY
    // =====================================================

    let body: DeleteBody;

    try {
      body = await req.json();
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

    // =====================================================
    // ID
    // =====================================================

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه محصول نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // TYPE
    // =====================================================

    const type = String(
      body.type || ""
    ).toLowerCase() as ProductType;

    const allowedTypes: ProductType[] = [
      "tour",
      "train",
      "flight",
      "bus",
      "accommodation",
      "visa",
    ];

    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "نوع محصول نامعتبر است. نوع باید یکی از tour, train, flight, bus, accommodation, visa باشد.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // TOUR
    // =====================================================

    if (type === "tour") {
      const tour =
        await prisma.tour.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            thumbImage: true,
            gallery: true,
          },
        });

      if (!tour) {
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

      await prisma.tour.delete({
        where: {
          id,
        },
      });

      await deleteBlobs([
        tour.image,
        tour.thumbImage,
        ...tour.gallery,
      ]);

      return NextResponse.json({
        success: true,
        type: "tour",
        message: "تور با موفقیت حذف شد.",
        productId: id,
      });
    }

    // =====================================================
    // TRAIN
    // =====================================================

    if (type === "train") {
      const trainTicket =
        await prisma.trainTicket.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            thumbImage: true,
            gallery: true,
          },
        });

      if (!trainTicket) {
        return NextResponse.json(
          {
            success: false,
            error: "بلیت قطار پیدا نشد.",
          },
          {
            status: 404,
          }
        );
      }

      await prisma.trainTicket.delete({
        where: {
          id,
        },
      });

      await deleteBlobs([
        trainTicket.image,
        trainTicket.thumbImage,
        ...trainTicket.gallery,
      ]);

      return NextResponse.json({
        success: true,
        type: "train",
        message:
          "بلیت قطار با موفقیت حذف شد.",
        productId: id,
      });
    }

    // =====================================================
    // FLIGHT
    // =====================================================

    if (type === "flight") {
      const flightTicket =
        await prisma.flightTicket.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            thumbImage: true,
            gallery: true,
          },
        });

      if (!flightTicket) {
        return NextResponse.json(
          {
            success: false,
            error:
              "بلیت هواپیما پیدا نشد.",
          },
          {
            status: 404,
          }
        );
      }

      await prisma.flightTicket.delete({
        where: {
          id,
        },
      });

      await deleteBlobs([
        flightTicket.image,
        flightTicket.thumbImage,
        ...flightTicket.gallery,
      ]);

      return NextResponse.json({
        success: true,
        type: "flight",
        message:
          "بلیت هواپیما با موفقیت حذف شد.",
        productId: id,
      });
    }

    // =====================================================
    // BUS
    // =====================================================

    if (type === "bus") {
      const busTicket =
        await prisma.busTicket.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            thumbImage: true,
            gallery: true,
          },
        });

      if (!busTicket) {
        return NextResponse.json(
          {
            success: false,
            error:
              "بلیت اتوبوس پیدا نشد.",
          },
          {
            status: 404,
          }
        );
      }

      await prisma.busTicket.delete({
        where: {
          id,
        },
      });

      await deleteBlobs([
        busTicket.image,
        busTicket.thumbImage,
        ...busTicket.gallery,
      ]);

      return NextResponse.json({
        success: true,
        type: "bus",
        message:
          "بلیت اتوبوس با موفقیت حذف شد.",
        productId: id,
      });
    }

    // =====================================================
    // ACCOMMODATION
    // =====================================================

    if (type === "accommodation") {
      const accommodation =
        await prisma.accommodation.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            thumbImage: true,
            gallery: true,
          },
        });

      if (!accommodation) {
        return NextResponse.json(
          {
            success: false,
            error: "اقامتگاه پیدا نشد.",
          },
          {
            status: 404,
          }
        );
      }

      await prisma.accommodation.delete({
        where: {
          id,
        },
      });

      await deleteBlobs([
        accommodation.image,
        accommodation.thumbImage,
        ...accommodation.gallery,
      ]);

      return NextResponse.json({
        success: true,
        type: "accommodation",
        message:
          "اقامتگاه با موفقیت حذف شد.",
        productId: id,
      });
    }

    // =====================================================
    // VISA
    // =====================================================

    if (type === "visa") {
      const visa =
        await prisma.touristVisa.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            image: true,
            thumbImage: true,
            gallery: true,
          },
        });

      if (!visa) {
        return NextResponse.json(
          {
            success: false,
            error:
              "ویزای توریستی پیدا نشد.",
          },
          {
            status: 404,
          }
        );
      }

      await prisma.touristVisa.delete({
        where: {
          id,
        },
      });

      await deleteBlobs([
        visa.image,
        visa.thumbImage,
        ...visa.gallery,
      ]);

      return NextResponse.json({
        success: true,
        type: "visa",
        message:
          "ویزای توریستی با موفقیت حذف شد.",
        productId: id,
      });
    }

    // =====================================================
    // FALLBACK
    // =====================================================

    return NextResponse.json(
      {
        success: false,
        error: "نوع محصول پشتیبانی نمی‌شود.",
      },
      {
        status: 400,
      }
    );
  } catch (error: any) {
    console.error(
      "Product delete error:",
      error
    );

    // =====================================================
    // PRISMA - NOT FOUND
    // =====================================================

    if (error?.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          error: "محصول پیدا نشد.",
        },
        {
          status: 404,
        }
      );
    }

    // =====================================================
    // PRISMA - FOREIGN KEY
    // =====================================================

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          success: false,
          error:
            "این محصول دارای رزرو یا اطلاعات وابسته است و نمی‌توان آن را حذف کرد.",
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
          "خطا در حذف محصول.",
      },
      {
        status: 500,
      }
    );
  }
}