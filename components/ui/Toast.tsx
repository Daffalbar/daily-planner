// components/ui/Toast.tsx
"use client";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import type { Toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const icons = {
  success: <CheckCircle className="w-4 h-4 text-success" />,
  info: <Info className="w-4 h-4 text-accent" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
};

export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl border bg-bg-elevated border-bg-border",
            "shadow-lg shadow-black/40 animate-fadeIn pointer-events-auto"
          )}
        >
          {icons[t.type]}
          <span className="text-sm text-text flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="text-text-dim hover:text-text transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
