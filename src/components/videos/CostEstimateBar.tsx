import { AlertTriangle, Clock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ESTIMATED_MINUTES_PER_VIDEO,
  PRODUCT_SELECTION_LIMIT,
  TOKEN_COST_PER_VIDEO,
} from "@/data/tokens";

interface CostEstimateBarProps {
  selectedCount: number;
  tokenBalance: number;
  onContinue: () => void;
}

export function CostEstimateBar({ selectedCount, tokenBalance, onContinue }: CostEstimateBarProps) {
  const estimatedMinutes = selectedCount * ESTIMATED_MINUTES_PER_VIDEO;
  const estimatedTokens = selectedCount * TOKEN_COST_PER_VIDEO;
  const hasEnoughBalance = selectedCount === 0 || tokenBalance >= estimatedTokens;
  const atLimit = selectedCount >= PRODUCT_SELECTION_LIMIT;
  const canContinue = selectedCount > 0 && hasEnoughBalance;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64 animate-fade-in">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        {/* Left: selection stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {/* Count */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-semibold",
                atLimit
                  ? "text-primary"
                  : selectedCount > 0
                    ? "text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {selectedCount} / {PRODUCT_SELECTION_LIMIT} products selected
            </span>
            {atLimit && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Limit reached
              </span>
            )}
          </div>

          {/* Time + token estimates */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                ~{estimatedMinutes} min
              </span>

              <span
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  hasEnoughBalance ? "text-muted-foreground" : "font-medium text-amber-600",
                )}
              >
                {!hasEnoughBalance && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                <Coins className="h-3.5 w-3.5 shrink-0" />
                ~{estimatedTokens} tokens
                {!hasEnoughBalance && (
                  <span className="text-xs">(insufficient balance)</span>
                )}
              </span>
            </div>
          )}

          {selectedCount === 0 && (
            <p className="text-sm text-muted-foreground">
              Select at least one product to continue.
            </p>
          )}
        </div>

        {/* Right: CTA */}
        <Button size="lg" onClick={onContinue} disabled={!canContinue}>
          Choose template
        </Button>
      </div>
    </div>
  );
}
