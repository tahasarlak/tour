
import { NextResponse } from "next/server";
import {
  issueSignedToken,
  presignUrl,
  parseStoreIdFromDelegationToken,
} from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const maxSize = 15 * 1024 * 1024;

const validPath =
  /^products\/(tour|train|flight|bus|accommodation|visa)\/[1-9]\d*\/[a-zA-Z0-9._-]+$/;

export async function POST(request: Request) {
  try {
    // 1. ADMIN AUTH
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "دسترسی غیرمجاز است.",
        },
        { status: 401 }
      );
    }

    // 2. BLOB CONFIGURATION
    const storeId = process.env.BLOB_STORE_ID?.trim();
    const hasReadWriteToken = Boolean(
      process.env.BLOB_READ_WRITE_TOKEN
    );

    console.log("[BLOB CONFIG]", {
      hasStoreId: Boolean(storeId),
      hasReadWriteToken,
      hasOidcRequestHeader: Boolean(
        request.headers.get("x-vercel-oidc-token")
      ),
      hasOidcEnvironment: Boolean(
        process.env.VERCEL_OIDC_TOKEN
      ),
      hasWebhookKey: Boolean(
        process.env.BLOB_WEBHOOK_PUBLIC_KEY
      ),
    });

    if (!storeId && !hasReadWriteToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "اتصال Blob به پروژه کامل نیست. پروژه را از قسمت Projects در Blob Store متصل کن.",
        },
        { status: 500 }
      );
    }

    // 3. READ BODY
    const body = await request.json();

    const pathname = String(body.pathname || "").trim();
    const contentType = String(body.contentType || "").trim();
    const size = Number(body.size);

    console.log("[BLOB REQUEST]", {
      pathname,
      contentType,
      size,
    });

    // 4. VALIDATE PATH
    if (!validPath.test(pathname)) {
      return NextResponse.json(
        {
          success: false,
          error: "مسیر آپلود معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // 5. VALIDATE CONTENT TYPE
    if (!allowedContentTypes.includes(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: "فرمت تصویر مجاز نیست.",
        },
        { status: 400 }
      );
    }

    // 6. VALIDATE SIZE
    if (
      !Number.isFinite(size) ||
      size <= 0 ||
      size > maxSize
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "حجم تصویر باید حداکثر ۱۵ مگابایت باشد.",
        },
        { status: 400 }
      );
    }

    const validUntil = Date.now() + 10 * 60 * 1000;

    // 7. ISSUE SIGNED TOKEN
    console.log("[BLOB] Creating signed token");

    const signedToken = await issueSignedToken({
      pathname,
      operations: ["put"],
      validUntil,
      allowedContentTypes: [contentType],
      maximumSizeInBytes: maxSize,
      ...(storeId ? { storeId } : {}),
    });

    console.log("[BLOB] Signed token created", {
      success: Boolean(signedToken.delegationToken),
      expiresAt: signedToken.validUntil,
    });

    // 8. CREATE PRESIGNED URL
    const { presignedUrl } = await presignUrl(
      signedToken,
      {
        pathname,
        operation: "put",
        access: "public",
        validUntil,
        allowedContentTypes: [contentType],
        maximumSizeInBytes: maxSize,
        addRandomSuffix: false,
        allowOverwrite: false,
      }
    );

    if (!presignedUrl) {
      throw new Error("ساخت آدرس آپلود ناموفق بود.");
    }

    // 9. GET REAL STORE ID FROM SIGNED TOKEN
    const normalizedStoreId =
      parseStoreIdFromDelegationToken(
        signedToken.delegationToken
      );

    // 10. CREATE PUBLIC BLOB URL
    const blobUrl =
      `https://${normalizedStoreId}.public.blob.vercel-storage.com/${pathname}`;

    console.log("[BLOB] Presigned URL ready", {
      pathname,
      blobHost: new URL(blobUrl).hostname,
      success: true,
    });

    return NextResponse.json({
      success: true,
      presignedUrl,
      blobUrl,
      pathname,
    });

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "خطای ناشناخته Blob";

    console.error("[BLOB UPLOAD ERROR]", {
      name:
        error instanceof Error
          ? error.name
          : "UnknownError",
      message,
    });

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
