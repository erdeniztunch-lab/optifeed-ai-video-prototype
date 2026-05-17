import { toast } from "sonner";
import { MOCK_SPENDING } from "@/data/tokens";

interface WalletPanelProps {
  balance: number;
}

export function WalletPanel({ balance }: WalletPanelProps) {
  return (
    <div className="flex flex-col">
      {/* Balance */}
      <div className="px-4 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Bakiye
        </p>
        <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
          {balance.toLocaleString("tr-TR")}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">token</span>
        </p>
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* Spending */}
      <div className="space-y-2 px-4 py-3">
        <SpendRow label="Bu hafta" value={`−${MOCK_SPENDING.thisWeek.toLocaleString("tr-TR")}`} />
        <SpendRow
          label="Bu ay"
          value={`−${MOCK_SPENDING.thisMonth.toLocaleString("tr-TR")}`}
        />
        <SpendRow label="Son işlem" value={MOCK_SPENDING.lastActionLabel} />
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* Actions */}
      <div className="flex flex-col gap-1.5 px-4 py-3">
        <button
          type="button"
          onClick={() => toast("Bu özellik yakında")}
          className="text-left text-sm font-medium text-primary hover:underline"
        >
          Geçmişi gör →
        </button>
        <button
          type="button"
          onClick={() => toast("Bu özellik yakında")}
          className="text-left text-sm font-medium text-primary hover:underline"
        >
          Token al →
        </button>
      </div>
    </div>
  );
}

function SpendRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}
