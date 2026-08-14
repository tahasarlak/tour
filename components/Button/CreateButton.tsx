"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";

type CreateType = string;

type FormState = {
  name: string;
  price: string;
  currency: string;
  discountedPrice: string;
  discountPercentage: string;
  shortDescription: string;
  description: string;
  image: File | null;
};

type Props = {
  type: CreateType;

  /**
   * متن دکمه ساخت
   */
  buttonText?: string;

  /**
   * عنوان مودال
   */
  title?: string;

  /**
   * متن دکمه ایجاد
   */
  submitText?: string;

  /**
   * نمایش توضیحات کامل
   */
  showDescription?: boolean;

  /**
   * نمایش فیلد قیمت
   */
  showPrice?: boolean;

  /**
   * نمایش فیلد تخفیف
   */
  showDiscount?: boolean;

  /**
   * نمایش ارز
   */
  showCurrency?: boolean;

  /**
   * نمایش آپلود تصویر
   */
  showImage?: boolean;

  /**
   * مقدار پیش‌فرض ارز
   */
  defaultCurrency?: string;

  /**
   * مسیر API
   */
  apiUrl?: string;

  /**
   * مسیر بعد از ایجاد
   */
  redirectTo?: string;
};

export default function CreateButton({
  type,

  buttonText = "+ ساخت مورد جدید",

  title = "ساخت مورد جدید",

  submitText = "ساخت",

  showDescription = true,

  showPrice = true,

  showDiscount = true,

  showCurrency = true,

  showImage = true,

  defaultCurrency = "₽",

  apiUrl = "/api/product/create",

  redirectTo,
}: Props) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] =
    useState<FormState>({
      name: "",
      price: "",
      currency: defaultCurrency,
      discountedPrice: "",
      discountPercentage: "",
      shortDescription: "",
      description: "",
      image: null,
    });

  // =========================================================
  // RESET
  // =========================================================

  function resetForm() {
    setForm({
      name: "",
      price: "",
      currency: defaultCurrency,
      discountedPrice: "",
      discountPercentage: "",
      shortDescription: "",
      description: "",
      image: null,
    });
  }

  // =========================================================
  // OPEN
  // =========================================================

  function openModal() {
    resetForm();
    setOpen(true);
  }

  // =========================================================
  // CLOSE
  // =========================================================

  function closeModal() {
    if (loading) return;

    setOpen(false);
  }

  // =========================================================
  // PRICE
  // =========================================================

  function handlePriceChange(
    value: string
  ) {
    setForm((prev) => {
      let discountedPrice =
        prev.discountedPrice;

      let discountPercentage =
        prev.discountPercentage;

      const price = Number(value);

      if (
        discountPercentage &&
        Number.isFinite(price) &&
        price > 0
      ) {
        const percentage = Number(
          discountPercentage
        );

        if (
          Number.isFinite(percentage)
        ) {
          discountedPrice = String(
            Math.round(
              price -
                (price * percentage) /
                  100
            )
          );
        }
      }

      return {
        ...prev,
        price: value,
        discountedPrice,
      };
    });
  }

  // =========================================================
  // DISCOUNTED PRICE
  // =========================================================

  function handleDiscountedPriceChange(
    value: string
  ) {
    const price = Number(
      form.price
    );

    if (!value) {
      setForm((prev) => ({
        ...prev,
        discountedPrice: "",
        discountPercentage: "",
      }));

      return;
    }

    const discounted =
      Number(value);

    let percentage = "";

    if (
      Number.isFinite(price) &&
      price > 0 &&
      Number.isFinite(discounted)
    ) {
      percentage = String(
        Math.round(
          ((price - discounted) /
            price) *
            100
        )
      );
    }

    setForm((prev) => ({
      ...prev,
      discountedPrice: value,
      discountPercentage:
        percentage,
    }));
  }

  // =========================================================
  // DISCOUNT PERCENTAGE
  // =========================================================

  function handleDiscountPercentageChange(
    value: string
  ) {
    const price = Number(
      form.price
    );

    if (!value) {
      setForm((prev) => ({
        ...prev,
        discountPercentage: "",
        discountedPrice: "",
      }));

      return;
    }

    let percentage =
      Number(value);

    if (percentage > 100) {
      percentage = 100;
    }

    if (percentage < 0) {
      percentage = 0;
    }

    const percentageString =
      String(percentage);

    let discounted = "";

    if (
      Number.isFinite(price) &&
      price > 0 &&
      Number.isFinite(percentage)
    ) {
      discounted = String(
        Math.round(
          price -
            (price * percentage) /
              100
        )
      );
    }

    setForm((prev) => ({
      ...prev,
      discountPercentage:
        percentageString,
      discountedPrice:
        discounted,
    }));
  }

  // =========================================================
  // CREATE
  // =========================================================

  async function create() {
    if (loading) return;

    if (!form.name.trim()) {
      alert("لطفاً نام را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      const formData =
        new FormData();

      // =========================
      // TYPE
      // =========================

      formData.append(
        "type",
        type
      );

      // =========================
      // NAME
      // =========================

      formData.append(
        "name",
        form.name.trim()
      );

      // =========================
      // PRICE
      // =========================

      if (showPrice) {
        formData.append(
          "price",
          String(
            form.price || "0"
          )
        );
      }

      // =========================
      // CURRENCY
      // =========================

      if (showCurrency) {
        formData.append(
          "currency",
          String(
            form.currency ||
              defaultCurrency
          )
        );
      }

      // =========================
      // DISCOUNT
      // =========================

      if (showDiscount) {
        formData.append(
          "discountPercentage",
          String(
            form.discountPercentage ||
              ""
          )
        );

        formData.append(
          "discountedPrice",
          String(
            form.discountedPrice ||
              ""
          )
        );
      }

      // =========================
      // SHORT DESCRIPTION
      // =========================

      formData.append(
        "shortDescription",
        String(
          form.shortDescription ||
            ""
        )
      );

      // =========================
      // DESCRIPTION
      // =========================

      if (showDescription) {
        formData.append(
          "description",
          String(
            form.description ||
              ""
          )
        );
      }

      // =========================
      // IMAGE
      // =========================

      if (
        showImage &&
        form.image
      ) {
        formData.append(
          "image",
          form.image
        );
      }

      // =========================
      // API
      // =========================

      const res =
        await fetch(
          apiUrl,
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await res.json();

      if (!res.ok) {
        throw new Error(
          result.error ||
            result.message ||
            "خطا در ساخت اطلاعات."
        );
      }

      // =========================
      // SUCCESS
      // =========================

      setOpen(false);

      resetForm();

      if (redirectTo) {
        router.push(
          redirectTo
        );
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(
        "CREATE ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "خطا در ساخت اطلاعات."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {/* =====================================================
          CREATE BUTTON
      ===================================================== */}

      <Button
        variant="primary"
        size="lg"
        onClick={openModal}
      >
        {buttonText}
      </Button>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/70
            p-4
          "
        >
          <div
            className="
              my-8
              w-full
              max-w-lg
              rounded-3xl
              border
              border-amber-400/30
              bg-slate-900
              p-8
              shadow-2xl
            "
          >
            {/* TITLE */}

            <h2
              className="
                mb-6
                text-2xl
                font-bold
                text-white
              "
            >
              {title}
            </h2>

            {/* =================================================
                FORM
            ================================================= */}

            <div className="space-y-4">

              {/* NAME */}

              <input
                type="text"
                placeholder="نام"
                value={form.name}
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      name: e.target
                        .value,
                    })
                  )
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-5
                  py-4
                  text-lg
                  text-white
                  outline-none
                  transition
                  placeholder:text-slate-500
                  focus:border-amber-400
                "
              />

              {/* PRICE */}

              {showPrice && (
                <input
                  type="number"
                  min="0"
                  placeholder="قیمت اصلی"
                  value={
                    form.price
                  }
                  onChange={(e) =>
                    handlePriceChange(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800
                    px-5
                    py-4
                    text-lg
                    text-white
                    outline-none
                    focus:border-amber-400
                  "
                />
              )}

              {/* CURRENCY */}

              {showCurrency && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="ارز"
                    value={
                      form.currency
                    }
                    onChange={(e) =>
                      setForm(
                        (prev) => ({
                          ...prev,
                          currency:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-800
                      px-5
                      py-4
                      text-lg
                      text-white
                      outline-none
                      focus:border-amber-400
                    "
                  />

                  {form.currency !==
                    defaultCurrency && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            currency:
                              defaultCurrency,
                          })
                        )
                      }
                      className="
                        text-sm
                        text-amber-400
                        transition
                        hover:text-amber-300
                      "
                    >
                      پیشنهاد:{" "}
                      {
                        defaultCurrency
                      }
                    </button>
                  )}
                </div>
              )}

              {/* DISCOUNTED PRICE */}

              {showDiscount && (
                <input
                  type="number"
                  min="0"
                  placeholder="قیمت تخفیفی"
                  value={
                    form.discountedPrice
                  }
                  onChange={(e) =>
                    handleDiscountedPriceChange(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800
                    px-5
                    py-4
                    text-lg
                    text-white
                    outline-none
                    focus:border-amber-400
                  "
                />
              )}

              {/* DISCOUNT PERCENTAGE */}

              {showDiscount && (
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="درصد تخفیف"
                  value={
                    form.discountPercentage
                  }
                  onChange={(e) =>
                    handleDiscountPercentageChange(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800
                    px-5
                    py-4
                    text-lg
                    text-white
                    outline-none
                    focus:border-amber-400
                  "
                />
              )}

              {/* SHORT DESCRIPTION */}

              <textarea
                placeholder="توضیح کوتاه"
                value={
                  form.shortDescription
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      shortDescription:
                        e.target
                          .value,
                    })
                  )
                }
                rows={4}
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-5
                  py-4
                  text-lg
                  text-white
                  outline-none
                  placeholder:text-slate-500
                  focus:border-amber-400
                "
              />

              {/* DESCRIPTION */}

              {showDescription && (
                <textarea
                  placeholder="توضیحات کامل"
                  value={
                    form.description
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        description:
                          e.target
                            .value,
                      })
                    )
                  }
                  rows={5}
                  className="
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-slate-700
                    bg-slate-800
                    px-5
                    py-4
                    text-lg
                    text-white
                    outline-none
                    placeholder:text-slate-500
                    focus:border-amber-400
                  "
                />
              )}

              {/* IMAGE */}

              {showImage && (
                <div className="space-y-2">
                  <label
                    className="
                      block
                      text-sm
                      text-slate-400
                    "
                  >
                    تصویر
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file =
                        e.target
                          .files?.[0] ||
                        null;

                      setForm(
                        (prev) => ({
                          ...prev,
                          image:
                            file,
                        })
                      );
                    }}
                    className="
                      block
                      w-full
                      text-sm
                      text-slate-400
                      file:mr-4
                      file:rounded-xl
                      file:border-0
                      file:bg-amber-500
                      file:px-5
                      file:py-3
                      file:font-bold
                      file:text-slate-900
                      hover:file:bg-amber-400
                    "
                  />

                  {form.image && (
                    <p className="text-sm text-slate-500">
                      {
                        form.image
                          .name
                      }
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                mt-8
                flex
                gap-4
              "
            >
              {/* CREATE */}

              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={create}
                className="flex-1"
              >
                {submitText}
              </Button>

              {/* CANCEL */}

              <Button
                variant="secondary"
                size="lg"
                onClick={closeModal}
                className="flex-1"
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