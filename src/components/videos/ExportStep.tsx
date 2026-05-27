import { useState } from "react";
import { ArrowLeft, Check, Download, Loader2, Send } from "lucide-react";
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
    toast(`${channelName}: Bu adım yakında`);
  };

  const handleZipDownload = () => {
    toast("Demo modunda indirme simüle edildi.");
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
    <div className="mx-auto max-w-2xl px-6 py-10 pb-32 md:px-10">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/15">
          <Check className="h-6 w-6 text-success" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          {approvedCount} video onaylandı
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Videoları reklam kanallarınıza gönderin veya ZIP olarak indirin. Sonra da
          gönderebilirsiniz.
        </p>
      </header>

      {/* Channel toggle cards */}
      <div className="mb-4 space-y-3">
        {CHANNELS.map((channel) => (
          <ChannelToggleCard
            key={channel.id}
            channel={channel}
            selected={selectedChannelIds.includes(channel.id)}
            onToggle={() => handleToggle(channel.id)}
            onConnectMock={() => handleConnectMock(channel.name)}
          />
        ))}
      </div>

      {/* Secondary download affordance */}
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs font-medium text-muted-foreground">Sadece indirmek için</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={handleZipDownload}
        className="mb-8 flex w-full items-center justify-between gap-4 rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/50"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground">
            <Download className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">ZIP indir</p>
            <p className="text-xs text-muted-foreground">
              {approvedCount} video, kanal seçmeden demo indirme akışı
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground">
          ZIP indir
        </span>
      </button>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Geri
          </Button>

          <div className="flex items-center gap-3">
            {!canSend && (
              <p className="hidden text-xs text-muted-foreground/60 sm:block">
                Göndermek için en az bir kanal seçin
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
              Atla (taslak olarak kaydet)
            </button>
            <Button disabled={!canSend || isSending} onClick={handleSend}>
              {isSending ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Gönder →
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
