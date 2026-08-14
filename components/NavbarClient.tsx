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
  const [isOpen, setIsOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // CLOSE MENU OUTSIDE CLICK
  // =========================

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
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
          max-w-6xl
          items-center
          justify-between
          px-4
          py-4
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
            gap-7
            text-sm
            font-medium
            text-foreground
            md:flex
          "
        >
   
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
              TOURS
          ========================= */}

          <Link
            href="/products/tours"
            className="
              font-semibold
              transition-colors
              hover:text-primary
            "
          >
            تورها
          </Link>

          <Link
            href="/about"
            className="
              transition-colors
              hover:text-primary
            "
          >
            درباره ما
          </Link>

          <Link
            href="/contact"
            className="
              transition-colors
              hover:text-primary
            "
          >
            تماس با ما
          </Link>

          {/* ADMIN */}

          {children}
        </div>

        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          type="button"
          className="
            text-2xl
            leading-none
            text-foreground
            transition-colors
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
            space-y-3
            border-t
            border-border
            bg-background
            px-4
            pb-5
            pt-4
            text-foreground
            md:hidden
          "
        >
          <Link
            href="/"
            onClick={handleLinkClick}
            className="
              block
              transition-colors
              hover:text-primary
            "
          >
            خانه
          </Link>

       

     
          {/* =========================
              TOURS
          ========================= */}

          <Link
            href="/products/tours"
            onClick={handleLinkClick}
            className="
              block
              font-semibold
              transition-colors
              hover:text-primary
            "
          >
            تورها
          </Link>

          <Link
            href="/about"
            onClick={handleLinkClick}
            className="
              block
              transition-colors
              hover:text-primary
            "
          >
            درباره ما
          </Link>

          <Link
            href="/contact"
            onClick={handleLinkClick}
            className="
              block
              transition-colors
              hover:text-primary
            "
          >
            تماس با ما
          </Link>

          {/* ADMIN */}

          {children}
        </div>
      )}
    </nav>
  );
}