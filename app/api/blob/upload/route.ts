
import { NextResponse } from "next/server";

import { issueSignedToken } from "@vercel/blob";

import {
  handleUploadPresigned,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";

import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ==========================================
// CONFIGURATION
// ==========================================

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const TOKEN_LIFETIME = 15 * 60 * 1000;
const URL_LIFETIME = 10 * 60 * 1000;

const ALLOWED_PATH =
  /^products\/(tour|train|flight|bus|accommodation|visa)\/[1-9]\d*\/[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

// ==========================================
// POST
// ==========================================

export async function POST(request: Request) {
  let receivedEventType = "unknown";

  try {
    // ========================================
    // 1. ENVIRONMENT VARIABLES
    // ========================================

    const storeId =
      process.env.BLOB_READ_WRITE_TOKEN_STORE_ID?.trim();

    const webhookPublicKey =
      process.env.BLOB_READ_WRITE_TOKEN_WEBHOOK_PUBLIC_KEY?.trim();

    console.log("[BLOB CONFIG]", {
      hasStoreId: Boolean(storeId),
      hasWebhookPublicKey: Boolean(webhookPublicKey),
      hasOidc: Boolean(process.env.VERCEL_OIDC_TOKEN),
      hasReadWriteToken: Boolean(
        process.env.BLOB_READ_WRITE_TOKEN
      ),
      environment: process.env.VERCEL_ENV || "unknown",
    });

    if (!storeId) {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN_STORE_ID is missing."
      );
    }

    if (!webhookPublicKey) {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN_WEBHOOK_PUBLIC_KEY is missing."
      );
    }

    // ========================================
    // 2. READ REQUEST BODY
    // ========================================

    let parsedBody: unknown;

    try {
      parsedBody = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request.",
        },
        { status: 400 }
      );
    }

    if (
      !parsedBody ||
      typeof parsedBody !== "object" ||
      Array.isArray(parsedBody)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid upload request body.",
        },
        { status: 400 }
      );
    }

    const eventInfo = parsedBody as {
      type?: unknown;
      payload?: {
        pathname?: unknown;
      };
    };

    receivedEventType =
      typeof eventInfo.type === "string"
        ? eventInfo.type
        : "missing";

    const body =
      parsedBody as HandleUploadPresignedBody;

    console.log("[BLOB EVENT RECEIVED]", {
      eventType: receivedEventType,
      pathname: eventInfo.payload?.pathname,
    });

    // ========================================
    // 3. HANDLE PRESIGNED UPLOAD
    // ========================================

    const result = await handleUploadPresigned({
      body,
      request,

      webhookPublicKey,

      // ======================================
      // 4. GENERATE SIGNED TOKEN
      // ======================================

      getSignedToken: async (pathname) => {

        console.log("[BLOB] Generating signed token", {
          pathname,
        });

        // ------------------------------------
        // ADMIN AUTHENTICATION
        // ------------------------------------

        const session = await getAdminSession();

        if (!session) {
          throw new Error("Unauthorized");
        }

        // ------------------------------------
        // PATH VALIDATION
        // ------------------------------------

        if (!ALLOWED_PATH.test(pathname)) {
          console.error("[BLOB] Invalid pathname:", pathname);

          throw new Error("Invalid upload pathname");
        }

        // ------------------------------------
        // ISSUE SIGNED TOKEN
        // ------------------------------------

        const token = await issueSignedToken({
          pathname,

          operations: ["put"],

          allowedContentTypes: ALLOWED_CONTENT_TYPES,

          maximumSizeInBytes: MAX_FILE_SIZE,

          validUntil:
            Date.now() + TOKEN_LIFETIME,

          storeId,
        });

        console.log("[BLOB] Signed token created", {
          pathname,
          success: true,
        });

        // ------------------------------------
        // RETURN URL OPTIONS
        // ------------------------------------

        return {
          token,

          urlOptions: {
            allowedContentTypes: ALLOWED_CONTENT_TYPES,

            maximumSizeInBytes: MAX_FILE_SIZE,

            validUntil:
              Date.now() + URL_LIFETIME,

            addRandomSuffix: true,

            allowOverwrite: false,
          },
        };
      },

      // ======================================
      // 5. UPLOAD COMPLETED
      // ======================================

      onUploadCompleted: async ({ blob }) => {
        console.log("[BLOB] UPLOAD COMPLETED", {
          pathname: blob.pathname,
          url: blob.url,
          contentType: blob.contentType,
        });
      },
    });

    // ========================================
    // 6. SUCCESS
    // ========================================

    console.log("[BLOB] PRESIGNED RESPONSE SUCCESS", {
      eventType: receivedEventType,
    });

    return NextResponse.json(result);

  } catch (error) {

    // ========================================
    // 7. ERROR HANDLING
    // ========================================

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error("[BLOB UPLOAD ERROR]", {
      message,
      receivedEventType,
      error,
    });

    let status = 500;

    if (message === "Unauthorized") {
      status = 401;
    } else if (
      message === "Invalid upload pathname" ||
      message === "Invalid event type"
    ) {
      status = 400;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
        receivedEventType,
      },
      { status }
    );
  }
}
