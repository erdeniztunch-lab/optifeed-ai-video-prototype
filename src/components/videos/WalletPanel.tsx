import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MOCK_SPENDING } from "@/data/tokens";

interface WalletPanelProps {
  balance: number;
}

export function WalletPanel({ balance }: WalletPanelProps) {
  const { i18n, t } = useTranslation();
  const numberLocale = i18n.language === "tr" ? "tr-TR" : "en-US";
  const comingSoonToast = t("wallet.comingSoonToast");

  return (
    <div className="flex flex-col">
      {/* Balance */}
      <div className="px-4 pb-3 pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {t("wallet.balance")}
        </p>
        <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
          {balance.toLocaleString(numberLocale)}
          <span className="ml-1.5 text-sm font-normal text-muted-foreground">{t("token.unit")}</span>
        </p>
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* Spending */}
      <div className="space-y-2 px-4 py-3">
        <SpendRow label={t("wallet.spent.week")} value={`−${MOCK_SPENDING.thisWeek.toLocaleString(numberLocale)}`} />
        <SpendRow
          label={t("wallet.spent.month")}
          value={`−${MOCK_SPENDING.thisMonth.toLocaleString(numberLocale)}`}
        />
        <SpendRow label={t("wallet.spent.lastAction")} value={t("wallet.spent.lastActionValue")} />
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* Actions */}
      <div className="flex flex-col gap-1.5 px-4 py-3">
        <button
          type="button"
          onClick={() => toast(comingSoonToast)}
          className="text-left text-sm font-medium text-primary hover:underline"
        >
          {t("wallet.history")}
        </button>
        <button
          type="button"
          onClick={() => toast(comingSoonToast)}
          className="text-left text-sm font-medium text-primary hover:underline"
        >
          {t("wallet.topUpCta")}
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
