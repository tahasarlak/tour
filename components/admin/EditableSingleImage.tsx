
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type ProductType =
  | "tour"
  | "train"
  | "flight"
  | "bus"
  | "accommodation"
  | "visa";

type Props = {
  id: number;
  field?: "image";
  src: string;
  type: ProductType;
};

export default function EditableSingleImage({
  id,
  field = "image",
  src,
  type,
}: Props) {
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [src]);

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

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("فرمت تصویر پشتیبانی نمی‌شود.");
      }

      if (file.size <= 0 || file.size > 15 * 1024 * 1024) {
        throw new Error("حجم تصویر باید کمتر از ۱۵ مگابایت باشد.");
      }

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

      const pathname =
        `products/${type}/${id}/${Date.now()}-${safeName}`;

      // STEP 1: GET PRESIGNED URL
      console.log("[IMAGE] 2. Requesting upload URL");

      const authResponse = await fetch(
        "/api/blob/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pathname,
            contentType: file.type,
            size: file.size,
          }),
        }
      );

      const authResult = await authResponse.json();

      console.log("[IMAGE] 3. Authorization response", {
        status: authResponse.status,
        success: authResult.success,
        error: authResult.error,
      });

      if (!authResponse.ok || !authResult.success) {
        throw new Error(
          authResult.error || "دریافت مجوز آپلود ناموفق بود."
        );
      }

      const presignedUrl = authResult.presignedUrl;
      const blobUrl = authResult.blobUrl;

      if (!presignedUrl || !blobUrl) {
        throw new Error("آدرس آپلود از سرور دریافت نشد.");
      }

      // STEP 2: UPLOAD TO VERCEL BLOB
      console.log("[IMAGE] 4. Uploading to Blob", {
        pathname,
        size: file.size,
      });

      const uploadResponse = await fetch(
        presignedUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        }
      );

      console.log("[IMAGE] 5. Blob upload response", {
        status: uploadResponse.status,
        ok: uploadResponse.ok,
      });

      if (!uploadResponse.ok) {
        const responseText =
          await uploadResponse.text();

        console.error("[IMAGE] Blob PUT failed", {
          status: uploadResponse.status,
          response: responseText.slice(0, 1500),
        });

        throw new Error(
          `آپلود Blob ناموفق بود. کد: ${uploadResponse.status}`
        );
      }

      console.log("[IMAGE] 6. Blob upload successful");

      // STEP 3: SAVE URL IN DATABASE
      console.log("[IMAGE] 7. Saving URL in Neon");

      const updateResponse = await fetch(
        "/api/product/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            type,
            field,
            imageUrl: blobUrl,
            oldUrl: src,
          }),
        }
      );

      const updateResult =
        await updateResponse.json();

      console.log("[IMAGE] 8. Database response", {
        status: updateResponse.status,
        success: updateResult.success,
        error: updateResult.error,
        savedUrl: updateResult.savedUrl,
      });

      if (!updateResponse.ok || !updateResult.success) {
        throw new Error(
          updateResult.error ||
          "ذخیره آدرس تصویر در دیتابیس ناموفق بود."
        );
      }

      if (
        updateResult.savedUrl &&
        updateResult.savedUrl !== blobUrl
      ) {
        throw new Error(
          "آدرس ذخیره‌شده با آدرس تصویر جدید مطابقت ندارد."
        );
      }

      console.log("[IMAGE] 9. COMPLETE", {
        id,
        type,
        field,
        blobUrl,
      });

      setFile(null);
      setEdit(false);

      window.location.reload();

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "خطای ناشناخته هنگام آپلود عکس";

      console.error("[IMAGE] UPLOAD FAILED", {
        message,
        id,
        type,
        field,
      });

      setError(message);

    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    if (saving) return;

    setFile(null);
    setError("");
    setEdit(false);
  };

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
                  const selected =
                    event.target.files?.[0];

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
