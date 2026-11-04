"use client";

import { useEffect, useState } from "react";
import type { ProductType } from "@/lib/product-types";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field: string;
  value: boolean | null;
  children: React.ReactNode;
  type?: ProductType;
};

export default function EditableSingleBoolean({ id, field, value, children, type = "tour" }: Props) {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState<boolean | null>(value);
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

  async function save() {
    if (!isAdmin || saving) return;
    try {
      setSaving(true);
      const response = await fetch("/api/product/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, field, value: newValue }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        window.alert(result?.error || "ذخیره وضعیت انجام نشد.");
        return;
      }
      setEdit(false);
      window.location.reload();
    } catch (error) {
      console.error("Boolean field update failed:", error);
      window.alert("ارتباط با سرور برقرار نشد.");
    } finally {
      setSaving(false);
    }
  }

  if (!edit) {
    return (
      <div className="flex items-center gap-2">
        <div className="min-w-0">{children}</div>
        {isAdmin && <EditButton onClick={() => { setNewValue(value); setEdit(true); }} />}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2">
      <select value={newValue === null ? "" : newValue ? "true" : "false"} onChange={(event) => setNewValue(event.target.value === "" ? null : event.target.value === "true")} disabled={saving} className="min-w-36 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
        <option value="">مشخص نشده</option>
        <option value="true">بله</option>
        <option value="false">خیر</option>
      </select>
      <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50">{saving ? "ذخیره..." : "ذخیره"}</button>
      <button type="button" onClick={() => { setNewValue(value); setEdit(false); }} disabled={saving} className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground disabled:opacity-50">لغو</button>
    </div>
  );
}
