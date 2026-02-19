// components/habits/HabitForm.tsx
"use client";
import { useState } from "react";
import type { HabitCategory } from "@/types";
import { cn } from "@/lib/utils";

interface HabitFormProps {
  onSubmit: (data: { name: string; category: HabitCategory; icon: string; targetDays: number }) => void;
  onCancel: () => void;
}

const CATEGORIES: { value: HabitCategory; label: string; emoji: string; color: string }[] = [
  { value: "health", label: "Health", emoji: "💪", color: "border-success text-success bg-success/10" },
  { value: "deepwork", label: "Deep Work", emoji: "🧠", color: "border-accent text-accent bg-accent/10" },
  { value: "learning", label: "Learning", emoji: "📚", color: "border-warning text-warning bg-warning/10" },
  { value: "spiritual", label: "Spiritual", emoji: "🧘", color: "border-purple-400 text-purple-400 bg-purple-400/10" },
];

const ICONS = ["💪", "🏃", "🧠", "📚", "💧", "🧘", "☀️", "🌙", "✍️", "🎵", "🥗", "⚡", "🏋️", "🎯", "🛌", "📖"];

export function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<HabitCategory>("health");
  const [icon, setIcon] = useState("⚡");
  const [targetDays, setTargetDays] = useState(7);

  const handle = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), category, icon, targetDays });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-text-muted">Icon</span>
          <div className="relative">
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-16 h-12 bg-bg-elevated border border-bg-border rounded-xl text-2xl text-center appearance-none cursor-pointer outline-none focus:border-accent"
            >
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-xs text-text-muted">Habit name</span>
          <input
            autoFocus
            type="text"
            placeholder="e.g. Morning run"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
            className="h-12 bg-bg-elevated border border-bg-border rounded-xl px-3 text-text placeholder:text-text-dim outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div>
        <span className="text-xs text-text-muted block mb-2">Category</span>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                category === c.value ? c.color : "border-bg-border text-text-muted hover:border-bg-border/80"
              )}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted">Target days/week</span>
          <span className="text-xs font-bold text-accent">{targetDays}x / week</span>
        </div>
        <input
          type="range"
          min={1}
          max={7}
          value={targetDays}
          onChange={(e) => setTargetDays(+e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 btn-ghost border border-bg-border py-2.5">Cancel</button>
        <button onClick={handle} disabled={!name.trim()} className="flex-1 btn-primary py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">
          Add Habit
        </button>
      </div>
    </div>
  );
}
