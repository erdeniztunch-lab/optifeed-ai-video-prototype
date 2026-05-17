import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Channel } from "@/data/channels";

interface ChannelToggleCardProps {
  channel: Channel;
  selected: boolean;
  onToggle: () => void;
  onConnectMock: () => void;
}

export function ChannelToggleCard({
  channel,
  selected,
  onToggle,
  onConnectMock,
}: ChannelToggleCardProps) {
  const { isConnected, name, description, accountName } = channel;

  return (
    <div
      role={isConnected ? "button" : undefined}
      tabIndex={isConnected ? 0 : undefined}
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
        "rounded-2xl border p-4 transition-all",
        isConnected && selected && "border-primary bg-primary/5 ring-2 ring-primary/20",
        isConnected && !selected &&
          "cursor-pointer border-border bg-card hover:border-foreground/20",
        !isConnected && "border-border bg-muted/30 opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground">{name}</p>
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
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          {accountName && (
            <p className="mt-1 text-xs text-muted-foreground/60">{accountName}</p>
          )}
        </div>

        {isConnected ? (
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              selected
                ? "border-primary bg-primary"
                : "border-border bg-background",
            )}
          >
            {selected && (
              <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConnectMock();
            }}
            className="shrink-0 whitespace-nowrap text-xs font-medium text-primary hover:underline"
          >
            {name} hesabını bağla →
          </button>
        )}
      </div>
    </div>
  );
}
