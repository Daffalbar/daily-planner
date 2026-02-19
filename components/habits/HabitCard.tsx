// components/habits/HabitCard.tsx
"use client";
import { useState } from "react";
import { Trash2, Flame, AlertTriangle, Trophy } from "lucide-react";
import { format } from "date-fns";
import { cn, getHabitStreak, getHabitCalendarWeeks, shouldShowMissedReminder, today } from "@/lib/utils";
import type { Habit } from "@/types";

const CATEGORY_COLORS = {
  health: "text-success",
  deepwork: "text-accent",
  learning: "text-warning",
  spiritual: "text-purple-400",
};

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, date?: string) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const streak = getHabitStreak(habit);
  const weeks = getHabitCalendarWeeks(habit, 5);
  const todayStr = today();
  const doneToday = habit.completions.includes(todayStr);
  const showReminder = shouldShowMissedReminder(habit);
  const showBadge = streak >= 7;

  // weekly completion this week
  const thisWeek = weeks[weeks.length - 1] ?? [];
  const weeklyDone = thisWeek.filter((d) => habit.completions.includes(d)).length;

  return (
    <div className={cn(
      "card p-4 transition-all duration-200",
      doneToday && "border-l-2",
      doneToday && CATEGORY_COLORS[habit.category].replace("text-", "border-l-")
    )}>
      {/* Reminder */}
      {showReminder && !doneToday && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30">
          <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
          <p className="text-xs text-warning">You&apos;ve missed this habit for 3+ days. Get back on track!</p>
        </div>
      )}

      {/* Badge */}
      {showBadge && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30">
          <Trophy className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          <p className="text-xs text-accent-light font-medium">🎉 {streak} day streak! You&apos;re on fire!</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Toggle button */}
        <button
          onClick={() => onToggle(habit.id)}
          className={cn(
            "w-11 h-11 rounded-xl text-xl flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 active:scale-90",
            doneToday
              ? "border-transparent bg-success/20 scale-105"
              : "border-bg-border bg-bg-elevated hover:border-success/50"
          )}
        >
          {habit.icon}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0" onClick={() => setExpanded(!expanded)}>
          <p className="font-medium text-text text-sm">{habit.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn("text-xs font-medium capitalize", CATEGORY_COLORS[habit.category])}>
              {habit.category}
            </span>
            <span className="text-text-dim text-xs">·</span>
            <span className="text-xs text-text-muted">{weeklyDone}/{habit.targetDays}x this week</span>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 text-right">
          <Flame className={cn("w-4 h-4", streak > 0 ? "text-warning" : "text-text-dim")} />
          <span className={cn("text-sm font-bold", streak > 0 ? "text-warning" : "text-text-dim")}>{streak}</span>
          <button onClick={() => onDelete(habit.id)} className="ml-1 p-1 rounded-lg text-text-dim hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      {expanded && (
        <div className="mt-4 animate-fadeIn">
          <p className="text-xs text-text-dim mb-2">Last 5 weeks</p>
          <div className="flex flex-col gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex gap-1">
                {week.map((day) => (
                  <button
                    key={day}
                    onClick={() => onToggle(habit.id, day)}
                    title={day}
                    className={cn(
                      "flex-1 h-6 rounded-sm transition-all duration-150",
                      habit.completions.includes(day)
                        ? "bg-accent opacity-90 hover:opacity-100"
                        : "bg-bg-border hover:bg-bg-elevated",
                      day === todayStr && "ring-1 ring-accent-light ring-offset-1 ring-offset-bg"
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-text-dim">Total: {habit.completions.length} completions</span>
            <button onClick={() => onDelete(habit.id)} className="flex items-center gap-1 text-xs text-danger hover:text-danger/80 transition-colors">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
