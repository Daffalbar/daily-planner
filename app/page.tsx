// app/page.tsx
"use client";
import { useState } from "react";
import { format } from "date-fns";
import { usePlanner } from "@/hooks/usePlanner";
import { useToast } from "@/hooks/useToast";
import { DailyPanel } from "@/components/planner/DailyPanel";
import { HabitsPanel } from "@/components/habits/HabitsPanel";
import { EnergyPanel } from "@/components/energy/EnergyPanel";
import { WeeklySummary } from "@/components/planner/WeeklySummary";
import { BottomNav, type Tab } from "@/components/ui/BottomNav";
import { FAB } from "@/components/ui/FAB";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "@/components/planner/TaskForm";
import { HabitForm } from "@/components/habits/HabitForm";
import { ToastContainer } from "@/components/ui/Toast";
import { today } from "@/lib/utils";

export default function HomePage() {
  const planner = usePlanner();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("today");
  const [fabModal, setFabModal] = useState(false);

  if (!planner.hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const handleToggleTask = (id: string) => {
    const task = planner.state.tasks.find((t) => t.id === id);
    planner.toggleTask(id);
    if (task && !task.completed) {
      toast.show(`✅ "${task.title}" completed!`, "success");
    }
  };

  const handleAddTask = (data: Parameters<typeof planner.addTask>[0]) => {
    planner.addTask(data);
    toast.show("Task added", "info", "📝");
  };

  const handleAddHabit = (data: Parameters<typeof planner.addHabit>[0]) => {
    planner.addHabit(data);
    toast.show("Habit created! Keep it up 🔥", "success");
  };

  const handleToggleHabit = (id: string, date?: string) => {
    const habit = planner.state.habits.find((h) => h.id === id);
    const dateStr = date ?? today();
    const wasDone = habit?.completions.includes(dateStr);
    planner.toggleHabit(id, date);
    if (habit && !wasDone) {
      toast.show(`${habit.icon} ${habit.name} logged!`, "success");
    }
  };

  const getFabModal = () => {
    if (tab === "habits") {
      return (
        <Modal open={fabModal} onClose={() => setFabModal(false)} title="New Habit">
          <HabitForm
            onSubmit={(data) => { handleAddHabit(data); setFabModal(false); }}
            onCancel={() => setFabModal(false)}
          />
        </Modal>
      );
    }
    return (
      <Modal open={fabModal} onClose={() => setFabModal(false)} title="Add Task">
        <TaskForm
          onSubmit={(data) => { handleAddTask(data); setFabModal(false); }}
          onCancel={() => setFabModal(false)}
          initialDate={today()}
        />
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#7c6aff 1px, transparent 1px), linear-gradient(90deg, #7c6aff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-accent/8 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-bg-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gradient tracking-tight">DayOS</h1>
            <p className="text-xs text-text-dim">{format(new Date(), "EEEE, MMM d, yyyy")}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-elevated border border-bg-border px-3 py-1.5 rounded-xl">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse2" />
            Active
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 pt-5 pb-32">
        {tab === "today" && (
          <DailyPanel
            tasks={planner.state.tasks}
            onAdd={handleAddTask}
            onToggle={handleToggleTask}
            onDelete={planner.deleteTask}
            onUpdate={planner.updateTask}
          />
        )}
        {tab === "habits" && (
          <HabitsPanel
            habits={planner.state.habits}
            onAdd={handleAddHabit}
            onToggle={handleToggleHabit}
            onDelete={planner.deleteHabit}
          />
        )}
        {tab === "energy" && (
          <EnergyPanel
            energyLogs={planner.state.energyLogs}
            tasks={planner.state.tasks}
            onSetEnergy={planner.setEnergy}
          />
        )}
        {tab === "stats" && (
          <WeeklySummary
            tasks={planner.state.tasks}
            habits={planner.state.habits}
            energyLogs={planner.state.energyLogs}
          />
        )}
      </main>

      {/* FAB - only on today & habits */}
      {(tab === "today" || tab === "habits") && (
        <FAB onClick={() => setFabModal(true)} />
      )}

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={setTab} />

      {/* Toast notifications */}
      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />

      {/* FAB Modal */}
      {getFabModal()}
    </div>
  );
}
