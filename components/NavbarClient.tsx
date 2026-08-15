"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  children?: React.ReactNode;
};

export default function NavbarClient({
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // =========================
  // CLOSE MENU OUTSIDE CLICK
  // =========================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isOpen]);

  // =========================
  // CLOSE AFTER LINK CLICK
  // =========================

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className="
        border-b
        border-border
        bg-background
        text-foreground
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-4
          py-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={handleLinkClick}
        >
          <Image
            src="/images/logo.png"
            width={45}
            height={45}
            alt="ROMDENTAL"
          />

          <span
            className="
              text-xl
              font-bold
              text-primary
            "
          >
            ROMDENTAL
          </span>
        </Link>

        {/* =========================
            DESKTOP MENU
        ========================= */}

        <div
          className="
            hidden
            items-center
            gap-6
            text-sm
            font-medium
            text-foreground
            md:flex
          "
        >
          {/* =========================
              PACKAGE
          ========================= */}

          <Link
            href="/products/package"
            className="
              transition-colors
              hover:text-primary
            "
          >
            پکیج‌ها
          </Link>

          {/* =========================
              TOUR
          ========================= */}

          <Link
            href="/products/tour"
            className="
              transition-colors
              hover:text-primary
            "
          >
            تورها
          </Link>

          {/* =========================
              TRAIN
          ========================= */}

          <Link
            href="/products/train"
            className="
              transition-colors
              hover:text-primary
            "
          >
            بلیط قطار
          </Link>

          {/* =========================
              FLIGHT
          ========================= */}

          <Link
            href="/products/flight"
            className="
              transition-colors
              hover:text-primary
            "
          >
            بلیط هواپیما
          </Link>

          {/* =========================
              ACCOMMODATION
          ========================= */}

          <Link
            href="/products/accommodation"
            className="
              transition-colors
              hover:text-primary
            "
          >
            اقامتگاه
          </Link>

          {/* =========================
              VISA
          ========================= */}

          <Link
            href="/products/visa"
            className="
              transition-colors
              hover:text-primary
            "
          >
            ویزای توریستی
          </Link>

          {/* =========================
              ABOUT
          ========================= */}

          <Link
            href="/about"
            className="
              transition-colors
              hover:text-primary
            "
          >
            درباره ما
          </Link>

          {/* =========================
              CONTACT
          ========================= */}

          <Link
            href="/contact"
            className="
              transition-colors
              hover:text-primary
            "
          >
            تماس با ما
          </Link>

          {/* =========================
              ADMIN
          ========================= */}

          {children}
        </div>

        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          type="button"
          className="
            rounded-lg
            p-2
            text-2xl
            leading-none
            text-foreground
            transition-colors
            hover:bg-muted
            hover:text-primary
            md:hidden
          "
          onClick={() =>
            setIsOpen((prev) => !prev)
          }
          aria-label={
            isOpen
              ? "بستن منو"
              : "باز کردن منو"
          }
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <span aria-hidden="true">
              ×
            </span>
          ) : (
            <span aria-hidden="true">
              ☰
            </span>
          )}
        </button>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {isOpen && (
        <div
          ref={menuRef}
          className="
            border-t
            border-border
            bg-background
            px-4
            pb-6
            pt-4
            text-foreground
            md:hidden
          "
        >
          <div className="space-y-1">
            {/* HOME */}

            <Link
              href="/"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              خانه
            </Link>

            {/* PACKAGE */}

            <Link
              href="/products/package"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              پکیج‌ها
            </Link>

            {/* TOUR */}

            <Link
              href="/products/tour"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              تورها
            </Link>

            {/* TRAIN */}

            <Link
              href="/products/train"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              بلیط قطار
            </Link>

            {/* FLIGHT */}

            <Link
              href="/products/flight"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              بلیط هواپیما
            </Link>

            {/* ACCOMMODATION */}

            <Link
              href="/products/accommodation"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              اقامتگاه‌ها
            </Link>

            {/* VISA */}

            <Link
              href="/products/visa"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              ویزای توریستی
            </Link>

            {/* DIVIDER */}

            <div className="my-3 h-px bg-border" />

            {/* ABOUT */}

            <Link
              href="/about"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              درباره ما
            </Link>

            {/* CONTACT */}

            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="
                block
                rounded-lg
                px-3
                py-2.5
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              تماس با ما
            </Link>

            {/* ADMIN */}

            {children}
          </div>
        </div>
      )}
    </nav>
  );
}