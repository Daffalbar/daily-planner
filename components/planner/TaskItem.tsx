// components/planner/TaskItem.tsx
"use client";
import { useState } from "react";
import { Check, Star, Trash2, Edit2, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Priority } from "@/types";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  style?: React.CSSProperties;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "bg-danger/20 border-danger/40",
  medium: "bg-warning/20 border-warning/40",
  low: "bg-success/20 border-success/40",
};

const PRIORITY_DOT: Record<Priority, string> = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-success",
};

export function TaskItem({ task, onToggle, onDelete, onUpdate, style }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const saveEdit = () => {
    if (title.trim()) onUpdate(task.id, { title: title.trim() });
    setEditing(false);
  };

  return (
    <div
      style={style}
      className={cn(
        "group flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200",
        task.completed ? "opacity-50 bg-bg-border/30 border-transparent" : "bg-bg-elevated border-bg-border hover:border-accent/30",
        task.isMIT && !task.completed && "border-l-2 border-l-accent"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
          task.completed ? "border-success bg-success" : "border-muted hover:border-accent"
        )}
      >
        {task.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }}
              className="flex-1 bg-bg-border rounded-lg px-2 py-0.5 text-sm text-text outline-none focus:ring-1 focus:ring-accent"
            />
            <button onClick={saveEdit} className="text-success hover:scale-110 transition-transform"><Save className="w-3.5 h-3.5" /></button>
            <button onClick={() => setEditing(false)} className="text-text-dim hover:scale-110 transition-transform"><X className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <p className={cn("text-sm font-medium leading-snug", task.completed && "line-through text-text-muted")}>
            {task.title}
          </p>
        )}
        {task.description && !editing && (
          <p className="text-xs text-text-muted mt-0.5 truncate">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {task.isMIT && (
            <span className="flex items-center gap-1 text-xs text-accent-light font-medium">
              <Star className="w-3 h-3 fill-current" /> MIT
            </span>
          )}
          <span className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_DOT[task.priority])} />
          <span className="text-xs text-text-dim capitalize">{task.priority}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-text-dim hover:text-accent hover:bg-accent/10 transition-all">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-text-dim hover:text-danger hover:bg-danger/10 transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
