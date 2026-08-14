import { cookies } from "next/headers";
import jwt, { type JwtPayload } from "jsonwebtoken";

// ======================================================
// JWT SECRET
// ======================================================

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

// ======================================================
// ADMIN TOKEN TYPE
// ======================================================

export type AdminToken = {
  id: number;
  email: string;
};

// ======================================================
// CREATE TOKEN
// ======================================================

export function createToken(data: AdminToken): string {
  const secret = getJwtSecret();

  return jwt.sign(data, secret, {
    expiresIn: "7d",
  });
}

// ======================================================
// GET ADMIN SESSION
// ======================================================

export async function getAdminSession(): Promise<AdminToken | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = getJwtSecret();

    const decoded = jwt.verify(
      token,
      secret
    ) as JwtPayload;

    if (
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string"
    ) {
      return null;
    }

    return {
      id: decoded.id,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}