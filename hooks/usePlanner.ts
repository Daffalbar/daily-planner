// hooks/usePlanner.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import type { AppState, Task, Habit, DailyEnergy, HabitCategory, Priority } from "@/types";
import { loadState, saveState } from "@/lib/storage";
import { generateId, today } from "@/lib/utils";

export function usePlanner() {
  const [state, setState] = useState<AppState>({ tasks: [], habits: [], energyLogs: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState);
  }, []);

  // ─── TASKS ────────────────────────────────────────────────────────────────────
  const addTask = useCallback((data: { title: string; description?: string; isMIT?: boolean; priority?: Priority; date?: string }) => {
    const task: Task = {
      id: generateId(),
      title: data.title,
      description: data.description,
      completed: false,
      isMIT: data.isMIT ?? false,
      priority: data.priority ?? "medium",
      date: data.date ?? today(),
      createdAt: Date.now(),
    };
    persist({ ...state, tasks: [...state.tasks, task] });
    return task;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    persist({
      ...state,
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  const deleteTask = useCallback((id: string) => {
    persist({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  const toggleTask = useCallback((id: string) => {
    persist({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      ),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  // ─── HABITS ───────────────────────────────────────────────────────────────────
  const addHabit = useCallback((data: { name: string; category: HabitCategory; icon?: string; targetDays?: number }) => {
    const habit: Habit = {
      id: generateId(),
      name: data.name,
      category: data.category,
      icon: data.icon ?? "⚡",
      createdAt: Date.now(),
      completions: [],
      targetDays: data.targetDays ?? 7,
    };
    persist({ ...state, habits: [...state.habits, habit] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  const toggleHabit = useCallback((id: string, date: string = today()) => {
    persist({
      ...state,
      habits: state.habits.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(date);
        return {
          ...h,
          completions: has ? h.completions.filter((d) => d !== date) : [...h.completions, date],
        };
      }),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  const deleteHabit = useCallback((id: string) => {
    persist({ ...state, habits: state.habits.filter((h) => h.id !== id) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    persist({ ...state, habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)) });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  // ─── ENERGY ───────────────────────────────────────────────────────────────────
  const setEnergy = useCallback((data: Partial<DailyEnergy> & { date?: string }) => {
    const date = data.date ?? today();
    const existing = state.energyLogs.find((l) => l.date === date);
    const updated: DailyEnergy = {
      date,
      sleepHours: existing?.sleepHours ?? 7,
      mood: existing?.mood ?? 3,
      waterGlasses: existing?.waterGlasses ?? 0,
      ...data,
    } as DailyEnergy;
    persist({
      ...state,
      energyLogs: existing
        ? state.energyLogs.map((l) => (l.date === date ? updated : l))
        : [...state.energyLogs, updated],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, persist]);

  return {
    state,
    hydrated,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addHabit,
    toggleHabit,
    deleteHabit,
    updateHabit,
    setEnergy,
  };
}
