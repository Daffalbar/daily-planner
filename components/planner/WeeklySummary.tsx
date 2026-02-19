// components/planner/WeeklySummary.tsx
"use client";
import { BarChart2, TrendingUp, CheckSquare, Heart } from "lucide-react";
import type { Task, Habit, DailyEnergy } from "@/types";
import { getWeeklyStats, getHabitStreak } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface WeeklySummaryProps {
  tasks: Task[];
  habits: Habit[];
  energyLogs: DailyEnergy[];
}

export function WeeklySummary({ tasks, habits, energyLogs }: WeeklySummaryProps) {
  const stats = getWeeklyStats(tasks, habits, energyLogs);

  return (
    <section className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-accent" />
        <h2 className="text-base font-bold text-text">This Week</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card-elevated p-3 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckSquare className="w-3.5 h-3.5 text-success" />
            <span className="text-xs text-text-muted">Completion</span>
          </div>
          <p className="text-xl font-bold text-text">{stats.completionRate}%</p>
          <p className="text-xs text-text-dim">{stats.completedTasks}/{stats.totalTasks} tasks</p>
        </div>

        <div className="card-elevated p-3 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs text-text-muted">Avg Mood</span>
          </div>
          <p className="text-xl font-bold text-text">{stats.avgMood ? stats.avgMood.toFixed(1) : "—"}</p>
          <p className="text-xs text-text-dim">{stats.avgSleep ? `${stats.avgSleep.toFixed(1)}h sleep` : "No data"}</p>
        </div>
      </div>

      {/* Daily completion heatmap */}
      <div>
        <p className="text-xs text-text-dim mb-2">Daily completion (last 7 days)</p>
        <div className="flex gap-1.5">
          {stats.days.reverse().map((day) => {
            const dayTasks = tasks.filter((t) => t.date === day);
            const rate = dayTasks.length
              ? Math.round((dayTasks.filter((t) => t.completed).length / dayTasks.length) * 100)
              : 0;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-10 rounded-lg flex items-end overflow-hidden bg-bg-border">
                  <div
                    className="w-full transition-all duration-500"
                    style={{
                      height: `${rate || (dayTasks.length === 0 ? 0 : 5)}%`,
                      background: rate >= 80 ? "#22c55e" : rate >= 50 ? "#7c6aff" : rate > 0 ? "#f59e0b" : "transparent",
                      minHeight: rate > 0 ? "4px" : "0",
                    }}
                  />
                </div>
                <span className="text-[10px] text-text-dim">{new Date(day + "T12:00:00").toLocaleDateString("en", { weekday: "narrow" })}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top streaks */}
      {habits.length > 0 && (
        <div className="mt-4 pt-4 border-t border-bg-border">
          <p className="text-xs text-text-dim mb-2">Top habit streaks</p>
          <div className="flex flex-col gap-2">
            {habits
              .map((h) => ({ ...h, streak: getHabitStreak(h) }))
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 3)
              .map((h) => (
                <div key={h.id} className="flex items-center gap-2">
                  <span className="text-sm">{h.icon}</span>
                  <span className="text-xs text-text flex-1 truncate">{h.name}</span>
                  <span className="text-xs font-bold text-warning">🔥 {h.streak}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
