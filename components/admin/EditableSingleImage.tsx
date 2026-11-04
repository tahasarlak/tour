
"use client";

import Image from "next/image";
import { uploadPresigned } from "@vercel/blob/client";
import { useEffect, useState } from "react";

import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field?: "image";
  src: string;
  type?: string;
};

const ALLOWED_TYPES = [
  "tour",
  "train",
  "flight",
  "bus",
  "accommodation",
  "visa",
];

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function EditableSingleImage({
  id,
  field = "image",
  src,
  type = "tour",
}: Props) {
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  // ==========================================
  // CHECK ADMIN
  // ==========================================

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (active) setIsAdmin(false);
          return;
        }

        const data = await response.json();

        if (active) {
          setIsAdmin(data.isAdmin === true);
        }
      } catch (err) {
        console.error("[IMAGE] Admin check failed:", err);

        if (active) {
          setIsAdmin(false);
        }
      }
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  // ==========================================
  // RESET IMAGE ERROR
  // ==========================================

  useEffect(() => {
    setImageError(false);
  }, [src]);

  // ==========================================
  // SAVE IMAGE
  // ==========================================

  const save = async () => {
    if (!isAdmin || !file || saving) return;

    setError("");
    setSaving(true);

    try {
      console.log("[IMAGE] 1. Starting upload", {
        id,
        type,
        field,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
      });

      // ======================================
      // VALIDATE PRODUCT TYPE
      // ======================================

      if (!ALLOWED_TYPES.includes(type)) {
        throw new Error("نوع محصول معتبر نیست.");
      }

      // ======================================
      // VALIDATE IMAGE
      // ======================================

      if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
        throw new Error("فرمت تصویر پشتیبانی نمی‌شود.");
      }

      if (file.size <= 0) {
        throw new Error("فایل تصویر خالی است.");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("حداکثر حجم تصویر ۱۵ مگابایت است.");
      }

      // ======================================
      // CREATE SAFE PATHNAME
      // ======================================

      const safeName = file.name
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-");

      const pathname =
        `products/${type}/${id}/${Date.now()}-${safeName || "image"}`;

      console.log("[IMAGE] 2. Requesting presigned upload", {
        pathname,
      });

      // ======================================
      // UPLOAD TO VERCEL BLOB
      // ======================================

      const blob = await uploadPresigned(
        pathname,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          contentType: file.type,
        }
      );

      if (!blob?.url) {
        throw new Error("آدرس تصویر از Vercel Blob دریافت نشد.");
      }

      console.log("[IMAGE] 3. Blob upload successful", {
        pathname: blob.pathname,
        url: blob.url,
        contentType: blob.contentType,
      });

      // ======================================
      // SAVE IMAGE URL IN DATABASE
      // ======================================

      console.log("[IMAGE] 4. Updating database", {
        id,
        type,
        field,
      });

      const response = await fetch("/api/product/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          type,
          field,
          imageUrl: blob.url,
          oldUrl: src,
        }),
      });

      const result = await response.json().catch(() => null);

      console.log("[IMAGE] 5. Database response", {
        status: response.status,
        success: result?.success,
        error: result?.error,
      });

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error ||
          result?.message ||
          "تصویر آپلود شد اما ذخیره در دیتابیس ناموفق بود."
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      console.log("[IMAGE] 6. COMPLETE", {
        id,
        type,
        field,
        url: blob.url,
      });

      setFile(null);
      setEdit(false);

      window.location.reload();

    } catch (err) {
      console.error("[IMAGE] UPLOAD FAILED", {
        message:
          err instanceof Error
            ? err.message
            : String(err),
        id,
        type,
        field,
      });

      setError(
        err instanceof Error
          ? err.message
          : "خطای ناشناخته هنگام آپلود تصویر."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CLEAR IMAGE (OPTIONAL FIELD)
  // ==========================================

  const clearImage = async () => {
    if (!isAdmin || !src || saving) return;

    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/product/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, field, imageUrl: "" }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "حذف تصویر انجام نشد.");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف تصویر انجام نشد.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const cancel = () => {
    if (saving) return;

    setFile(null);
    setError("");
    setEdit(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-xl bg-background">

      {src && !imageError ? (
        <Image
          src={src}
          alt="تصویر محصول"
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-contain p-2"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full min-h-48 w-full items-center justify-center bg-muted p-4 text-center text-sm text-muted-foreground">
          تصویر موجود نیست
        </div>
      )}

      {isAdmin && (
        <div className="absolute bottom-3 right-3 z-20 max-w-[calc(100%-1.5rem)] opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">

          {edit ? (
            <div className="flex max-w-full flex-wrap items-center justify-end gap-2 rounded-xl border border-border bg-card/95 p-2 text-card-foreground shadow-xl backdrop-blur">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                id={`file-${type}-${id}-${field}`}
                className="hidden"
                disabled={saving}
                onChange={(event) => {
                  const selected = event.target.files?.[0];

                  setFile(selected || null);
                  setError("");
                }}
              />

              <label
                htmlFor={`file-${type}-${id}-${field}`}
                className="cursor-pointer rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground"
              >
                {file ? "📷 عکس انتخاب شد" : "انتخاب عکس"}
              </label>

              <button
                type="button"
                onClick={save}
                disabled={!file || saving}
                className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50"
              >
                {saving ? "در حال آپلود..." : "ذخیره"}
              </button>

              {src && (
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={saving}
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-600 disabled:opacity-50"
                >
                  حذف تصویر
                </button>
              )}

              <button
                type="button"
                onClick={cancel}
                disabled={saving}
                className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground disabled:opacity-50"
              >
                لغو
              </button>

              {error && (
                <p
                  role="alert"
                  className="w-full break-words text-right text-xs text-red-500"
                >
                  {error}
                </p>
              )}

            </div>
          ) : (
            <EditButton
              onClick={() => {
                setFile(null);
                setError("");
                setEdit(true);
              }}
            />
          )}

        </div>
      )}
    </div>
  );
}
