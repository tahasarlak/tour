"use client";

import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field: string;
  value: boolean;
  children: React.ReactNode;
  type?: string;
};

export default function EditableSingleBoolean({
  id,
  field,
  value,
  children,
  type = "tour",
}: Props) {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

  // CHECK ADMIN

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/check", {
          cache: "no-store",
        });

        if (!res.ok) {
          if (active) setIsAdmin(false);
          return;
        }

        const data = await res.json();

        if (active) {
          setIsAdmin(data.isAdmin === true);
        }
      } catch (error) {
        console.error(
          "[BOOLEAN] Admin check failed:",
          error
        );

        if (active) setIsAdmin(false);
      }
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, []);

  // SYNC

  useEffect(() => {
    setNewValue(value);
  }, [value, edit]);

  // SAVE

  async function save() {
    if (!isAdmin || saving) return;

    try {
      setSaving(true);

      console.log("[BOOLEAN] Saving", {
        id,
        type,
        field,
        value: newValue,
      });

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
            field,
            value: newValue,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("[BOOLEAN] Saved successfully");

        setEdit(false);
        window.location.reload();
        return;
      }

      console.error(
        "[BOOLEAN] Update failed:",
        data
      );

      alert(
        data.error ||
          data.message ||
          "خطا در ذخیره اطلاعات"
      );

    } catch (error) {
      console.error(
        "[BOOLEAN] Save error:",
        error
      );

      alert("خطا در ذخیره اطلاعات");

    } finally {
      setSaving(false);
    }
  }

  // CANCEL

  function cancel() {
    setNewValue(value);
    setEdit(false);
  }

  // RENDER

  return (
    <div className="relative">

      {edit ? (

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2 text-card-foreground">

          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground">

            <input
              type="checkbox"
              checked={newValue}
              onChange={(e) =>
                setNewValue(e.target.checked)
              }
              disabled={saving}
              className="h-4 w-4 cursor-pointer accent-[hsl(var(--primary))]"
            />

            <span>
              {newValue ? "فعال" : "غیرفعال"}
            </span>

          </label>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "ذخیره..." : "ذخیره"}
          </button>

          <button
            type="button"
            onClick={cancel}
            disabled={saving}
            className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition hover:bg-accent disabled:opacity-50"
          >
            لغو
          </button>

        </div>

      ) : (

        <div className="flex items-center gap-2">

          <div className="min-w-0">
            {children}
          </div>

          {isAdmin && (
            <div className="shrink-0">
              <EditButton
                onClick={() => {
                  setNewValue(value);
                  setEdit(true);
                }}
              />
            </div>
          )}

        </div>

      )}

    </div>
  );
}
