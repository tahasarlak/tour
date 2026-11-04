"use client";

import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field: string;
  value: string;
  children: React.ReactNode;
  type?: string;
  variant?: "value" | "text" | "tags" | "check" | "dot";
};

const NUMBER_FIELDS = new Set([
  "price", "discountedPrice", "discountPercentage", "capacity", "remainingCapacity",
  "starRating", "rooms", "minimumNights", "stops", "latitude", "longitude",
]);
const INTEGER_FIELDS = new Set([
  "discountPercentage", "capacity", "remainingCapacity", "starRating", "rooms", "minimumNights", "stops",
]);

export default function EditableField({ id, field, value, children, type = "product", variant = "value" }: Props) {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/check", { cache: "no-store" })
      .then(async (res) => res.ok ? res.json() : null)
      .then((data) => { if (active) setIsAdmin(data?.isAdmin === true); })
      .catch(() => { if (active) setIsAdmin(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => setNewValue(value), [value, edit]);

  const isTextarea = ["text", "tags", "check", "dot"].includes(variant);
  const isNumberField = NUMBER_FIELDS.has(field);

  async function save() {
    if (!isAdmin || saving) return;

    let parsedValue: unknown = newValue;
    if (["tags", "check", "dot"].includes(variant)) {
      parsedValue = newValue.split("\n").map((item) => item.trim()).filter(Boolean);
    } else if (isNumberField) {
      if (!newValue.trim()) {
        parsedValue = null;
      } else {
        const number = Number(newValue);
        if (!Number.isFinite(number) || (INTEGER_FIELDS.has(field) && !Number.isInteger(number))) {
          window.alert("مقدار عددی معتبر نیست.");
          return;
        }
        parsedValue = number;
      }
    }

    try {
      setSaving(true);
      const response = await fetch("/api/product/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, field, value: parsedValue }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        window.alert(result?.error || result?.message || "ذخیره اطلاعات انجام نشد.");
        return;
      }
      setEdit(false);
      window.location.reload();
    } catch (error) {
      console.error("Product field update failed:", error);
      window.alert("ارتباط با سرور برقرار نشد. دوباره تلاش کن.");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setNewValue(value);
    setEdit(false);
  }

  return (
    <div className="relative w-full min-w-0">
      {edit ? (
        <div className="w-full">
          {isTextarea ? (
            <textarea value={newValue} onChange={(event) => setNewValue(event.target.value)} onBlur={save} onKeyDown={(event) => { if (event.key === "Escape") cancel(); }} autoFocus disabled={saving} className="min-h-[120px] w-full resize-y rounded-xl border border-primary/70 bg-background px-4 py-3 text-sm leading-7 text-foreground outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70" />
          ) : (
            <input value={newValue} onChange={(event) => setNewValue(event.target.value)} onBlur={save} onKeyDown={(event) => { if (event.key === "Escape") cancel(); if (event.key === "Enter") event.currentTarget.blur(); }} autoFocus disabled={saving} type={isNumberField ? "number" : "text"} step={field === "latitude" || field === "longitude" || field === "price" || field === "discountedPrice" ? "any" : "1"} min={isNumberField && field !== "latitude" && field !== "longitude" ? 0 : undefined} max={field === "discountPercentage" ? 100 : field === "starRating" ? 5 : undefined} className="w-full rounded-xl border border-primary/70 bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70" />
          )}
          {saving && <p className="mt-2 text-xs text-primary">در حال ذخیره...</p>}
        </div>
      ) : (
        <div className="relative min-w-0">
          <div className="min-w-0">{children}</div>
          {isAdmin && <div className="absolute right-0 top-0 z-20"><EditButton onClick={() => { setNewValue(value); setEdit(true); }} /></div>}
        </div>
      )}
    </div>
  );
}
