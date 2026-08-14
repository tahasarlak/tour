"use client";

import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field: string;
  value: string;
  children: React.ReactNode;
  type?: string;
  variant?:
    | "value"
    | "text"
    | "tags"
    | "check"
    | "dot";
};

export default function EditableField({
  id,
  field,
  value,
  children,
  type = "product",
  variant = "value",
}: Props) {
  const [edit, setEdit] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    setNewValue(value);
  }, [value, edit]);

  const isTextarea =
    variant === "text" ||
    variant === "tags" ||
    variant === "check" ||
    variant === "dot";

  const isNumberField = [
    "price",
    "discountedPrice",
    "discountPercentage",
  ].includes(field);

  const save = async () => {
    if (!isAdmin || saving) return;

    let parsedValue:
      | string
      | number
      | string[] = newValue;

    if (
      ["tags", "check", "dot"].includes(variant)
    ) {
      parsedValue = newValue
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (isNumberField) {
      parsedValue = Number(newValue) || 0;
    }

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

      const data = await res.json();

      if (res.ok && data.success) {
        setEdit(false);

        if (isNumberField) {
          window.location.reload();
        }
      } else {
        console.error("Update failed:", data);

        alert(
          data.error ||
            data.message ||
            "خطا در ذخیره اطلاعات"
        );
      }
    } catch (error) {
      console.error("Update error:", error);

      alert("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setNewValue(value);
    setEdit(false);
  };

  return (
    <div className="relative w-full min-w-0">
      {edit ? (
        <div className="w-full">
          {isTextarea ? (
            <textarea
              value={newValue}
              onChange={(e) =>
                setNewValue(e.target.value)
              }
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  cancel();
                }
              }}
              autoFocus
              disabled={saving}
              className="
                min-h-[120px]
                w-full
                resize-y
                rounded-xl
                border
                border-primary/70
                bg-background
                px-4
                py-3
                text-sm
                leading-7
                text-foreground
                outline-none
                transition
                placeholder:text-muted-foreground
                focus:border-primary
                focus:ring-2
                focus:ring-primary/20
                disabled:opacity-70
                sm:min-h-[140px]
              "
            />
          ) : (
            <input
              value={newValue}
              onChange={(e) =>
                setNewValue(e.target.value)
              }
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  cancel();
                }

                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              autoFocus
              disabled={saving}
              type={
                isNumberField
                  ? "number"
                  : "text"
              }
              min={
                isNumberField
                  ? 0
                  : undefined
              }
              max={
                field ===
                "discountPercentage"
                  ? 100
                  : undefined
              }
              className="
                w-full
                rounded-xl
                border
                border-primary/70
                bg-background
                px-4
                py-3
                text-sm
                text-foreground
                outline-none
                transition
                placeholder:text-muted-foreground
                focus:border-primary
                focus:ring-2
                focus:ring-primary/20
                disabled:opacity-70
              "
            />
          )}

          {saving && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-2
                text-xs
                text-primary
              "
            >
              <span
                className="
                  h-3
                  w-3
                  animate-spin
                  rounded-full
                  border-2
                  border-primary
                  border-t-transparent
                "
              />

              <span>در حال ذخیره...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative min-w-0">
          <div className="min-w-0">
            {children}
          </div>

          {isAdmin && (
            <div
              className="
                absolute
                right-0
                top-0
                z-20
              "
            >
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