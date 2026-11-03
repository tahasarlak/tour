
import { NextResponse } from "next/server";
import { issueSignedToken } from "@vercel/blob";
import {
  handleUploadPresigned,
  type HandleUploadPresignedBody,
} from "@vercel/blob/client";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const maxSize = 15 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // 1. ADMIN AUTHENTICATION
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 2. CHECK OIDC CONFIGURATION
    if (
      !process.env.BLOB_STORE_ID ||
      !process.env.VERCEL_OIDC_TOKEN
    ) {
      console.error("[BLOB] Missing OIDC configuration");

      return NextResponse.json(
        {
          success: false,
          error: "Blob OIDC configuration is missing.",
        },
        { status: 500 }
      );
    }

    if (!process.env.BLOB_WEBHOOK_PUBLIC_KEY) {
      console.error("[BLOB] Missing webhook public key");

      return NextResponse.json(
        {
          success: false,
          error: "Blob webhook public key is missing.",
        },
        { status: 500 }
      );
    }

    // 3. READ REQUEST
    const body =
      (await request.json()) as HandleUploadPresignedBody;

    // 4. GENERATE PRESIGNED UPLOAD
    const result = await handleUploadPresigned({
      body,
      request,

      webhookPublicKey:
        process.env.BLOB_WEBHOOK_PUBLIC_KEY,

      getSignedToken: async (pathname) => {
        // Only allow product images
        const validPath =
          /^products\/(tour|train|flight|bus|accommodation|visa)\/[1-9]\d*\/[a-zA-Z0-9._-]+$/.test(
            pathname
          );

        if (!validPath) {
          throw new Error("Invalid upload pathname");
        }

        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes,
          maximumSizeInBytes: maxSize,
          validUntil: Date.now() + 10 * 60 * 1000,
        });

        return {
          token,
          urlOptions: {
            allowedContentTypes,
            maximumSizeInBytes: maxSize,
            addRandomSuffix: true,
            allowOverwrite: false,
          },
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("[BLOB] Upload completed:", {
          pathname: blob.pathname,
          url: blob.url,
        });
      },
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("[BLOB PRESIGNED UPLOAD ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Blob upload failed",
      },
      { status: 400 }
    );
  }
}
