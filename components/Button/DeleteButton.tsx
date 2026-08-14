"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../ui/Button";

type Props = {
  id: number;
  type?: string;
};

export default function DeleteButton({
  id,
  type = "product",
}: Props) {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const remove = async () => {
    if (!isAdmin || deleting) return;

    const confirmed = confirm(
      "آیا مطمئن هستید می‌خواهید این مورد را حذف کنید؟"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const res = await fetch("/api/product/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          type,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        router.refresh();
        return;
      }

      alert(
        `❌ خطا: ${
          result.message ||
          result.error ||
          "حذف انجام نشد."
        }`
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ خطا در حذف.");
    } finally {
      setDeleting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Button
      variant="danger"
      size="sm"
      onClick={remove}
    >
      {deleting ? "در حال حذف..." : "حذف"}
    </Button>
  );
}