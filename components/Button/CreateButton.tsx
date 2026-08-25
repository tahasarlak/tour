"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import {
  type ProductType,
} from "@/lib/product-types";

type FormState = {
  name: string;
  price: string;
  currency: string;
  discountedPrice: string;
  discountPercentage: string;
  shortDescription: string;
  description: string;
  image: File | null;
  thumbImage: File | null;
  origin: string;
  destination: string;
  departureDate: string;
  isSpecial: boolean;
};

type Props = {
  type: ProductType;
  buttonText?: string;
  title?: string;
  submitText?: string;
  showDescription?: boolean;
  showPrice?: boolean;
  showDiscount?: boolean;
  showCurrency?: boolean;
  showImage?: boolean;
  defaultCurrency?: string;
  apiUrl?: string;
  redirectTo?: string;
};

function createInitialForm(defaultCurrency: string): FormState {
  return {
    name: "",
    price: "",
    currency: defaultCurrency,
    discountedPrice: "",
    discountPercentage: "",
    shortDescription: "",
    description: "",
    image: null,
    thumbImage: null,
    origin: "",
    destination: "",
    departureDate: "",
    isSpecial: false,
  };
}

function defaultApiForType(type: ProductType): string {
  switch (type) {
    case "train": return "/api/train/create";
    case "flight": return "/api/flight/create";
    case "bus": return "/api/bus/create";
    default: return "/api/product/create";
  }
}

function typeLabel(type: ProductType): string {
  switch (type) {
    case "train": return "بلیت قطار";
    case "flight": return "بلیت هواپیما";
    case "bus": return "بلیت اتوبوس";
    default: return "بلیت";
  }
}

export default function CreateButton({
  type,
  buttonText = "+ ساخت مورد جدید",
  title,
  submitText = "ساخت",
  showDescription = true,
  showPrice = true,
  showDiscount = true,
  showCurrency = true,
  showImage = true,
  defaultCurrency = "تومان",
  apiUrl,
  redirectTo,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState<FormState>(() => createInitialForm(defaultCurrency));

  const resolvedApiUrl = apiUrl || defaultApiForType(type);
  const resolvedTitle = title || `ساخت ${typeLabel(type)}`;

  function resetForm() {
    setForm(createInitialForm(defaultCurrency));
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

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ====================== قیمت و تخفیف ======================
  function handlePriceChange(value: string) {
    update("price", value);

    const price = Number(value);
    const percentage = Number(form.discountPercentage);

    if (Number.isFinite(price) && price > 0 && Number.isFinite(percentage) && form.discountPercentage !== "") {
      const discounted = Math.round(price - (price * percentage) / 100);
      update("discountedPrice", String(discounted));
    }
  }

  function handleDiscountedPriceChange(value: string) {
    const price = Number(form.price);
    if (!value) {
      setForm((prev) => ({ ...prev, discountedPrice: "", discountPercentage: "" }));
      return;
    }
    const discounted = Number(value);
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(discounted)) {
      update("discountedPrice", value);
      return;
    }
    const percentage = Math.round(((price - discounted) / price) * 100);
    setForm((prev) => ({
      ...prev,
      discountedPrice: value,
      discountPercentage: String(Math.max(0, Math.min(100, percentage))),
    }));
  }

  function handleDiscountPercentageChange(value: string) {
    if (!value) {
      setForm((prev) => ({ ...prev, discountPercentage: "", discountedPrice: "" }));
      return;
    }
    let percentage = Number(value);
    if (!Number.isFinite(percentage)) percentage = 0;
    percentage = Math.max(0, Math.min(100, percentage));

    const price = Number(form.price);
    const discounted = price > 0 ? Math.round(price - (price * percentage) / 100) : "";
    setForm((prev) => ({
      ...prev,
      discountPercentage: String(percentage),
      discountedPrice: discounted ? String(discounted) : "",
    }));
  }

  // ====================== اعتبارسنجی ======================
  function validate(): string | null {
    if (!form.name.trim()) return "لطفاً نام را وارد کنید.";
    if (showPrice && (!form.price.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) < 0)) {
      return "لطفاً قیمت معتبر وارد کنید.";
    }
    if (!form.origin.trim()) return "مبدا بلیت الزامی است.";
    if (!form.destination.trim()) return "مقصد بلیت الزامی است.";
    if (!form.departureDate) return "تاریخ حرکت بلیت الزامی است.";
    return null;
  }

  // ====================== ساخت ======================
  async function create() {
    if (loading) return;
    setErrorMessage("");

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("name", form.name.trim());

      if (showPrice) formData.append("price", form.price.trim() || "0");
      if (showCurrency) formData.append("currency", form.currency.trim() || defaultCurrency);
      if (showDiscount) {
        formData.append("discountPercentage", form.discountPercentage.trim());
        formData.append("discountedPrice", form.discountedPrice.trim());
      }
      formData.append("shortDescription", form.shortDescription.trim());

      if (showDescription) formData.append("description", form.description.trim());

      if (showImage && form.image) formData.append("image", form.image);
      if (showImage && form.thumbImage) formData.append("thumbImage", form.thumbImage);

      // فیلدهای اجباری بلیت‌ها
      formData.append("origin", form.origin.trim());
      formData.append("destination", form.destination.trim());
      formData.append("departureDate", form.departureDate);

      formData.append("isSpecial", form.isSpecial ? "true" : "false");

      const res = await fetch(resolvedApiUrl, { method: "POST", body: formData });

      const contentType = res.headers.get("content-type") || "";
      const responseText = await res.text();
      let result: any = null;

      if (contentType.includes("application/json")) {
        result = responseText ? JSON.parse(responseText) : null;
      } else {
        if (!res.ok) throw new Error(responseText?.trim() || `خطای سرور: ${res.status}`);
        throw new Error("سرور پاسخ JSON برنگرداند.");
      }

      if (!res.ok || (result && result.success === false)) {
        throw new Error(result?.error || result?.message || "ساخت اطلاعات ناموفق بود.");
      }

      setOpen(false);
      resetForm();
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "خطا در ساخت اطلاعات.";
      setErrorMessage(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  // ====================== کلاس‌های استایل ======================
  const inputClass = `
    w-full rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-lg text-white outline-none
    placeholder:text-slate-500 focus:border-amber-400
  `;
  const smallInputClass = `
    w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none
    placeholder:text-slate-500 focus:border-amber-400
  `;
  const textareaClass = `
    w-full resize-none rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-lg text-white outline-none
    placeholder:text-slate-500 focus:border-amber-400
  `;

  return (
    <>
      <Button variant="primary" size="lg" onClick={openModal}>{buttonText}</Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="my-8 w-full max-w-3xl rounded-3xl border border-amber-400/30 bg-slate-900 p-6 shadow-2xl md:p-8">
            <h2 className="text-2xl font-bold text-white mb-2">{resolvedTitle}</h2>
            <p className="text-sm text-slate-400">نوع اطلاعات: {typeLabel(type)}</p>

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="space-y-5 mt-6">
              {/* بخش پایه */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="mb-4 font-bold text-amber-400">اطلاعات پایه</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="نام *" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />

                  {showPrice && (
                    <input type="number" min="0" placeholder="قیمت اصلی *" value={form.price} onChange={(e) => handlePriceChange(e.target.value)} className={inputClass} />
                  )}

                  {showCurrency && (
                    <input type="text" placeholder="ارز" value={form.currency} onChange={(e) => update("currency", e.target.value)} className={inputClass} />
                  )}

                  {showDiscount && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <input type="number" min="0" placeholder="قیمت تخفیفی" value={form.discountedPrice} onChange={(e) => handleDiscountedPriceChange(e.target.value)} className={smallInputClass} />
                      <input type="number" min="0" max="100" placeholder="درصد تخفیف" value={form.discountPercentage} onChange={(e) => handleDiscountPercentageChange(e.target.value)} className={smallInputClass} />
                    </div>
                  )}

                  <textarea placeholder="توضیح کوتاه" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} rows={3} className={textareaClass} />

                  {showDescription && (
                    <textarea placeholder="توضیحات کامل" value={form.description} onChange={(e) => update("description", e.target.value)} rows={5} className={textareaClass} />
                  )}
                </div>
              </div>

              {/* تصاویر */}
              {showImage && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                  <h3 className="mb-4 font-bold text-amber-400">تصاویر</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-400">تصویر اصلی</label>
                      <input type="file" accept="image/*" onChange={(e) => update("image", e.target.files?.[0] || null)} className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-5 file:py-3 file:font-bold file:text-slate-900" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-slate-400">تصویر thumbnail</label>
                      <input type="file" accept="image/*" onChange={(e) => update("thumbImage", e.target.files?.[0] || null)} className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-5 file:py-3 file:font-bold file:text-slate-900" />
                    </div>
                  </div>
                </div>
              )}

              {/* مسیر و زمان‌بندی (فقط اجباری) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="mb-4 font-bold text-amber-400">مسیر و زمان‌بندی</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <input placeholder="مبدا *" value={form.origin} onChange={(e) => update("origin", e.target.value)} className={smallInputClass} />
                  <input placeholder="مقصد *" value={form.destination} onChange={(e) => update("destination", e.target.value)} className={smallInputClass} />
                  <input type="datetime-local" placeholder="تاریخ حرکت *" value={form.departureDate} onChange={(e) => update("departureDate", e.target.value)} className={smallInputClass} />
                </div>
              </div>

              {/* گزینه محصول ویژه */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="mb-4 font-bold text-amber-400">تنظیمات</h3>
                <label className="flex cursor-pointer items-center gap-3 text-slate-300">
                  <input type="checkbox" checked={form.isSpecial} onChange={(e) => update("isSpecial", e.target.checked)} className="h-5 w-5 accent-amber-500" />
                  محصول ویژه
                </label>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button variant="primary" size="lg" loading={loading} onClick={create} className="flex-1">{submitText}</Button>
              <Button variant="secondary" size="lg" onClick={closeModal} className="flex-1">لغو</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}