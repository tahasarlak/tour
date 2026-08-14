"use client";

import { MoveUp } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../ui/Button";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");

    if (!footer) return;

    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(footer);

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        bottom-8
        left-1/2
        -translate-x-1/2
        z-50
        transition-all
        duration-500
        ${
          footerVisible
            ? "opacity-0 scale-75 pointer-events-none"
            : "opacity-100 scale-100"
        }
      `}
    >
      <Button
        type="button"
        size="icon"
        variant="primary"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        icon={
          <MoveUp className="h-6 w-6" />
        }
        aria-label="بازگشت به بالا"
        className="
          shadow-xl
          shadow-primary/30
          hover:scale-110
          active:scale-95
          transition-transform
        "
      />
    </div>
  );
}