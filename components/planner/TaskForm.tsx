// components/planner/TaskForm.tsx
"use client";
import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { cn, today } from "@/lib/utils";
import type { Priority } from "@/types";

interface TaskFormProps {
  onSubmit: (data: { title: string; description?: string; isMIT: boolean; priority: Priority; date: string }) => void;
  onCancel: () => void;
  initialDate?: string;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "high", label: "High", color: "text-danger" },
  { value: "medium", label: "Medium", color: "text-warning" },
  { value: "low", label: "Low", color: "text-success" },
];

export function TaskForm({ onSubmit, onCancel, initialDate }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMIT, setIsMIT] = useState(false);
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState(initialDate ?? today());

  const handle = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, isMIT, priority, date });
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        autoFocus
        type="text"
        placeholder="What needs to get done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handle()}
        className="w-full bg-bg-elevated border border-bg-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim outline-none focus:border-accent transition-colors"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-bg-elevated border border-bg-border rounded-xl px-4 py-3 text-text placeholder:text-text-dim outline-none focus:border-accent transition-colors text-sm"
      />
      <div className="flex items-center gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="flex-1 bg-bg-elevated border border-bg-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent appearance-none"
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label} Priority</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 bg-bg-elevated border border-bg-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent"
        />
      </div>
      <button
        onClick={() => setIsMIT(!isMIT)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
          isMIT
            ? "bg-accent/10 border-accent text-accent-light"
            : "bg-bg-elevated border-bg-border text-text-muted hover:border-accent/50"
        )}
      >
        <Star className={cn("w-4 h-4", isMIT && "fill-current")} />
        Mark as Most Important Task (MIT)
      </button>
      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 btn-ghost border border-bg-border py-2.5">
          Cancel
        </button>
        <button onClick={handle} disabled={!title.trim()} className="flex-1 btn-primary py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">
          Add Task
        </button>
      </div>
    </div>
  );
}
