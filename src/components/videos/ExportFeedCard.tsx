import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type FeedExport, VIDEO_ATTRIBUTE_OPTIONS } from "@/data/feedExports";

interface ExportFeedCardProps {
  feed: FeedExport;
  approvedCount: number;
  applied: boolean;
  selectedAttribute: string;
  onAttributeChange: (attr: string) => void;
  onApply: () => void;
}

const CHANNEL_BADGE: Record<string, { label: string; className: string }> = {
  google: { label: "G", className: "bg-blue-500 text-white" },
  meta: { label: "M", className: "bg-indigo-500 text-white" },
  criteo: { label: "C", className: "bg-orange-500 text-white" },
};

export function ExportFeedCard({
  feed,
  approvedCount,
  applied,
  selectedAttribute,
  onAttributeChange,
  onApply,
}: ExportFeedCardProps) {
  const [applying, setApplying] = useState(false);

  const badge = CHANNEL_BADGE[feed.channel] ?? {
    label: feed.channel[0].toUpperCase(),
    className: "bg-muted text-foreground",
  };

  const handleApply = () => {
    if (applying) return;
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      onApply();
    }, 500);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 transition-all",
        applied ? "border-success/25 bg-success/5" : "border-border bg-card",
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
            badge.className,
          )}
        >
          {badge.label}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">{feed.name}</p>
          <p className="truncate text-xs text-muted-foreground">{feed.source}</p>
        </div>
        {applied && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
            <Check className="h-3 w-3" strokeWidth={3} />
            Applied
          </span>
        )}
      </div>

      {/* Affected product count */}
      <p className="text-xs">
        <span className="font-semibold text-primary">{approvedCount}</span>
        <span className="text-muted-foreground"> of {feed.productCount} products</span>
      </p>

      {/* Video attribute dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Video attribute</label>
        <select
          value={selectedAttribute}
          onChange={(e) => onAttributeChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {VIDEO_ATTRIBUTE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Apply button */}
      <button
        type="button"
        onClick={handleApply}
        disabled={applying}
        className={cn(
          "inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
          applied
            ? "border border-success/25 bg-success/10 text-success hover:bg-success/20"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          applying && "cursor-not-allowed opacity-70",
        )}
      >
        {applying ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Applying...
          </>
        ) : applied ? (
          <>
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            Re-apply
          </>
        ) : (
          "Apply"
        )}
      </button>
    </div>
  );
}
