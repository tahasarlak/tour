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

type CreatedProduct = {
  id: number;
  slug: string;
};

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

const TYPE_LABELS: Record<ProductType, string> = {
  tour: "تور",
  train: "بلیط قطار",
  flight: "بلیط هواپیما",
  bus: "بلیط اتوبوس",
  accommodation: "اقامتگاه",
  visa: "ویزای توریستی",
};

export default function CreateButton({
  type,
  buttonText = "+ ساخت مورد جدید",
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

  const resolvedTitle =
    title || `ساخت ${TYPE_LABELS[type]} جدید`;

  function resetForm() {
    setName("");
    setPrice("");
    setImage(null);
    setErrorMessage("");
  }

  function openModal() {
    resetForm();
    setOpen(true);
  }

  function closeModal() {
    if (loading) return;

    setOpen(false);
    setErrorMessage("");
  }

  async function create() {
    if (loading) return;

    setErrorMessage("");

    const cleanName = name.trim();
    const cleanPrice = price.trim().replace(/,/g, "");
    const numericPrice = Number(cleanPrice);

    if (!cleanName) {
      setErrorMessage("لطفاً نام محصول را وارد کنید.");
      return;
    }

    if (
      !cleanPrice ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      setErrorMessage("لطفاً قیمت معتبر وارد کنید.");
      return;
    }

    if (!image || image.size <= 0) {
      setErrorMessage("لطفاً تصویر محصول را انتخاب کنید.");
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
      setErrorMessage(
        "فرمت تصویر باید JPG، PNG، WEBP یا AVIF باشد."
      );
      return;
    }

    if (image.size > MAX_IMAGE_SIZE) {
      setErrorMessage("حداکثر حجم تصویر ۱۵ مگابایت است.");
      return;
    }

    setLoading(true);

    let createdProduct: CreatedProduct | null = null;
    let imageWarning = "";

    try {
      // 1. ایجاد محصول به‌صورت پیش‌نویس

      const createResponse = await fetch(
        "/api/product/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            name: cleanName,
            price: cleanPrice,
            currency: "تومان",
          }),
        }
      );

      const createResult =
        await createResponse.json().catch(() => null);

      if (
        !createResponse.ok ||
        !createResult?.success ||
        !createResult?.product?.id ||
        !createResult?.product?.slug
      ) {
        throw new Error(
          createResult?.error ||
            createResult?.message ||
            "ساخت محصول ناموفق بود."
        );
      }

      const created: CreatedProduct = {
        id: Number(createResult.product.id),
        slug: String(createResult.product.slug),
      };

      createdProduct = created;

      // 2. آپلود یک تصویر به Vercel Blob

      try {
        const safeName = image.name
          .normalize("NFKD")
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .replace(/-+/g, "-");

        const pathname =
          `products/${type}/${created.id}/${Date.now()}-${safeName || "image"}`;

        console.log("[CREATE PRODUCT IMAGE] Starting", {
          type,
          id: created.id,
          pathname,
          fileName: image.name,
          fileSize: image.size,
          contentType: image.type,
        });

        const blob = await uploadPresigned(
          pathname,
          image,
          {
            access: "public",
            handleUploadUrl: "/api/blob/upload",
            contentType: image.type,
          }
        );

        if (!blob?.url) {
          throw new Error(
            "آدرس تصویر از Vercel Blob دریافت نشد."
          );
        }

        console.log("[CREATE PRODUCT IMAGE] Uploaded", {
          id: created.id,
          url: blob.url,
        });

        // 3. ذخیره آدرس تصویر در دیتابیس

        const updateResponse = await fetch(
          "/api/product/update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: created.id,
              type,
              field: "image",
              imageUrl: blob.url,
            }),
          }
        );

        const updateResult =
          await updateResponse.json().catch(() => null);

        if (
          !updateResponse.ok ||
          !updateResult?.success
        ) {
          throw new Error(
            updateResult?.error ||
              updateResult?.message ||
              "ذخیره آدرس تصویر ناموفق بود."
          );
        }

        console.log(
          "[CREATE PRODUCT IMAGE] Saved in database",
          {
            id: created.id,
            savedUrl: updateResult.savedUrl,
          }
        );

      } catch (imageError) {
        console.error(
          "[CREATE PRODUCT IMAGE] Upload failed",
          {
            type,
            id: created.id,
            error:
              imageError instanceof Error
                ? imageError.message
                : String(imageError),
          }
        );

        imageWarning =
          "محصول ساخته شد، اما عکس ذخیره نشد. می‌توانی عکس را از صفحه جزئیات دوباره آپلود کنی.";
      }

      // 4. انتقال به صفحه جزئیات

      setOpen(false);
      resetForm();

      if (imageWarning) {
        window.alert(imageWarning);
      }

      const detailUrl =
        `/products/${type}/${created.slug}`;

      router.push(redirectTo || detailUrl);
      router.refresh();

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "خطا در ساخت محصول.";

      console.error("[CREATE PRODUCT] Failed", {
        type,
        name: cleanName,
        hasImage: Boolean(image),
        createdProduct,
        message,
      });

      setErrorMessage(message);

    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3.5 text-base text-white outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20";

  return (
    <>
      <Button
        variant="primary"
        size="lg"
        onClick={openModal}
      >
        {buttonText}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-4">
          <div className="my-4 max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-amber-400/30 bg-slate-900 p-5 shadow-2xl sm:p-7">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {resolvedTitle}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                فقط نام، قیمت و یک تصویر را وارد کن.
                محصول ابتدا به‌صورت پیش‌نویس ساخته می‌شود
                و بقیه اطلاعات را در صفحه جزئیات تکمیل می‌کنی.
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm leading-6 text-red-300"
              >
                {errorMessage}
              </div>
            )}

            <div className="space-y-5">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  نام محصول *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="مثلاً تور تابستانی سوچی"
                  className={inputClass}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* PRICE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  قیمت به تومان *
                </label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="مثلاً ۱۲۵۰۰۰۰۰"
                  className={inputClass}
                  disabled={loading}
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  تصویر اصلی محصول *
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => {
                    setImage(
                      event.target.files?.[0] || null
                    );
                    setErrorMessage("");
                  }}
                  className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-300 file:ml-3 file:rounded-lg file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:font-bold file:text-slate-950"
                  disabled={loading}
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  JPG، PNG، WEBP یا AVIF — حداکثر ۱۵ مگابایت
                </p>

                {image && (
                  <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-200">
                    فایل انتخاب‌شده: {image.name}
                    {" "}({(image.size / 1024 / 1024).toFixed(2)} مگابایت)
                  </div>
                )}
              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={create}
                className="flex-1"
              >
                {submitText}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={closeModal}
                className="flex-1"
                disabled={loading}
              >
                لغو
              </Button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
