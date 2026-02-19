// types/index.ts

export type Priority = "high" | "medium" | "low";
export type HabitCategory = "health" | "deepwork" | "learning" | "spiritual";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  isMIT: boolean; // Most Important Task
  priority: Priority;
  date: string; // YYYY-MM-DD
  createdAt: number;
  completedAt?: number;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  createdAt: number;
  completions: string[]; // array of YYYY-MM-DD strings
  targetDays: number; // days per week target
}

export interface DailyEnergy {
  date: string; // YYYY-MM-DD
  sleepHours: number;
  mood: 1 | 2 | 3 | 4 | 5;
  waterGlasses: number;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  energyLogs: DailyEnergy[];
}

export interface WeeklySummary {
  weekStart: string;
  completionRate: number;
  tasksCompleted: number;
  totalTasks: number;
  habitStreaks: { habitId: string; streak: number }[];
  avgMood: number;
  avgSleep: number;
}
