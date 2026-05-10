import { useState } from "react";
import { Coins, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TOKEN_COST_PER_VIDEO } from "@/data/tokens";

interface GenerateCostConfirmProps {
  videoCount: number;
  tokenBalance: number;
  onGenerate: () => void;
}

export function GenerateCostConfirm({
  videoCount,
  tokenBalance,
  onGenerate,
}: GenerateCostConfirmProps) {
  const [starting, setStarting] = useState(false);

  const estimatedTokens = videoCount * TOKEN_COST_PER_VIDEO;
  const remainingBalance = tokenBalance - estimatedTokens;
  const hasEnoughBalance = tokenBalance >= estimatedTokens;
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
    <div
      className={cn(
        "rounded-2xl border p-5",
        hasEnoughBalance ? "border-border bg-card" : "border-amber-200 bg-amber-50/50",
      )}
    >
      <p className="mb-4 text-sm font-semibold text-foreground">
        {videoCount} video üretilecek
      </p>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <StatRow
          icon={<span className="text-xs font-bold text-muted-foreground">#</span>}
          label="Video"
          value={`${videoCount}`}
        />
        <StatRow
          icon={<Coins className="h-3.5 w-3.5 text-muted-foreground" />}
          label="Tahmini maliyet"
          value={`${estimatedTokens} token`}
          valueClassName={!hasEnoughBalance ? "text-amber-600 font-semibold" : undefined}
        />
      </div>

      <div
        className={cn(
          "mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
          hasEnoughBalance
            ? "bg-muted/50 text-muted-foreground"
            : "bg-amber-100 text-amber-700",
        )}
      >
        {!hasEnoughBalance ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>
              Yetersiz bakiye — {estimatedTokens} token gerekli, mevcut: {tokenBalance}.
            </span>
          </>
        ) : (
          <>
            <Coins className="h-3.5 w-3.5 shrink-0" />
            <span>
              Üretim sonrası kalan:{" "}
              <span className="font-medium text-foreground">{remainingBalance} token</span>
            </span>
          </>
        )}
      </div>

      <p className="mb-4 text-xs text-muted-foreground/60">
        Token yalnızca üretim başladığında düşülür. Çıktı formatı: 1:1, 1080×1080.
      </p>

      <Button
        size="lg"
        className="w-full"
        disabled={!canGenerate || starting}
        onClick={handleClick}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {starting ? "Başlatılıyor..." : "Videoları üret"}
      </Button>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
      {icon}
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-semibold text-foreground", valueClassName)}>{value}</p>
      </div>
    </div>
  );
}
