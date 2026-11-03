
"use client";

import Image from "next/image";
import { uploadPresigned as upload } from "@vercel/blob/client";
import { useEffect, useState } from "react";

import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field?: "image";
  src: string;
  type?: string;
};

export default function EditableSingleImage({
  id,
  field = "image",
  src,
  type = "product",
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
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/avif",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("فرمت تصویر پشتیبانی نمی‌شود.");
      }

      if (file.size > 15 * 1024 * 1024) {
        throw new Error("حداکثر حجم تصویر ۱۵ مگابایت است.");
      }

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

      const blob = await upload(
        `products/${type}/${id}/${Date.now()}-${safeName}`,
        file,
        {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        }
      );

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

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
          result.message ||
          "ذخیره عکس ناموفق بود."
        );
      }

      setFile(null);
      setEdit(false);
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "خطای ناشناخته هنگام آپلود عکس"
      );
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
