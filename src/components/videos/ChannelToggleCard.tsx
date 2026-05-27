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
    <div
      role={isConnected ? "button" : undefined}
      tabIndex={isConnected ? 0 : undefined}
      aria-pressed={isConnected ? selected : undefined}
      onClick={isConnected ? onToggle : undefined}
      onKeyDown={
        isConnected
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
      className={cn(
        "min-h-[230px] rounded-2xl border p-6 transition-all",
        isConnected && selected && "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/15",
        isConnected && !selected &&
          "cursor-pointer border-border bg-background hover:border-primary/30 hover:shadow-sm",
        !isConnected && "border-border bg-muted/25 opacity-70",
      )}
    >
      <div className="flex h-full flex-col justify-between gap-7">
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
              <div className="flex flex-wrap items-center gap-2">
                <p className="line-clamp-1 text-base font-semibold text-foreground">{name}</p>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    isConnected
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {isConnected ? "Bağlı" : "Bağlı değil"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{accountName ?? "Hesap bağlantısı bekleniyor"}</p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {approvedCount} video
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Gönderim hedefi</p>
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground shadow-sm">
              <span className="truncate">{description}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
            {isConnected ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
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
                onClick={(e) => {
                  e.stopPropagation();
                  onConnectMock();
                }}
                className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Bağla
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                  selected
                    ? "border-primary bg-primary"
                    : "border-border bg-background",
                )}
              >
                {selected && (
                  <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                )}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {selected ? "Gönderime eklendi" : "Gönderime ekle"}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {name} hesabını bağlayın
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
