import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({ isAdmin: !!session });
}

export async function POST() {
  // اگر بعداً بخواهیم از طریق POST هم چک کنیم (اختیاری)
  const session = await getAdminSession();
  return NextResponse.json({ isAdmin: !!session });
}