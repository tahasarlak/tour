"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import EditButton from "../Button/EditButton";

type Props = {
  id: number;
  field?: "image";
  src: string;
  type?: string;
};

export default function EditableSingleImage({
  id,
  field = "image",
  src,
  type = "product",
}: Props) {
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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

  const save = async () => {
    if (!isAdmin || !file || saving) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("id", id.toString());
      formData.append("type", type);
      formData.append("field", field);
      formData.append("image", file);

      if (src) {
        formData.append("oldUrl", src);
      }

      const res = await fetch("/api/product/update", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("عکس با موفقیت ذخیره شد!");

        setEdit(false);
        setFile(null);

        window.location.reload();
      } else {
        alert(
          `خطا: ${
            result.error ||
            result.message ||
            "خطای نامشخص"
          }`
        );
      }
    } catch {
      alert("خطا در آپلود عکس");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setFile(null);
    setEdit(false);
  };

  return (
    <div
      className="
        group
        relative
        h-full
        w-full
        overflow-hidden
        rounded-xl
        bg-background
      "
    >
      <Image
        src={src || "/images/default-product.jpg"}
        alt="Product image"
        fill
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
        className="
          object-contain
          p-2
          transition-none
        "
      />

      {isAdmin && (
        <div
          className="
            absolute
            bottom-3
            right-3
            z-20
            opacity-0
            transition-opacity
            duration-200
            group-hover:opacity-100
            max-sm:opacity-100
          "
        >
          {edit ? (
            <div
              className="
                flex
                flex-wrap
                items-center
                justify-end
                gap-2
                rounded-xl
                border
                border-border
                bg-card/95
                p-2
                text-card-foreground
                shadow-xl
                backdrop-blur
              "
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile =
                    e.target.files?.[0];

                  if (selectedFile) {
                    setFile(selectedFile);
                  }
                }}
                className="hidden"
                id={`file-${id}`}
              />

              <label
                htmlFor={`file-${id}`}
                className="
                  cursor-pointer
                  rounded-lg
                  border
                  border-border
                  bg-secondary
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-secondary-foreground
                  transition
                  hover:bg-accent
                  hover:text-accent-foreground
                "
              >
                {file
                  ? "📷 عکس انتخاب شد"
                  : "انتخاب عکس"}
              </label>

              <button
                type="button"
                onClick={save}
                disabled={!file || saving}
                className="
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
                "
              >
                {saving
                  ? "در حال ذخیره..."
                  : "ذخیره"}
              </button>

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
                  py-2
                  text-xs
                  text-secondary-foreground
                  transition
                  hover:bg-accent
                  hover:text-accent-foreground
                  disabled:opacity-50
                "
              >
                لغو
              </button>
            </div>
          ) : (
            <EditButton
              onClick={() => {
                setFile(null);
                setEdit(true);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}