"use client";

import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field: string;
  value: boolean;
  children: React.ReactNode;
  type?: "tour";
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

  // =========================
  // CHECK ADMIN
  // =========================

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

  // =========================
  // SYNC
  // =========================

  useEffect(() => {
    setNewValue(value);
  }, [value, edit]);

  // =========================
  // SAVE
  // =========================

  const save = async () => {
    if (!isAdmin || saving) return;

    try {
      setSaving(true);

      const res = await fetch("/api/product/update", {
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
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEdit(false);
        return;
      }

      console.error(
        "Tour boolean update failed:",
        data
      );

      alert(
        data.error ||
          data.message ||
          "خطا در ذخیره اطلاعات"
      );
    } catch (error) {
      console.error(
        "Tour boolean update error:",
        error
      );

      alert("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CANCEL
  // =========================

  const cancel = () => {
    setNewValue(value);
    setEdit(false);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="relative">
      {edit ? (
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            rounded-xl
            border
            border-border
            bg-card
            p-2
            text-card-foreground
          "
        >
          {/* =========================
              TOGGLE
          ========================= */}

          <label
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              px-2
              py-1.5
              text-xs
              text-foreground
            "
          >
            <input
              type="checkbox"
              checked={newValue}
              onChange={(e) =>
                setNewValue(
                  e.target.checked
                )
              }
              disabled={saving}
              className="
                h-4
                w-4
                cursor-pointer
                accent-[hsl(var(--primary))]
              "
            />

            <span>
              {newValue
                ? "فعال"
                : "غیرفعال"}
            </span>
          </label>

          {/* =========================
              SAVE
          ========================= */}

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="
              rounded-lg
              bg-primary
              px-3
              py-1.5
              text-xs
              font-bold
              text-primary-foreground
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving
              ? "ذخیره..."
              : "ذخیره"}
          </button>

          {/* =========================
              CANCEL
          ========================= */}

          <button
            type="button"
            onClick={cancel}
            disabled={saving}
            className="
              rounded-lg
              border
              border-border
              bg-secondary
              px-3
              py-1.5
              text-xs
              text-secondary-foreground
              transition
              hover:bg-accent
              hover:text-accent-foreground
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            لغو
          </button>
        </div>
      ) : (
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {/* =========================
              CURRENT VALUE
          ========================= */}

          <div className="min-w-0">
            {children}
          </div>

          {/* =========================
              EDIT
          ========================= */}

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