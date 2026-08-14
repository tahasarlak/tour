"use client";

import Link from "next/link";

type Props = {
  href: string;
  label: string;
};

export default function BackLink({
  href,
  label,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
      <Link
        href={href}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-border
          bg-card
          px-3
          py-2
          text-xs
          font-medium
          text-muted-foreground
          transition
          duration-200
          hover:border-primary
          hover:bg-accent
          hover:text-accent-foreground
          sm:text-sm
        "
      >
        <span>{label}</span>
      </Link>
    </div>
  );
}