// components/habits/HabitsPanel.tsx
"use client";
import { useState } from "react";
import { Plus, Layers } from "lucide-react";
import type { Habit } from "@/types";
import { HabitCard } from "./HabitCard";
import { HabitForm } from "./HabitForm";
import { Modal } from "@/components/ui/Modal";

interface HabitsPanelProps {
  habits: Habit[];
  onAdd: (data: Parameters<typeof HabitForm>[0]["onSubmit"] extends (d: infer D) => void ? D : never) => void;
  onToggle: (id: string, date?: string) => void;
  onDelete: (id: string) => void;
}

export function HabitsPanel({ habits, onAdd, onToggle, onDelete }: HabitsPanelProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <h2 className="text-base font-bold text-text">Habit Builder</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-light transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-3xl mb-3">🌱</p>
          <p className="text-text-muted text-sm mb-1">No habits yet</p>
          <p className="text-text-dim text-xs mb-4">Build routines that stick</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
            Create first habit
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Habit">
        <HabitForm
          onSubmit={(data) => { onAdd(data); setShowModal(false); }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </section>
  );
}
