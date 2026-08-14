"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "اطلاعات ورود صحیح نیست."
        );

        setLoading(false);
        return;
      }

      // بعد از ورود موفق
      router.push("/");
      router.refresh();
    } catch {
      setError(
        "ارتباط با سرور برقرار نشد."
      );

      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-background
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-border
          bg-card
          p-8
          text-card-foreground
          shadow-2xl
        "
      >
        {/* =========================================
            TITLE
        ========================================= */}

        <h1
          className="
            mb-2
            text-center
            text-3xl
            font-bold
            text-primary
          "
        >
          ورود ادمین
        </h1>

        <p
          className="
            mb-6
            text-center
            text-sm
            text-muted-foreground
          "
        >
          برای مدیریت تورها وارد حساب ادمین شوید.
        </p>

        {/* =========================================
            EMAIL
        ========================================= */}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-foreground
            "
          >
            ایمیل
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ایمیل خود را وارد کنید"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              placeholder:text-muted-foreground
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* =========================================
            PASSWORD
        ========================================= */}

        <div className="mb-4">
          <label
            htmlFor="password"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-foreground
            "
          >
            رمز عبور
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="رمز عبور خود را وارد کنید"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !loading
              ) {
                login();
              }
            }}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-border
              bg-background
              p-3
              text-foreground
              outline-none
              placeholder:text-muted-foreground
              transition
              focus:border-primary
              focus:ring-2
              focus:ring-primary
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          />
        </div>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div
            role="alert"
            className="
              mb-4
              rounded-xl
              border
              border-destructive/30
              bg-destructive/10
              p-3
              text-sm
              font-medium
              text-destructive
            "
          >
            {error}
          </div>
        )}

        {/* =========================================
            LOGIN BUTTON
        ========================================= */}

        <button
          type="button"
          onClick={login}
          disabled={
            loading ||
            !email.trim() ||
            !password
          }
          className="
            flex
            min-h-[48px]
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            p-3
            font-bold
            text-primary-foreground
            transition-all
            hover:opacity-90
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? "در حال ورود..."
            : "ورود به پنل"}
        </button>
      </div>
    </div>
  );
}