import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Download, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CHANNELS } from "@/data/channels";
import { ChannelToggleCard } from "./ChannelToggleCard";

interface ExportStepProps {
  approvedCount: number;
  onComplete: (channelNames: string[]) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function ExportStep({ approvedCount, onComplete, onSkip, onBack }: ExportStepProps) {
  const { t } = useTranslation();
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const canSend =
    selectedChannelIds.length > 0 &&
    selectedChannelIds.some((id) => CHANNELS.find((c) => c.id === id)?.isConnected);

  const handleToggle = (channelId: string) => {
    setSelectedChannelIds((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId],
    );
  };

  const handleConnectMock = (channelName: string) => {
    toast(t("export.channel.comingSoon", { name: channelName }));
  };

  const handleZipDownload = () => {
    toast(t("export.zip.toast"));
  };

  const handleSend = () => {
    if (!canSend || isSending) return;
    setIsSending(true);
    setTimeout(() => {
      const channelNames = CHANNELS.filter((c) => selectedChannelIds.includes(c.id)).map(
        (c) => c.name,
      );
      onComplete(channelNames);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 pb-32 md:px-10">
      <section className="rounded-[18px] border border-border bg-card p-6 shadow-sm md:p-10">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-start justify-between gap-5">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{t("export.title")}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("export.subtitle")}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            {t("export.approved", { count: approvedCount })}
          </span>
        </header>

        {/* Channel toggle cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CHANNELS.map((channel) => (
            <ChannelToggleCard
              key={channel.id}
              channel={channel}
              approvedCount={approvedCount}
              selected={selectedChannelIds.includes(channel.id)}
              onToggle={() => handleToggle(channel.id)}
              onConnectMock={() => handleConnectMock(channel.name)}
            />
          ))}
        </div>

        {/* ZIP affordance */}
        <div className="mt-10 border-t border-border pt-5">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">
            {t("export.zip.downloadOnly")}
          </p>
          <button
            type="button"
            onClick={handleZipDownload}
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-muted/25 px-4 py-3.5 text-left transition-colors hover:border-primary/30 hover:bg-muted/45"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground">
                <Download className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{t("export.zip.label")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("export.zip.desc", { count: approvedCount })}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground">
              {t("export.zip.badge")}
            </span>
          </button>
        </div>
      </section>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {t("common.back")}
          </Button>

          <div className="flex items-center gap-3">
            {!canSend && (
              <p className="hidden text-xs text-muted-foreground/60 sm:block">
                {t("export.hint")}
              </p>
            )}
            <button
              type="button"
              onClick={onSkip}
              className={cn(
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isSending && "pointer-events-none opacity-50",
              )}
            >
              {t("export.skip")}
            </button>
            <Button disabled={!canSend || isSending} onClick={handleSend}>
              {isSending ? (
                <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{t("export.sending")}</>
              ) : (
                <><Send className="mr-1.5 h-3.5 w-3.5" />{t("export.send")}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
