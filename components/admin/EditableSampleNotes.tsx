"use client";

import { useEffect, useState } from "react";
import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  oldUrl: string | { url: string } | null;
  children: React.ReactNode;
};

export default function EditableTourFile({
  id,
  oldUrl,
  children,
}: Props) {
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
  // SAVE
  // ==========================================

  const save = async () => {
    if (!isAdmin || !file || saving) {
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("id", id.toString());

      // فقط Tour
      formData.append("type", "tour");

      // نام فیلد در دیتابیس
      formData.append("field", "tourFile");

      formData.append("file", file);

      // فایل قبلی
      if (oldUrl) {
        const oldUrlStr =
          typeof oldUrl === "string"
            ? oldUrl
            : oldUrl.url;

        if (oldUrlStr) {
          formData.append("oldUrl", oldUrlStr);
        }
      }

      const res = await fetch(
        "/api/tour/update",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(
          `خطا: ${
            result.error ||
            result.message ||
            "خطای نامشخص"
          }`
        );

        return;
      }

      alert("فایل تور با موفقیت ذخیره شد!");

      setEdit(false);
      setFile(null);

      window.location.reload();
    } catch (error) {
      console.error(
        "TOUR FILE UPDATE ERROR:",
        error
      );

      alert("خطا در آپلود فایل تور");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const cancel = () => {
    setFile(null);
    setEdit(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="relative">
      {/* ========================================
          CURRENT CONTENT
      ======================================== */}

      <div className="min-w-0">
        {children}
      </div>

      {/* ========================================
          EDIT MODE
      ======================================== */}

      {edit ? (
        <div
          className="
            mt-3
            rounded-xl
            border
            border-border
            bg-card
            p-3
            text-card-foreground
          "
        >
          {/* FILE INPUT */}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const selected =
                e.target.files?.[0] ?? null;

              setFile(selected);
            }}
            className="hidden"
            id={`tour-file-${id}`}
          />

          {/* SELECT FILE */}

          <label
            htmlFor={`tour-file-${id}`}
            className="
              flex
              min-h-[44px]
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              border
              border-border
              bg-secondary
              px-3
              py-2
              text-center
              text-xs
              font-medium
              text-secondary-foreground
              transition
              hover:bg-accent
              hover:text-accent-foreground
              sm:text-sm
            "
          >
            {file
              ? `📄 ${file.name}`
              : "انتخاب فایل جدید تور"}
          </label>

          {/* BUTTONS */}

          <div
            className="
              mt-2
              grid
              grid-cols-2
              gap-2
            "
          >
            {/* SAVE */}

            <button
              type="button"
              onClick={save}
              disabled={!file || saving}
              className="
                min-h-[40px]
                rounded-lg
                bg-primary
                px-3
                py-2
                text-xs
                font-bold
                text-primary-foreground
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:text-sm
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
                min-h-[40px]
                rounded-lg
                border
                border-border
                bg-secondary
                px-3
                py-2
                text-xs
                text-secondary-foreground
                transition
                hover:bg-accent
                hover:text-accent-foreground
                disabled:opacity-50
                sm:text-sm
              "
            >
              لغو
            </button>
          </div>
        </div>
      ) : (
        /* ========================================
           EDIT BUTTON
        ======================================== */

        isAdmin && (
          <div className="mt-2">
            <EditButton
              onClick={() => {
                setFile(null);
                setEdit(true);
              }}
            />
          </div>
        )
      )}
    </div>
  );
}