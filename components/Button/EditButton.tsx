"use client";

import Button from "@/components/ui/Button";

export default function EditButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      title="ویرایش"
      aria-label="ویرایش"
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-lg
        border
        border-border
        bg-card/90
        p-0
        text-sm
        text-primary
        shadow-lg
        backdrop-blur-sm
        transition-all
        duration-200
        hover:border-primary/60
        hover:bg-primary/10
        hover:text-primary
      "
    >
      ✏️
    </Button>
  );
}