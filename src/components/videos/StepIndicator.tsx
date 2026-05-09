import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Select", "Template", "Progress", "Review", "Export", "Done"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                done && "bg-success text-success-foreground",
                active && "bg-primary text-primary-foreground",
                !done && !active && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : idx}
            </div>
            <span
              className={cn(
                "font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {idx < STEPS.length && <span className="mx-1 h-px w-8 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
