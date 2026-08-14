import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
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

    const body = await req.json();

    const id = Number(body.id);

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "شناسه تور نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // CHECK TOUR
    // =====================================================

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

    // =====================================================
    // DELETE TOUR
    // =====================================================

    await prisma.tour.delete({
      where: {
        id,
      },
    });

    // =====================================================
    // DELETE BLOBS
    // =====================================================

    const urls: string[] = [];

    if (tour.image) {
      urls.push(tour.image);
    }

    if (tour.thumbImage) {
      urls.push(tour.thumbImage);
    }

    if (
      Array.isArray(tour.gallery)
    ) {
      urls.push(
        ...tour.gallery.filter(
          Boolean
        )
      );
    }

    // حذف فایل‌ها از Blob
    for (const url of urls) {
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

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      type: "tour",
      message:
        "تور با موفقیت حذف شد.",
      tourId: id,
    });
  } catch (error: any) {
    console.error(
      "Tour delete error:",
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
    // GENERAL ERROR
    // =====================================================

    return NextResponse.json(
      {
        success: false,
        error: "خطا در حذف تور.",
      },
      {
        status: 500,
      }
    );
  }
}