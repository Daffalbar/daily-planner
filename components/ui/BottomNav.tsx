// components/ui/BottomNav.tsx
"use client";
import { CheckSquare, Layers, Zap, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "today" | "habits" | "energy" | "stats";

const TABS: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "today", label: "Today", Icon: CheckSquare },
  { id: "habits", label: "Habits", Icon: Layers },
  { id: "energy", label: "Energy", Icon: Zap },
  { id: "stats", label: "Stats", Icon: BarChart2 },
];

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-bg-border safe-area-pb">
      <div className="flex items-center max-w-2xl mx-auto px-2">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 px-2 transition-all duration-200",
              active === id ? "text-accent" : "text-text-dim hover:text-text-muted"
            )}
          >
            <Icon className={cn("w-5 h-5 transition-transform duration-200", active === id && "scale-110")} />
            <span className={cn("text-[10px] font-medium", active === id && "text-accent-light")}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { Tab };
