// components/ui/FAB.tsx
"use client";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FABProps {
  onClick: () => void;
  className?: string;
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl bg-accent hover:bg-accent-light",
        "shadow-lg shadow-accent/30 flex items-center justify-center",
        "transition-all duration-200 active:scale-90 hover:scale-105",
        "animate-fadeIn",
        className
      )}
    >
      <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
    </button>
  );
}
