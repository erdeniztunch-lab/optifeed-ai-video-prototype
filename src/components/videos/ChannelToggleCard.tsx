import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Channel } from "@/data/channels";

interface ChannelToggleCardProps {
  channel: Channel;
  approvedCount: number;
  selected: boolean;
  onToggle: () => void;
  onConnectMock: () => void;
}

const platformLabel: Record<Channel["platform"], string> = {
  meta: "Meta",
  google: "Google",
  tiktok: "TikTok",
};

const platformSubLabel: Record<Channel["platform"], string> = {
  meta: "E-commerce Feed",
  google: "E-commerce Feed",
  tiktok: "Catalog Feed",
};

export function ChannelToggleCard({
  channel,
  approvedCount,
  selected,
  onToggle,
  onConnectMock,
}: ChannelToggleCardProps) {
  const { isConnected, name, description, accountName, platform } = channel;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-background p-6 transition-all",
        isConnected && selected && "border-primary/70 shadow-sm ring-2 ring-primary/10",
        isConnected && !selected && "border-border hover:border-primary/30 hover:shadow-sm",
        !isConnected && "border-border bg-muted/20 opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-24 shrink-0 flex-col justify-center">
            <p
              className={cn(
                "text-lg font-bold leading-none",
                platform === "meta" && "text-blue-600",
                platform === "google" && "text-foreground",
                platform === "tiktok" && "text-foreground",
              )}
            >
              {platformLabel[platform]}
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
              {platformSubLabel[platform]}
            </p>
          </div>

          <div className="min-w-0">
            <p className="line-clamp-1 text-base font-semibold text-foreground">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {accountName ?? "Hesap bağlantısı bekleniyor"}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {approvedCount} video
        </span>
      </div>

      <div className="mt-8 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Gönderim hedefi</p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              isConnected ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
            )}
          >
            {isConnected ? "Bağlı" : "Bağlı değil"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-sm text-foreground shadow-sm">
            <span className="truncate">{description}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>

          {isConnected ? (
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={selected}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition-colors",
                selected
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              {selected ? "Seçildi" : "Seç"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onConnectMock}
              className="h-11 shrink-0 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Bağla
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
