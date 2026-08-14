"use client";

import Link from "next/link";
import LogoutButton from "@/components/Button/LogoutButton";

export default function AdminPage() {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        bg-background
        p-6
        text-foreground
        sm:p-10
      "
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* =========================================
            HEADER
        ========================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-3xl
                font-bold
                text-primary
              "
            >
              پنل مدیریت
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-muted-foreground
              "
            >
              مدیریت تورها و محتوای سایت
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* =========================================
            LOGIN STATUS
        ========================================= */}

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            text-card-foreground
            shadow-sm
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div>
              <p className="font-semibold">
                وضعیت حساب
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                شما با حساب ادمین وارد شده‌اید.
              </p>
            </div>

            <span
              className="
                rounded-full
                border
                border-primary/20
                bg-primary/10
                px-3
                py-1.5
                text-xs
                font-bold
                text-primary
              "
            >
              وارد شده
            </span>
          </div>
        </div>


      </div>
    </div>
  );
}