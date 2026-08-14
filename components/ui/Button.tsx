"use client";

import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cva } from "class-variance-authority";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost"
  | "outline"
  | "telegram";

type Props =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: "sm" | "md" | "lg" | "icon";
    loading?: boolean;
    icon?: ReactNode;
  };

const buttonVariants = cva(
  `
    inline-flex
    items-center
    justify-center
    gap-2
    font-bold
    transition-all
    duration-200

    hover:scale-[1.02]
    active:scale-[0.98]

    disabled:pointer-events-none
    disabled:opacity-50

    focus:outline-none
    focus:ring-2
    focus:ring-ring/40
  `,
  {
    variants: {
      variant: {
        /* دکمه اصلی */
        primary:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90",

        /* دکمه فرعی */
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:text-accent-foreground",

        /* دکمه خطر / خروج */
        danger:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:opacity-90",

        /* دکمه شفاف */
        ghost:
          "bg-transparent text-primary hover:bg-primary/10 hover:text-primary",

        /* دکمه Outline */
        outline:
          "border border-primary/50 bg-transparent text-primary hover:bg-primary/10",

        /* تلگرام */
        telegram:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90",
      },

      size: {
        sm:
          "rounded-lg px-3 py-2 text-sm",

        md:
          "rounded-xl px-5 py-3 text-base",

        lg:
          "rounded-2xl px-8 py-4 text-lg",

        icon:
          "h-10 w-10 rounded-xl p-2",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${buttonVariants({
          variant,
          size,
        })}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-current
              border-t-transparent
            "
          />

          <span>
            در حال پردازش...
          </span>
        </span>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}