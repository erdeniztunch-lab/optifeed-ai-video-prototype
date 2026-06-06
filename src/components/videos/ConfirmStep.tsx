import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowLeft,
  BellOff,
  Clock,
  Coins,
  FileVideo,
  Info,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { ESTIMATED_MINUTES_PER_VIDEO, TOKEN_COST_PER_VIDEO } from "@/data/tokens";
import { type TemplateId, type CampaignContext } from "@/types/video-flow";

interface ConfirmStepProps {
  products: Product[];
  selectedTemplate: TemplateId;
  campaignContext: CampaignContext;
  tokenBalance: number;
  onConfirm: (notifyOnComplete: boolean) => void;
  onBack: () => void;
  onEditTemplate: () => void;
}

export function ConfirmStep({
  products,
  selectedTemplate,
  campaignContext,
  tokenBalance,
  onConfirm,
  onBack,
  onEditTemplate,
}: ConfirmStepProps) {
  const { t, i18n } = useTranslation();
  const [notify, setNotify] = useState(false);
  const [notifyWarning, setNotifyWarning] = useState<string | null>(null);
  const [tokenToastVisible, setTokenToastVisible] = useState(false);

  const locale = i18n.language === "tr" ? "tr-TR" : "en-US";
  const videoCount = products.length;
  const estimatedMinutes = videoCount * ESTIMATED_MINUTES_PER_VIDEO;
  const estimatedTokens = videoCount * TOKEN_COST_PER_VIDEO;
  const remainingTokens = tokenBalance - estimatedTokens;
  const hasEnoughBalance = tokenBalance >= estimatedTokens;

  const templateLabel = t(`templates.${selectedTemplate}.label`, {
    defaultValue: t(`textileTemplates.${selectedTemplate}.label`, {
      defaultValue: selectedTemplate,
    }),
  });
  const templateDescription = t(`templates.${selectedTemplate}.description`, {
    defaultValue: t(`textileTemplates.${selectedTemplate}.sceneContext`, {
      defaultValue: "",
    }),
  });

  const handleNotifyChange = (checked: boolean) => {
    if (!checked) {
      setNotify(false);
      setNotifyWarning(null);
      return;
    }

    if (typeof Notification === "undefined") {
      setNotifyWarning(t("confirm.notify.unsupported"));
      return;
    }

    if (Notification.permission === "granted") {
      setNotify(true);
      setNotifyWarning(null);
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setNotify(true);
        setNotifyWarning(null);
      } else {
        setNotifyWarning(t("confirm.notify.denied"));
      }
    });
  };

  const handleTokenAl = () => {
    setTokenToastVisible(true);
    window.setTimeout(() => setTokenToastVisible(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("confirm.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("confirm.subtitle")}</p>
        {campaignContext.name && (
          <p className="mt-2 text-xs text-muted-foreground/60">{campaignContext.name}</p>
        )}
      </header>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <SummaryCard
          icon={<FileVideo className="h-5 w-5 text-primary" />}
          label={t("confirm.productCount")}
          value={String(videoCount)}
        />
        <SummaryCard
          icon={<Clock className="h-5 w-5 text-primary" />}
          label={t("confirm.estimatedTime")}
          value={t("confirm.timeValue", { minutes: estimatedMinutes })}
        />
        <SummaryCard
          icon={<Coins className="h-5 w-5 text-primary" />}
          label={t("confirm.estimatedTokens")}
          value={t("confirm.tokenValue", { count: estimatedTokens })}
        />
      </div>

      {/* Template summary */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              {t("confirm.template.label")}
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">{templateLabel}</p>
            {templateDescription && (
              <p className="mt-0.5 text-sm text-muted-foreground">{templateDescription}</p>
            )}
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t("confirm.template.note", { count: videoCount })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onEditTemplate} className="shrink-0">
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            {t("common.edit")}
          </Button>
        </div>
      </div>

      {/* AI scope note */}
      <div className="mb-6 flex items-start gap-2 rounded-lg bg-muted/40 px-4 py-3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <p className="text-xs leading-relaxed text-muted-foreground/70">
          {t("confirm.aiNote")}
        </p>
      </div>

      {/* Balance summary */}
      <div
        className={cn(
          "mb-6 rounded-xl border p-4",
          !hasEnoughBalance ? "border-amber-500/30 bg-amber-500/5" : "border-border bg-card",
        )}
      >
        <div className="space-y-2.5">
          <BalanceRow
            label={t("confirm.balance.current")}
            value={`${tokenBalance.toLocaleString(locale)}${t("confirm.balance.tokenSuffix")}`}
          />
          <BalanceRow
            label={t("confirm.balance.thisRun")}
            value={t("confirm.balance.minus", { count: estimatedTokens })}
            valueClassName={!hasEnoughBalance ? "text-amber-600 font-semibold" : undefined}
          />
          <div className="h-px bg-border" />
          <BalanceRow
            label={t("confirm.balance.remaining")}
            value={t("confirm.balance.approx", {
              count: remainingTokens.toLocaleString(locale),
            })}
            valueClassName={!hasEnoughBalance ? "text-amber-600 font-semibold" : undefined}
          />
        </div>

        {!hasEnoughBalance && (
          <div role="status" className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-amber-700">
                  {t("confirm.insufficient.title")}
                </p>
                <p className="mt-0.5 text-xs text-amber-600">
                  {t("confirm.insufficient.desc", {
                    count: Math.abs(remainingTokens).toLocaleString(locale),
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={handleTokenAl}
                className="shrink-0 rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700"
              >
                {t("confirm.insufficient.tokenAl")}
              </button>
            </div>
            {tokenToastVisible && (
              <p className="mt-2 text-xs text-amber-600">
                {t("confirm.insufficient.toast")}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Notification checkbox */}
      <div className="mb-10 rounded-xl border border-border bg-card p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => handleNotifyChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border accent-primary"
          />
          <div>
            <p className="text-sm font-medium text-foreground">{t("confirm.notify.label")}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("confirm.notify.desc")}
            </p>
          </div>
        </label>
        {notifyWarning && (
          <div className="mt-2 flex items-center gap-1.5 pl-7">
            <BellOff className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">{notifyWarning}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {t("common.back")}
        </Button>
        <Button disabled={!hasEnoughBalance} onClick={() => onConfirm(notify)}>
          {t("confirm.start")}
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
      {icon}
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function BalanceRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium text-foreground", valueClassName)}>{value}</span>
    </div>
  );
}
