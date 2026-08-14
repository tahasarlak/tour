"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  type?: string;
  isPublished: boolean;
};

export default function PublishButton({
  id,
  type = "product",
  isPublished,
}: Props) {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [published, setPublished] =
    useState(isPublished);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/check");

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();

        setIsAdmin(data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  const togglePublish = async () => {
    if (!isAdmin || loading) return;

    const newValue = !published;

    try {
      setLoading(true);

      const res = await fetch("/api/product/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          type,
          field: "isPublished",
          value: newValue,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(
          data.error ||
            "خطا در تغییر وضعیت انتشار"
        );
        return;
      }

      setPublished(newValue);
      router.refresh();
    } catch (error) {
      console.error(
        "Publish update error:",
        error
      );

      alert("خطا در تغییر وضعیت انتشار");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={togglePublish}
      disabled={loading}
      className={`
        rounded-2xl
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
          published
            ? `
              border-emerald-500/40
              bg-emerald-500/10
              text-emerald-400
              hover:bg-emerald-500/20
            `
            : `
              border-destructive/40
              bg-destructive/10
              text-destructive
              hover:bg-destructive/20
            `
        }
      `}
    >
      {loading
        ? "در حال تغییر..."
        : published
          ? "✓ منتشر شده"
          : "✕ منتشر نشده"}
    </button>
  );
}