"use client";

import { Send } from "lucide-react";

import Button from "../ui/Button";

export default function TelegramButton() {
  return (
    <a
      href="https://t.me/romdental"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="پیام به تلگرام"
      className="
        fixed
        bottom-8
        right-8
        z-50

        hover:scale-110
        active:scale-95

        transition-transform
      "
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        icon={
          <Send className="h-7 w-7" />
        }
        aria-label="پیام به تلگرام"
      />
    </a>
  );
}