"use client";

import EditableField from "./EditableField";

type Props = {
  id: number;
  price: number | null;
  discountedPrice: number | null;
  discountPercentage: number | null;
  currency?: string | null;
  type?: string;
  isAdmin?: boolean;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

export default function EditablePriceSection({
  id, price, discountedPrice, discountPercentage, currency, type = "tour", isAdmin = false,
}: Props) {
  const hasPrice = price !== null && Number.isFinite(price);
  const hasDiscountValue = discountedPrice !== null && Number.isFinite(discountedPrice);
  const hasDiscount = hasPrice && hasDiscountValue && discountPercentage !== null && discountPercentage > 0 && (discountedPrice as number) >= 0 && (discountedPrice as number) < (price as number);

  return (
    <section className="relative w-full rounded-xl border border-border bg-card p-4 text-card-foreground sm:p-5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-muted-foreground sm:text-base">قیمت</h3>
        <div className="mt-2 h-px w-8 bg-primary" />
      </div>

      {isAdmin ? (
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">قیمت اصلی</p>
            <EditableField id={id} field="price" value={hasPrice ? String(price) : ""} type={type} variant="value">
              <p className="text-2xl font-black text-primary">{hasPrice ? formatPrice(price as number) : "قیمت ثبت نشده"} {currency || ""}</p>
            </EditableField>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">قیمت تخفیفی (اختیاری)</p>
            <EditableField id={id} field="discountedPrice" value={discountedPrice === null ? "" : String(discountedPrice)} type={type} variant="value">
              <p className="text-lg font-bold text-foreground">{discountedPrice === null ? "ثبت نشده" : `${formatPrice(discountedPrice)} ${currency || ""}`}</p>
            </EditableField>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">درصد تخفیف (اختیاری)</p>
            <EditableField id={id} field="discountPercentage" value={discountPercentage === null ? "" : String(discountPercentage)} type={type} variant="value">
              <p className="text-sm font-semibold text-emerald-600">{discountPercentage === null ? "ثبت نشده" : `${discountPercentage}%`}</p>
            </EditableField>
          </div>
        </div>
      ) : hasDiscount ? (
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-sm text-muted-foreground line-through">{formatPrice(price as number)} {currency || ""}</span>
          <span className="text-2xl font-black text-primary">{formatPrice(discountedPrice as number)} {currency || ""}</span>
          <span className="text-xs font-bold text-emerald-600">{discountPercentage}% تخفیف</span>
        </div>
      ) : hasPrice || hasDiscountValue ? (
        <p className="text-2xl font-black text-primary">شروع قیمت از {formatPrice((hasPrice ? price : discountedPrice) as number)} {currency || ""}</p>
      ) : null}
    </section>
  );
}
