"use client";

import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field: string;
  value: string;
  children: React.ReactNode;
  type?: "tour";
};

export default function EditableTextarea({
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

  // ==========================================
  // CHECK ADMIN
  // ==========================================

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

  // ==========================================
  // SYNC VALUE
  // ==========================================

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // ==========================================
  // SAVE
  // ==========================================

  const save = async () => {
    if (!isAdmin || saving) return;

    let parsedValue: string | string[] | unknown =
      newValue;

    // ========================================
    // ARRAY FIELDS
    // ========================================

    if (
      [
        "languages",
        "highlights",
        "features",
        "includes",
        "excludes",
        "itinerary",
        "requirements",
        "relatedTours",
      ].includes(field)
    ) {
      parsedValue = newValue
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // ========================================
    // JSON FIELDS
    // ========================================

    else if (
      [
        "gallery",
        "additionalResources",
        "sampleNotesLinks",
      ].includes(field)
    ) {
      try {
        parsedValue = JSON.parse(newValue);
      } catch {
        alert("❌ JSON وارد شده معتبر نیست.");
        return;
      }
    }

    // ========================================
    // NORMAL FIELD
    // ========================================

    else {
      parsedValue = newValue;
    }

    // ========================================
    // REQUEST
    // ========================================

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
          value: parsedValue,
        }),
      });

      const result = await res.json();

      // ======================================
      // ERROR
      // ======================================

      if (!res.ok) {
        alert(
          `❌ خطا: ${
            result.error ||
            result.message ||
            "خطای نامشخص"
          }`
        );

        return;
      }

      // ======================================
      // SUCCESS
      // ======================================

      if (result.success) {
        setEdit(false);
      }
    } catch (error) {
      console.error("Update error:", error);

      alert("❌ خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const cancel = () => {
    setNewValue(value);
    setEdit(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div>
      {edit ? (
        <div className="space-y-3">
          <textarea
            value={newValue}
            onChange={(e) => {
              setNewValue(e.target.value);
            }}
            onBlur={() => {
              // JSON فقط با دکمه ذخیره شود
              if (
                ![
                  "gallery",
                  "additionalResources",
                  "sampleNotesLinks",
                ].includes(field)
              ) {
                save();
              }
            }}
            autoFocus
            disabled={saving}
            className="
              w-full
              min-h-[150px]
              rounded-xl
              border
              border-primary
              bg-card
              p-3
              text-foreground
              outline-none
              transition
              focus:ring-2
              focus:ring-primary/30
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          />

          <div className="flex gap-2">
            {/* SAVE */}

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="
                rounded-xl
                bg-primary
                px-4
                py-2
                font-bold
                text-primary-foreground
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving
                ? "در حال ذخیره..."
                : "ذخیره"}
            </button>

            {/* CANCEL */}

            <button
              type="button"
              onClick={cancel}
              disabled={saving}
              className="
                rounded-xl
                border
                border-border
                bg-secondary
                px-4
                py-2
                text-foreground
                transition
                hover:bg-accent
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              لغو
            </button>
          </div>
        </div>
      ) : (
        children
      )}

      {/* ======================================
          EDIT BUTTON
      ====================================== */}

      {isAdmin && !edit && (
        <EditButton
          onClick={() => {
            setNewValue(value);
            setEdit(true);
          }}
        />
      )}
    </div>
  );
}