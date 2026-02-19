// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfWeek, eachDayOfInterval, subDays, parseISO, isToday, differenceInCalendarDays } from "date-fns";
import type { Task, Habit, DailyEnergy } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function today(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => t.date === date);
}

export function getDailyProgress(tasks: Task[], date: string): number {
  const dayTasks = getTasksForDate(tasks, date);
  if (dayTasks.length === 0) return 0;
  return Math.round((dayTasks.filter((t) => t.completed).length / dayTasks.length) * 100);
}

export function getMITTasks(tasks: Task[], date: string): Task[] {
  return getTasksForDate(tasks, date).filter((t) => t.isMIT).slice(0, 3);
}

export function getHabitStreak(habit: Habit): number {
  if (habit.completions.length === 0) return 0;
  const sorted = [...habit.completions].sort().reverse();
  let streak = 0;
  let checkDate = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = format(subDays(checkDate, i), "yyyy-MM-dd");
    if (sorted.includes(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function getHabitCalendarWeeks(habit: Habit, weeks = 7): string[][] {
  const end = new Date();
  const start = subDays(end, weeks * 7 - 1);
  const days = eachDayOfInterval({ start, end });
  const result: string[][] = [];
  let week: string[] = [];

  days.forEach((day, idx) => {
    week.push(format(day, "yyyy-MM-dd"));
    if (week.length === 7 || idx === days.length - 1) {
      result.push(week);
      week = [];
    }
  });
  return result;
}

export function getEnergyForDate(logs: DailyEnergy[], date: string): DailyEnergy | undefined {
  return logs.find((l) => l.date === date);
}

export function estimateProductivity(completionRate: number, mood: number, sleepHours: number): number {
  const moodScore = (mood / 5) * 35;
  const sleepScore = Math.min(sleepHours / 8, 1) * 30;
  const completionScore = (completionRate / 100) * 35;
  return Math.round(moodScore + sleepScore + completionScore);
}

export function shouldShowMissedReminder(habit: Habit): boolean {
  let consecutive = 0;
  for (let i = 0; i < 3; i++) {
    const dateStr = format(subDays(new Date(), i + 1), "yyyy-MM-dd");
    if (!habit.completions.includes(dateStr)) {
      consecutive++;
    } else {
      break;
    }
  }
  return consecutive >= 3;
}

export function getWeeklyStats(tasks: Task[], habits: Habit[], energyLogs: DailyEnergy[]) {
  const days = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), i), "yyyy-MM-dd")
  );

  const weekTasks = tasks.filter((t) => days.includes(t.date));
  const completedTasks = weekTasks.filter((t) => t.completed).length;
  const completionRate = weekTasks.length ? Math.round((completedTasks / weekTasks.length) * 100) : 0;

  const weekLogs = energyLogs.filter((l) => days.includes(l.date));
  const avgMood = weekLogs.length ? weekLogs.reduce((s, l) => s + l.mood, 0) / weekLogs.length : 0;
  const avgSleep = weekLogs.length ? weekLogs.reduce((s, l) => s + l.sleepHours, 0) / weekLogs.length : 0;

  return { completionRate, completedTasks, totalTasks: weekTasks.length, avgMood, avgSleep, days };
}
