"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  FiChevronDown,
  FiMap,
  FiHome,
  FiFileText,
  FiInfo,
  FiPhone,
  FiMenu,
  FiX,
} from "react-icons/fi";

import {
  MdTrain,
  MdFlight,
  MdDirectionsBus,
} from "react-icons/md";

type Props = {
  children?: React.ReactNode;
};

export default function NavbarClient({
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // =========================
  // CLOSE MOBILE MENU
  // =========================

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsTicketsOpen(false);
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
  // LINK CLICK
  // =========================

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsTicketsOpen(false);
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
            width={60}
            height={55}
            alt="SAFARKHOSH"
          />

          <span
            className="
              text-xl
              font-bold
              text-primary
            "
          >
            سفر خوش
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
              TICKETS DROPDOWN
          ========================= */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsTicketsOpen((prev) => !prev)
              }
              className="
                flex
                items-center
                gap-1.5
                transition-colors
                hover:text-primary
              "
              aria-expanded={isTicketsOpen}
            >
              بلیط‌ها

              <FiChevronDown
                className={`
                  h-4
                  w-4
                  transition-transform
                  duration-200
                  ${
                    isTicketsOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {isTicketsOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-3
                  w-56
                  overflow-hidden
                  rounded-xl
                  border
                  border-border
                  bg-background
                  p-2
                  shadow-lg
                "
              >
                {/* TRAIN */}

                <Link
                  href="/products/train"
                  onClick={() =>
                    setIsTicketsOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    transition-colors
                    hover:bg-muted
                    hover:text-primary
                  "
                >
                  <MdTrain className="h-5 w-5" />

                  <span>
                    بلیط قطار
                  </span>
                </Link>

                {/* FLIGHT */}

                <Link
                  href="/products/flight"
                  onClick={() =>
                    setIsTicketsOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    transition-colors
                    hover:bg-muted
                    hover:text-primary
                  "
                >
                  <MdFlight className="h-5 w-5" />

                  <span>
                    بلیط هواپیما
                  </span>
                </Link>

                {/* BUS */}

                <Link
                  href="/products/bus"
                  onClick={() =>
                    setIsTicketsOpen(false)
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    transition-colors
                    hover:bg-muted
                    hover:text-primary
                  "
                >
                  <MdDirectionsBus className="h-5 w-5" />

                  <span>
                    بلیط اتوبوس
                  </span>
                </Link>
              </div>
            )}
          </div>

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
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
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

            {/* =========================
                HOME
            ========================= */}

            <Link
              href="/"
              onClick={handleLinkClick}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-3
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              <FiHome className="h-5 w-5" />

              <span>
                خانه
              </span>
            </Link>

            {/* =========================
                TOUR
            ========================= */}

            <Link
              href="/products/tour"
              onClick={handleLinkClick}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-3
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              <FiMap className="h-5 w-5" />

              <span>
                تورها
              </span>
            </Link>

            {/* =========================
                MOBILE TICKETS
            ========================= */}

            <button
              type="button"
              onClick={() =>
                setIsTicketsOpen(
                  (prev) => !prev
                )
              }
              className="
                flex
                w-full
                items-center
                justify-between
                rounded-lg
                px-3
                py-3
                text-right
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
              aria-expanded={isTicketsOpen}
            >
              <span className="flex items-center gap-3">
                <FiFileText className="h-5 w-5" />

                <span>
                  بلیط‌ها
                </span>
              </span>

              <FiChevronDown
                className={`
                  h-5
                  w-5
                  transition-transform
                  duration-200
                  ${
                    isTicketsOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* =========================
                TICKETS SUB MENU
            ========================= */}

            {isTicketsOpen && (
              <div
                className="
                  mr-4
                  border-r
                  border-border
                  pr-3
                "
              >
                {/* TRAIN */}

                <Link
                  href="/products/train"
                  onClick={handleLinkClick}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    transition-colors
                    hover:bg-muted
                    hover:text-primary
                  "
                >
                 <MdTrain className="h-5 w-5" />

                  <span>
                    بلیط قطار
                  </span>
                </Link>

                {/* FLIGHT */}

                <Link
                  href="/products/flight"
                  onClick={handleLinkClick}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    transition-colors
                    hover:bg-muted
                    hover:text-primary
                  "
                >
                 <MdFlight className="h-5 w-5" />

                  <span>
                    بلیط هواپیما
                  </span>
                </Link>

                {/* BUS */}

                <Link
                  href="/products/bus"
                  onClick={handleLinkClick}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    transition-colors
                    hover:bg-muted
                    hover:text-primary
                  "
                >
                  <MdDirectionsBus className="h-5 w-5" />

                  <span>
                    بلیط اتوبوس
                  </span>
                </Link>
              </div>
            )}

            {/* =========================
                ACCOMMODATION
            ========================= */}

            <Link
              href="/products/accommodation"
              onClick={handleLinkClick}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-3
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              <FiHome className="h-5 w-5" />

              <span>
                اقامتگاه‌ها
              </span>
            </Link>

            {/* =========================
                VISA
            ========================= */}

            <Link
              href="/products/visa"
              onClick={handleLinkClick}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-3
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              <FiFileText className="h-5 w-5" />

              <span>
                ویزای توریستی
              </span>
            </Link>

            {/* =========================
                DIVIDER
            ========================= */}

            <div className="my-3 h-px bg-border" />

            {/* =========================
                ABOUT
            ========================= */}

            <Link
              href="/about"
              onClick={handleLinkClick}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-3
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              <FiInfo className="h-5 w-5" />

              <span>
                درباره ما
              </span>
            </Link>

            {/* =========================
                CONTACT
            ========================= */}

            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-3
                transition-colors
                hover:bg-muted
                hover:text-primary
              "
            >
              <FiPhone className="h-5 w-5" />

              <span>
                تماس با ما
              </span>
            </Link>

            {/* =========================
                ADMIN
            ========================= */}

            {children}
          </div>
        </div>
      )}
    </nav>
  );
}