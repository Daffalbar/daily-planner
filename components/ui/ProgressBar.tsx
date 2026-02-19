// components/ui/ProgressBar.tsx
"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  colorClass?: string;
  height?: string;
  animated?: boolean;
}

export function ProgressBar({ value, className, colorClass = "bg-accent", height = "h-1.5", animated = true }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-bg-border rounded-full overflow-hidden", height, className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", colorClass)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
