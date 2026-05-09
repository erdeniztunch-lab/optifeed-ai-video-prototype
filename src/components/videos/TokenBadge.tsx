import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenBadgeProps {
  balance: number;
  className?: string;
}

export function TokenBadge({ balance, className }: TokenBadgeProps) {
  const isLow = balance > 0 && balance < 50;
  const isDepleted = balance <= 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums",
        isDepleted
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : isLow
            ? "border-warning/30 bg-warning/10 text-foreground"
            : "border-border bg-card text-muted-foreground",
        className,
      )}
    >
      <Coins className="h-3 w-3 shrink-0" />
      {balance.toLocaleString("tr-TR")} token
    </div>
  );
}
