"use client";

import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <Button
      variant="danger"
      size="md"
      onClick={logout}
    >
      خروج از حساب
    </Button>
  );
}