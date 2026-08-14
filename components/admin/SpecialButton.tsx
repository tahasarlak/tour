"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  type?: string;
  isSpecial: boolean;
};

export default function SpecialButton({
  id,
  type = "product",
  isSpecial,
}: Props) {
  const router = useRouter();

  const [special, setSpecial] =
    useState(isSpecial);

  const [loading, setLoading] =
    useState(false);

  const toggleSpecial = async () => {
    if (loading) return;

    const newValue = !special;

    try {
      setLoading(true);

      const res = await fetch(
        "/api/product/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            type,
            field: "isSpecial",
            value: newValue,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(
          data.error ||
            "خطا در تغییر وضعیت ویژه"
        );
        return;
      }

      setSpecial(newValue);
      router.refresh();
    } catch (error) {
      console.error(
        "Special update error:",
        error
      );

      alert("خطا در تغییر وضعیت ویژه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSpecial}
      disabled={loading}
      className={`
        rounded-xl
        border
        px-4
        py-2
        text-sm
        font-medium
        shadow-lg
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-50

        ${
          special
            ? `
              border-primary/50
              bg-primary/10
              text-primary
              hover:bg-primary/20
            `
            : `
              border-border
              bg-secondary
              text-muted-foreground
              hover:bg-accent
              hover:text-accent-foreground
            `
        }
      `}
    >
      {loading
        ? "در حال تغییر..."
        : special
          ? "⭐ ویژه"
          : "☆ عادی"}
    </button>
  );
}