import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, PartyPopper } from "lucide-react";
import { TOKEN_COST_PER_VIDEO } from "@/data/tokens";

const FIRST_CAMPAIGN_KEY = "has_completed_first_campaign";

function readFirstCampaign(): boolean {
  try { return localStorage.getItem(FIRST_CAMPAIGN_KEY) === "true"; } catch { return false; }
}
function writeFirstCampaign() {
  try { localStorage.setItem(FIRST_CAMPAIGN_KEY, "true"); } catch { /* incognito */ }
}

interface Props {
  count: number;
  exportedFeeds: string[];
  onAnother: () => void;
  onViewProducts: () => void;
}

export function SuccessStep({ count, exportedFeeds, onAnother, onViewProducts }: Props) {
  const { t } = useTranslation();

  const [isFirst] = useState(() => {
    const first = !readFirstCampaign();
    writeFirstCampaign();
    return first;
  });

  const channelLabel =
    exportedFeeds.length === 0
      ? t("success.summary.channelDraft")
      : exportedFeeds.length === 1
        ? exportedFeeds[0]
        : exportedFeeds.length === 2
          ? `${exportedFeeds[0]} + ${exportedFeeds[1]}`
          : t("success.summary.channelCount", { count: exportedFeeds.length });

  const tokenSpent = count * TOKEN_COST_PER_VIDEO;

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-6 py-8">
      <div className="w-full max-w-md animate-fade-in text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <Check className="h-7 w-7 text-success" strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("success.title")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("success.subtitle", { count })}
        </p>

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-3 py-4">
            <span className="text-xs text-muted-foreground">{t("success.summary.videosLabel")}</span>
            <span className="text-lg font-bold text-foreground">
              {t("success.summary.videoCount", { count })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-3 py-4">
            <span className="text-xs text-muted-foreground">{t("success.summary.channelLabel")}</span>
            <span className="text-lg font-bold text-foreground">{channelLabel}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-3 py-4">
            <span className="text-xs text-muted-foreground">{t("success.summary.spentLabel")}</span>
            <span className="text-lg font-bold text-foreground">
              {t("success.summary.tokenCount", { count: tokenSpent })}
            </span>
          </div>
        </div>

        {isFirst && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-left">
            <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">{t("success.firstCampaign")}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <Button size="lg" onClick={onAnother}>{t("success.newVideo")}</Button>
          <Button size="lg" variant="outline" onClick={onViewProducts}>{t("success.campaigns")}</Button>
        </div>
      </div>
    </div>
  );
}
