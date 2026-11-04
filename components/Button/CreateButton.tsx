"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPresigned } from "@vercel/blob/client";
import Button from "@/components/ui/Button";
import type { ProductType } from "@/lib/product-types";

type Props = {
  type: ProductType;
  buttonText?: string;
  title?: string;
  submitText?: string;
  redirectTo?: string;
};

const labels: Record<ProductType, string> = {
  tour: "تور",
  train: "بلیط قطار",
  flight: "بلیط هواپیما",
  bus: "بلیط اتوبوس",
  accommodation: "اقامتگاه",
  visa: "ویزای توریستی",
};
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

export default function CreateButton({
  type,
  buttonText = "+ ساخت محصول جدید",
  title,
  submitText = "ساخت محصول",
  redirectTo,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  function reset() {
    setName("");
    setPrice("");
    setImage(null);
    setErrorMessage("");
  }

  function close() {
    if (loading) return;
    setOpen(false);
    reset();
  }

  async function create() {
    if (loading) return;
    setErrorMessage("");

    if (price.trim()) {
      const parsed = Number(price.replace(/,/g, ""));
      if (!Number.isFinite(parsed) || parsed < 0) {
        setErrorMessage("قیمت باید عدد معتبر و غیرمنفی باشد؛ یا آن را خالی بگذار.");
        return;
      }
    }
    if (image && (!ALLOWED_TYPES.includes(image.type) || image.size <= 0 || image.size > MAX_FILE_SIZE)) {
      setErrorMessage("تصویر باید JPG، PNG، WEBP یا AVIF و حداکثر ۱۵ مگابایت باشد.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/product/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: name.trim() || null,
          price: price.trim() || null,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success || !result?.product?.id || !result?.product?.slug) {
        throw new Error(result?.error || result?.message || "ساخت محصول انجام نشد.");
      }

      const product = result.product as { id: number; slug: string };
      let imageWarning = "";

      if (image) {
        try {
          const safeName = image.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-") || "image";
          const pathname = `products/${type}/${product.id}/${Date.now()}-${safeName}`;
          const blob = await uploadPresigned(pathname, image, {
            access: "public",
            handleUploadUrl: "/api/blob/upload",
            contentType: image.type,
          });
          if (!blob?.url) throw new Error("آدرس تصویر دریافت نشد.");

          const saveImage = await fetch("/api/product/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: product.id, type, field: "image", imageUrl: blob.url }),
          });
          const saved = await saveImage.json().catch(() => null);
          if (!saveImage.ok || !saved?.success) throw new Error(saved?.error || "ذخیره آدرس تصویر انجام نشد.");
        } catch (uploadError) {
          console.error("Product created, but image upload failed:", uploadError);
          imageWarning = "محصول ساخته شد، اما تصویر ذخیره نشد. می‌توانی آن را در صفحه جزئیات دوباره اضافه کنی.";
        }
      }

      setOpen(false);
      reset();
      if (imageWarning) window.alert(imageWarning);
      router.push(redirectTo || `/products/${type}/${product.slug}`);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "خطا در ساخت محصول.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-amber-400";

  return (
    <>
      <Button variant="primary" size="lg" onClick={() => { reset(); setOpen(true); }}>{buttonText}</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div dir="rtl" className="my-8 w-full max-w-xl rounded-3xl border border-amber-400/30 bg-slate-900 p-6 text-white shadow-2xl sm:p-8">
            <h2 className="text-2xl font-bold">{title || `ساخت ${labels[type]}`}</h2>
            <p className="mt-2 text-sm text-slate-400">فقط اطلاعات اولیه را وارد کن. همه موارد اختیاری هستند و جزئیات بعداً در صفحه محصول تکمیل می‌شوند.</p>

            {errorMessage && <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{errorMessage}</div>}

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">نام محصول (اختیاری)</label>
                <input value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="نام محصول" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">قیمت (اختیاری)</label>
                <input type="number" min="0" step="any" value={price} onChange={(event) => setPrice(event.target.value)} className={inputClass} placeholder="مثلاً ۵۶۰۰۰۰۰" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">عکس اصلی (اختیاری)</label>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="block w-full text-sm text-slate-300 file:ml-3 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:font-bold file:text-slate-950" />
                {image && <p className="mt-2 text-xs text-emerald-300">انتخاب شد: {image.name}</p>}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="primary" size="lg" loading={loading} onClick={create} className="flex-1">{submitText}</Button>
              <Button variant="secondary" size="lg" onClick={close} className="flex-1">لغو</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
