// components/planner/DailyPanel.tsx
"use client";
import { useState } from "react";
import { Plus, Star, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn, getTasksForDate, getDailyProgress, getMITTasks, today } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";

interface DailyPanelProps {
  tasks: Task[];
  onAdd: (data: Parameters<typeof TaskForm>[0]["onSubmit"] extends (d: infer D) => void ? D : never) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function DailyPanel({ tasks, onAdd, onToggle, onDelete, onUpdate }: DailyPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<"today" | "all">("today");
  const date = today();
  const dayTasks = getTasksForDate(tasks, date);
  const progress = getDailyProgress(tasks, date);
  const mits = getMITTasks(tasks, date);
  const pending = dayTasks.filter((t) => !t.completed);
  const completed = dayTasks.filter((t) => t.completed);

  const getProgressColor = () => {
    if (progress >= 80) return "bg-success";
    if (progress >= 50) return "bg-accent";
    return "bg-warning";
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="card p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 text-text-muted text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(), "EEEE, MMMM d")}
            </div>
            <h2 className="text-lg font-bold text-text">Today's Plan</h2>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gradient">{progress}%</p>
            <p className="text-xs text-text-muted">{completed.length}/{dayTasks.length} done</p>
          </div>
        </div>
        <ProgressBar value={progress} colorClass={getProgressColor()} height="h-2" />
      </div>

      {/* MIT Section */}
      {mits.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-accent fill-current" />
            <span className="text-sm font-semibold text-accent-light">Most Important Tasks</span>
          </div>
          <div className="flex flex-col gap-2">
            {mits.map((t, i) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text">All Tasks</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-light transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-text-dim text-sm">No tasks for today</p>
            <button onClick={() => setShowModal(true)} className="mt-3 btn-primary text-sm">
              Add your first task
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pending.map((t, i) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
            {completed.length > 0 && (
              <>
                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-bg-border" />
                  <span className="text-xs text-text-dim">Completed</span>
                  <div className="flex-1 h-px bg-bg-border" />
                </div>
                {completed.map((t) => (
                  <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Task">
        <TaskForm
          onSubmit={(data) => { onAdd(data); setShowModal(false); }}
          onCancel={() => setShowModal(false)}
          initialDate={date}
        />
      </Modal>
    </section>
  );
}
