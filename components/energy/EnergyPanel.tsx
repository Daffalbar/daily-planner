// components/energy/EnergyPanel.tsx
"use client";
import { useState } from "react";
import { Moon, Droplets, Smile, Zap, Plus, Minus } from "lucide-react";
import { cn, today, getEnergyForDate, getDailyProgress, estimateProductivity } from "@/lib/utils";
import type { DailyEnergy, Task } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface EnergyPanelProps {
  energyLogs: DailyEnergy[];
  tasks: Task[];
  onSetEnergy: (data: Partial<DailyEnergy> & { date?: string }) => void;
}

const MOODS = [
  { value: 1 as const, emoji: "😫", label: "Drained" },
  { value: 2 as const, emoji: "😕", label: "Low" },
  { value: 3 as const, emoji: "😐", label: "Okay" },
  { value: 4 as const, emoji: "😊", label: "Good" },
  { value: 5 as const, emoji: "🤩", label: "Energized" },
];

export function EnergyPanel({ energyLogs, tasks, onSetEnergy }: EnergyPanelProps) {
  const date = today();
  const log = getEnergyForDate(energyLogs, date);
  const completionRate = getDailyProgress(tasks, date);

  const sleep = log?.sleepHours ?? 7;
  const mood = log?.mood ?? 3;
  const water = log?.waterGlasses ?? 0;
  const productivity = log ? estimateProductivity(completionRate, mood, sleep) : null;

  const update = (patch: Partial<DailyEnergy>) => onSetEnergy({ ...patch, date });

  const productivityColor = productivity !== null
    ? productivity >= 70 ? "bg-success" : productivity >= 40 ? "bg-warning" : "bg-danger"
    : "bg-bg-border";

  return (
    <section className="card p-4 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-warning" />
        <h2 className="text-base font-bold text-text">Energy</h2>
      </div>

      {/* Sleep */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-text">Sleep</span>
          </div>
          <span className="text-sm font-bold text-purple-400">{sleep}h</span>
        </div>
        <input
          type="range"
          min={0}
          max={12}
          step={0.5}
          value={sleep}
          onChange={(e) => update({ sleepHours: +e.target.value })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-text-dim">
          <span>0h</span><span>6h</span><span>12h</span>
        </div>
      </div>

      {/* Mood */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Smile className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-text">Mood</span>
        </div>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              onClick={() => update({ mood: m.value })}
              title={m.label}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border text-xl transition-all duration-200",
                mood === m.value
                  ? "border-accent bg-accent/15 scale-105"
                  : "border-bg-border hover:border-bg-elevated bg-bg-elevated"
              )}
            >
              <span>{m.emoji}</span>
              <span className="text-[10px] text-text-dim hidden sm:block">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Water */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-text">Water</span>
          </div>
          <span className="text-sm font-bold text-blue-400">{water} glasses</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => update({ waterGlasses: Math.max(0, water - 1) })}
            className="w-9 h-9 rounded-xl bg-bg-elevated border border-bg-border flex items-center justify-center hover:border-accent/50 transition-colors active:scale-90"
          >
            <Minus className="w-4 h-4 text-text-muted" />
          </button>
          <div className="flex-1 flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <button
                key={i}
                onClick={() => update({ waterGlasses: i + 1 })}
                className={cn(
                  "flex-1 h-7 rounded-sm transition-all duration-200",
                  i < water ? "bg-blue-500" : "bg-bg-border hover:bg-bg-elevated"
                )}
              />
            ))}
          </div>
          <button
            onClick={() => update({ waterGlasses: Math.min(16, water + 1) })}
            className="w-9 h-9 rounded-xl bg-bg-elevated border border-bg-border flex items-center justify-center hover:border-accent/50 transition-colors active:scale-90"
          >
            <Plus className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Productivity Score */}
      {productivity !== null && (
        <div className="border-t border-bg-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text">Est. Productivity</span>
            <span className="text-lg font-bold text-gradient">{productivity}%</span>
          </div>
          <ProgressBar value={productivity} colorClass={productivityColor} height="h-2" />
          <p className="text-xs text-text-dim mt-1.5">
            Based on sleep, mood, and task completion
          </p>
        </div>
      )}
    </section>
  );
}
