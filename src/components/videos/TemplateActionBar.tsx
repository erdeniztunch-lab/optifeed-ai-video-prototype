import { useState } from "react";
import { AlertTriangle, Clock, Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ESTIMATED_MINUTES_PER_VIDEO, TOKEN_COST_PER_VIDEO } from "@/data/tokens";

interface TemplateActionBarProps {
  videoCount: number;
  tokenBalance: number;
  onGenerate: () => void;
}

export function TemplateActionBar({ videoCount, tokenBalance, onGenerate }: TemplateActionBarProps) {
  const [starting, setStarting] = useState(false);

  const estimatedMinutes = videoCount * ESTIMATED_MINUTES_PER_VIDEO;
  const estimatedTokens = videoCount * TOKEN_COST_PER_VIDEO;
  const hasEnoughBalance = videoCount === 0 || tokenBalance >= estimatedTokens;
  const canGenerate = videoCount > 0 && hasEnoughBalance;

  const handleClick = () => {
    if (!canGenerate || starting) return;
    setStarting(true);
    setTimeout(() => {
      setStarting(false);
      onGenerate();
    }, 300);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64 animate-fade-in">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        {/* Left: stats */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span
            className={cn(
              "text-sm font-semibold",
              videoCount > 0 ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {videoCount > 0 ? `${videoCount} video üretilecek` : "Şablon seçin ve devam edin"}
          </span>

          {videoCount > 0 && (
            <>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                ~{estimatedMinutes} dk
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  hasEnoughBalance ? "text-muted-foreground" : "font-medium text-amber-600",
                )}
              >
                {!hasEnoughBalance && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                <Coins className="h-3.5 w-3.5 shrink-0" />
                {estimatedTokens} token
                {!hasEnoughBalance && (
                  <span className="text-xs">(yetersiz bakiye)</span>
                )}
              </span>
              <p className="w-full text-xs text-muted-foreground/70">
                Token yalnızca üretim başladığında düşülür.
              </p>
            </>
          )}
        </div>

        {/* Right: CTA */}
        <Button size="lg" disabled={!canGenerate || starting} onClick={handleClick}>
          <Sparkles className="mr-2 h-4 w-4" />
          {starting ? "Başlatılıyor..." : "Videoları üret"}
        </Button>
      </div>
    </div>
  );
}
