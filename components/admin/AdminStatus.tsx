// AdminStatus.tsx
import { getAdminSession } from "@/lib/auth";
import LogoutButton from "../Button/LogoutButton";
import Link from "next/link";

export default async function AdminStatus() {
  const admin = await getAdminSession();

  if (!admin) return null;

  return (
    <div className="flex items-center gap-4 text-lg">
      <Link
        href="/admin"
        className="text-green-400 hover:text-green-300 font-semibold transition-colors"
      >
        Admin
      </Link>
      <LogoutButton />
    </div>
  );
}