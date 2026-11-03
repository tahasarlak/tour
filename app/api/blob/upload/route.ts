
import { NextResponse } from "next/server";
import { issueSignedToken, presignUrl } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const maxSize = 15 * 1024 * 1024;

const validPathPattern =
  /^products\/(tour|train|flight|bus|accommodation|visa)\/[1-9]\d*\/[a-zA-Z0-9._-]+$/;

export async function POST(request: Request) {
  try {
    console.log("[BLOB] 1. Upload authorization started");

    // ADMIN AUTH
    const session = await getAdminSession();

    if (!session) {
      console.error("[BLOB] Unauthorized request");

      return NextResponse.json(
        { success: false, error: "دسترسی غیرمجاز است." },
        { status: 401 }
      );
    }

    // ENVIRONMENT CHECK
    const storeId = process.env.BLOB_STORE_ID;
    const oidcToken = process.env.VERCEL_OIDC_TOKEN;

    console.log("[BLOB] 2. Environment check", {
      hasStoreId: Boolean(storeId),
      hasOidcToken: Boolean(oidcToken),
      hasReadWriteToken: Boolean(
        process.env.BLOB_READ_WRITE_TOKEN
      ),
    });

    if (!storeId || !oidcToken) {
      throw new Error(
        "BLOB_STORE_ID یا VERCEL_OIDC_TOKEN تنظیم نشده است."
      );
    }

    // REQUEST BODY
    const body = await request.json();

    const pathname = String(body.pathname || "").trim();
    const contentType = String(body.contentType || "").trim();
    const size = Number(body.size);

    console.log("[BLOB] 3. Upload request", {
      pathname,
      contentType,
      size,
    });

    // VALIDATE PATH
    if (!validPathPattern.test(pathname)) {
      throw new Error("مسیر ذخیره تصویر نامعتبر است.");
    }

    // VALIDATE CONTENT TYPE
    if (!allowedContentTypes.includes(contentType)) {
      throw new Error("فرمت تصویر مجاز نیست.");
    }

    // VALIDATE SIZE
    if (
      !Number.isFinite(size) ||
      size <= 0 ||
      size > maxSize
    ) {
      throw new Error("حجم تصویر نامعتبر است.");
    }

    const validUntil = Date.now() + 10 * 60 * 1000;

    // ISSUE SIGNED TOKEN
    console.log("[BLOB] 4. Requesting signed token");

    const signedToken = await issueSignedToken({
      pathname,
      operations: ["put"],
      validUntil,
      allowedContentTypes: [contentType],
      maximumSizeInBytes: maxSize,
      storeId,
    });

    console.log("[BLOB] 5. Signed token created", {
      hasDelegationToken: Boolean(
        signedToken.delegationToken
      ),
      hasClientSigningToken: Boolean(
        signedToken.clientSigningToken
      ),
      validUntil: signedToken.validUntil,
    });

    // GENERATE PRESIGNED URL
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
      throw new Error("Presigned URL ساخته نشد.");
    }

    // NORMALIZE STORE ID
    const normalizedStoreId = storeId.replace(/^store_/, "");

    const blobUrl =
      `https://${normalizedStoreId}.public.blob.vercel-storage.com/${pathname}`;

    console.log("[BLOB] 6. Presigned URL generated", {
      host: new URL(presignedUrl).host,
      pathname,
      blobHost: new URL(blobUrl).host,
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

    console.error("[BLOB] UPLOAD AUTHORIZATION FAILED", {
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
