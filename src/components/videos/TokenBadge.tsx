import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOKEN_COST_PER_VIDEO, ESTIMATED_MINUTES_PER_VIDEO } from "@/data/tokens";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WalletPanel } from "@/components/videos/WalletPanel";

interface TokenBadgeProps {
  balance: number;
  spent?: number;
  className?: string;
}

export function TokenBadge({ balance, spent = 0, className }: TokenBadgeProps) {
  const isLow = balance > 0 && balance < 50;
  const isDepleted = balance <= 0;
  const spentMinutes = Math.round((spent / TOKEN_COST_PER_VIDEO) * ESTIMATED_MINUTES_PER_VIDEO);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Token bakiyesini görüntüle"
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-opacity hover:opacity-80",
              isDepleted
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : isLow
                  ? "border-warning/30 bg-warning/10 text-foreground"
                  : "border-border bg-card text-muted-foreground",
            )}
          >
            <Coins className="h-3 w-3 shrink-0" />
            {balance.toLocaleString("tr-TR")} token
          </button>
        </PopoverTrigger>
        <PopoverContent side="right" align="end" sideOffset={8} className="w-64 p-0">
          <WalletPanel balance={balance} />
        </PopoverContent>
      </Popover>

      {spent > 0 && (
        <p className="px-1 text-[11px] tabular-nums text-sidebar-foreground/50">
          {spent.toLocaleString("tr-TR")} token harcandı
          {spentMinutes > 0 && ` · ~${spentMinutes} dk`}
        </p>
      )}
    </div>
  );
}
