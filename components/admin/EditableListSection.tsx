"use client";

import { useEffect, useState } from "react";
import EditableField from "./EditableField";

type Props = {
  id: number;
  field: string;
  title: string;
  items?: string[];
  editableValue: string;
  type?: string;
  variant?:
    | "value"
    | "text"
    | "tags"
    | "check"
    | "dot";
};

export default function EditableListSection({
  id,
  field,
  title,
  items = [],
  editableValue,
  type = "product",
  variant = "dot",
}: Props) {
  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch(
          "/api/auth/check"
        );

        if (!res.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await res.json();

        setIsAdmin(
          data.isAdmin === true
        );
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  const isEmpty =
    editableValue.trim() === "";

  if (isEmpty && !isAdmin) {
    return null;
  }

  return (
    <section
      className="
        relative
        w-full
        rounded-xl
        border
        border-border
        bg-card
        p-4
        text-card-foreground
        sm:p-5
      "
    >
      {title && (
        <div className="mb-3">
          <h3
            className="
              text-sm
              font-bold
              text-muted-foreground
              sm:text-base
            "
          >
            {title}
          </h3>

          <div
            className="
              mt-2
              h-px
              w-8
              bg-primary
            "
          />
        </div>
      )}

      {/* VALUE */}

      {variant === "value" && (
        <EditableField
          id={id}
          field={field}
          value={editableValue}
          type={type}
          variant="value"
        >
          <p
            className="
              text-lg
              font-bold
              leading-7
              text-primary
              sm:text-xl
            "
          >
            {editableValue || "—"}
          </p>
        </EditableField>
      )}

      {/* TEXT */}

      {variant === "text" && (
        <EditableField
          id={id}
          field={field}
          value={editableValue}
          type={type}
          variant="text"
        >
          <p
            className="
              whitespace-pre-line
              text-sm
              leading-7
              text-foreground
              sm:text-base
              sm:leading-8
            "
          >
            {editableValue || "—"}
          </p>
        </EditableField>
      )}

      {/* TAGS */}

      {variant === "tags" && (
        <EditableField
          id={id}
          field={field}
          value={editableValue}
          type={type}
          variant="tags"
        >
          <div className="flex flex-wrap gap-2">
            {items.length > 0 ? (
              items.map((item, index) => (
                <span
                  key={index}
                  className="
                    rounded-lg
                    border
                    border-border
                    bg-secondary
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-secondary-foreground
                    transition
                    hover:bg-accent
                    hover:text-accent-foreground
                    sm:text-sm
                  "
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                —
              </span>
            )}
          </div>
        </EditableField>
      )}

      {/* CHECK */}

      {variant === "check" && (
        <EditableField
          id={id}
          field={field}
          value={editableValue}
          type={type}
          variant="check"
        >
          <ul className="space-y-2.5">
            {items.length > 0 ? (
              items.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex
                    items-start
                    gap-2.5
                    text-sm
                    leading-6
                    text-foreground
                    sm:text-base
                  "
                >
                  <span
                    className="
                      mt-0.5
                      flex
                      h-5
                      w-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-primary/10
                      text-xs
                      font-bold
                      text-primary
                    "
                  >
                    ✓
                  </span>

                  <span className="min-w-0">
                    {item}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">
                —
              </li>
            )}
          </ul>
        </EditableField>
      )}

      {/* DOT */}

      {variant === "dot" && (
        <EditableField
          id={id}
          field={field}
          value={editableValue}
          type={type}
          variant="dot"
        >
          <ul className="space-y-2">
            {items.length > 0 ? (
              items.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex
                    items-start
                    gap-2.5
                    text-sm
                    leading-6
                    text-foreground
                    sm:text-base
                  "
                >
                  <span
                    className="
                      mt-2
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-primary
                    "
                  />

                  <span className="min-w-0">
                    {item}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">
                —
              </li>
            )}
          </ul>
        </EditableField>
      )}
    </section>
  );
}