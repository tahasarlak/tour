import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "ایمیل و رمز عبور الزامی است.",
        },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "ایمیل یا رمز اشتباه است.",
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "ایمیل یا رمز اشتباه است.",
        },
        { status: 401 }
      );
    }

    const token = createToken({
      id: admin.id,
      email: admin.email,
    });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,

      // در production حتماً true
      secure: process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/",

      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "خطا در ورود.",
      },
      { status: 500 }
    );
  }
}