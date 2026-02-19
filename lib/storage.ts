// lib/storage.ts
import type { AppState } from "@/types";

const KEY = "daily-planner-v1";

const DEFAULT_STATE: AppState = {
  tasks: [],
  habits: [],
  energyLogs: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

// ─── UPGRADE PATH ──────────────────────────────────────────────────────────────
// To upgrade to Prisma + Supabase:
// 1. npm install @prisma/client @supabase/supabase-js
// 2. Create prisma/schema.prisma with Task, Habit, EnergyLog models
// 3. Replace loadState/saveState with API routes in app/api/
// 4. Update hooks/usePlanner.ts to use SWR/React Query fetches
// ──────────────────────────────────────────────────────────────────────────────
