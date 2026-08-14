// AdminOnly.tsx
import { getAdminSession } from "@/lib/auth";

export default async function AdminOnly({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) return null;
  return <>{children}</>;
}