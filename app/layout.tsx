// app/tours/layout.tsx

import type { Metadata } from "next";
import { Inter as InterFont } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/Button/ScrollToTopButton";
import ThemeToggle from "@/components/Button/ThemeToggle";
import TelegramButton from "@/components/Button/TelegramButton";

const Inter = InterFont({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "سفر خوش | آغاز یک سفر به‌یادماندنی",
    template: "%s | سفر خوش",
  },

  description:
    "سفر خوش؛ همراه شما برای کشف مقصدهای جذاب، تورهای ویژه و تجربه سفرهایی متفاوت و به‌یادماندنی.",

  icons: {
    icon: "/images/logo.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ToursLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
    >
      <body
        className={`
          ${Inter.variable}
          min-h-screen
          bg-background
          text-foreground
          antialiased
        `}
      >
        {/* =========================
            NAVBAR
        ========================= */}

        <Navbar />

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="min-h-screen bg-background">
          {children}
        </main>

        {/* =========================
            FIXED ACTIONS
        ========================= */}

        <TelegramButton />

        <ThemeToggle />

        <ScrollToTopButton />

        {/* =========================
            FOOTER
        ========================= */}

        <Footer />
      </body>
    </html>
  );
}