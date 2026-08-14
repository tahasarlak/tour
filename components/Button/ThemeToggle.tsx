"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../ui/Button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    const shouldBeDark =
      savedTheme === "dark";

    const html =
      document.documentElement;

    if (shouldBeDark) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }

    setIsDark(shouldBeDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const html =
      document.documentElement;

    const nextIsDark =
      !html.classList.contains("dark");

    if (nextIsDark) {
      html.classList.add("dark");
      html.classList.remove("light");

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      html.classList.remove("dark");
      html.classList.add("light");

      localStorage.setItem(
        "theme",
        "light"
      );
    }

    setIsDark(nextIsDark);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      icon={
        isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )
      }
      aria-label={
        isDark
          ? "فعال کردن حالت روشن"
          : "فعال کردن حالت تاریک"
      }
      title={
        isDark
          ? "حالت روشن"
          : "حالت تاریک"
      }
      className="
        fixed
        bottom-8
        left-8
        z-50

        border
        border-border

        bg-card
        text-card-foreground

        shadow-lg
        shadow-black/10

        hover:bg-accent
        hover:text-accent-foreground

        hover:scale-110
        active:scale-95

        transition-all

        focus:outline-none
        focus:ring-2
        focus:ring-primary
        focus:ring-offset-2
        focus:ring-offset-background
      "
    />
  );
}