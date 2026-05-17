import { useState } from "react";
import { AlertTriangle, ArrowLeft, BellOff, Clock, Coins, FileVideo, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { TEMPLATES } from "@/data/templates";
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
  const [notify, setNotify] = useState(false);
  const [notifyWarning, setNotifyWarning] = useState<string | null>(null);
  const [tokenToastVisible, setTokenToastVisible] = useState(false);

  const videoCount = products.length;
  const estimatedMinutes = videoCount * ESTIMATED_MINUTES_PER_VIDEO;
  const estimatedTokens = videoCount * TOKEN_COST_PER_VIDEO;
  const remainingTokens = tokenBalance - estimatedTokens;
  const hasEnoughBalance = tokenBalance >= estimatedTokens;

  const templateDef = TEMPLATES.find((t) => t.id === selectedTemplate);

  const handleNotifyChange = (checked: boolean) => {
    if (!checked) {
      setNotify(false);
      setNotifyWarning(null);
      return;
    }
    if (typeof Notification === "undefined") {
      setNotifyWarning("Bu tarayıcı bildirimleri desteklemiyor.");
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        setNotify(true);
        setNotifyWarning(null);
      } else {
        setNotifyWarning(
          "Bildirim izni verilmedi. Tarayıcı ayarlarından izin verebilirsiniz.",
        );
      }
    });
  };

  const handleTokenAl = () => {
    setTokenToastVisible(true);
    setTimeout(() => setTokenToastVisible(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Üretimi onayla
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Üretim başladıktan sonra token bakiyenizden düşülecektir.
        </p>
        {campaignContext.name && (
          <p className="mt-2 text-xs text-muted-foreground/60">{campaignContext.name}</p>
        )}
      </header>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <SummaryCard
          icon={<FileVideo className="h-5 w-5 text-primary" />}
          label="Ürün sayısı"
          value={String(videoCount)}
        />
        <SummaryCard
          icon={<Clock className="h-5 w-5 text-primary" />}
          label="Tahmini süre"
          value={`~${estimatedMinutes} dk`}
        />
        <SummaryCard
          icon={<Coins className="h-5 w-5 text-primary" />}
          label="Tahmini token"
          value={`~${estimatedTokens}`}
        />
      </div>

      {/* Template summary */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Seçili şablon
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">
              {templateDef?.label ?? selectedTemplate}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {videoCount} ürün için bu şablon kullanılacak.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onEditTemplate} className="shrink-0">
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Düzenle
          </Button>
        </div>
      </div>

      {/* Balance summary */}
      <div
        className={cn(
          "mb-6 rounded-xl border p-4",
          !hasEnoughBalance
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border bg-card",
        )}
      >
        <div className="space-y-2.5">
          <BalanceRow
            label="Mevcut bakiye"
            value={`${tokenBalance.toLocaleString("tr-TR")} token`}
          />
          <BalanceRow
            label="Bu üretim"
            value={`−${estimatedTokens} token`}
            valueClassName={!hasEnoughBalance ? "text-amber-600 font-semibold" : undefined}
          />
          <div className="h-px bg-border" />
          <BalanceRow
            label="Tahmini kalan"
            value={`≈ ${remainingTokens.toLocaleString("tr-TR")} token`}
            valueClassName={!hasEnoughBalance ? "text-amber-600 font-semibold" : undefined}
          />
        </div>

        {!hasEnoughBalance && (
          <div className="mt-4 rounded-lg bg-amber-500/10 px-3 py-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-amber-700">
                  Bakiyeniz bu üretim için yetersiz.
                </p>
                <p className="mt-0.5 text-xs text-amber-600">
                  {Math.abs(remainingTokens)} token daha gerekiyor.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTokenAl}
                className="shrink-0 rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-700"
              >
                Token al
              </button>
            </div>
            {tokenToastVisible && (
              <p className="mt-2 text-xs text-amber-600">
                Token satın alma yakında kullanıma açılacak.
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
            <p className="text-sm font-medium text-foreground">
              Üretim bittiğinde bana bildir
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tarayıcı bildirimi gönderilecek.
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
          Geri
        </Button>
        <Button disabled={!hasEnoughBalance} onClick={() => onConfirm(notify)}>
          Üretimi başlat
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
  icon: React.ReactNode;
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
