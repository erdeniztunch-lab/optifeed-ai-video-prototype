import { Check, History } from "lucide-react";
import { Product, VideoHistoryEntry } from "@/data/products";
import { StackedImageIndicator } from "./StackedImageIndicator";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  selected: boolean;
  onToggle: (id: string) => void;
  view?: "grid" | "list";
  disabled?: boolean;
}

export function ProductCard({ product, selected, onToggle, view = "grid", disabled = false }: Props) {
  const isList = view === "list";

  const handleClick = () => {
    if (disabled && !selected) return;
    onToggle(product.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group relative overflow-hidden border bg-card text-left transition-all",
        isList
          ? "grid grid-cols-1 gap-3 px-4 py-3 shadow-none md:grid-cols-[minmax(320px,1.7fr)_minmax(420px,1fr)] md:items-center md:gap-6"
          : "flex flex-col rounded-xl shadow-card hover:shadow-soft",
        isList &&
          (selected
            ? "border-l-4 border-l-primary border-y-primary/50 bg-accent/65"
            : disabled
              ? "border-l-4 border-l-transparent opacity-40 cursor-not-allowed"
              : "border-l-4 border-l-transparent hover:bg-muted/35"),
        !isList &&
          (selected
            ? "border-primary ring-2 ring-primary/20"
            : disabled
              ? "border-border opacity-40 cursor-not-allowed"
              : "border-border hover:border-foreground/20"),
      )}
    >
      {isList ? (
        <>
          {/* Left column: checkbox + image + name */}
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-transparent",
              )}
              aria-hidden="true"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>

            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <StackedImageIndicator count={product.additionalImageCount} />
            </div>

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{product.brand}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 md:hidden">
                <StatusBadge status={product.status} />
              </div>
            </div>
          </div>

          {/* Right column: status + metadata */}
          <div className="min-w-0">
            <div className="hidden items-center gap-2 md:flex">
              <StatusBadge status={product.status} />
              {product.videoHistory.length > 0 && (
                <HistoryBadge history={product.videoHistory} compact />
              )}
            </div>
            <div className="mt-1.5 hidden flex-col gap-0.5 md:flex">
              <MetaLine label="ID" value={product.productId} />
              <MetaLine label="Group" value={product.itemGroupId} />
              <MetaLine label="Category" value={product.category} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Image with stacked indicator */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div
              className={cn(
                "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/80 bg-white/90 text-transparent",
              )}
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </div>
            <StackedImageIndicator count={product.additionalImageCount} />
          </div>

          {/* Card body */}
          <div className="flex min-w-0 flex-col gap-2 p-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{product.brand}</p>
              <p className="mt-0.5 line-clamp-1 text-sm font-medium leading-tight text-foreground">
                {product.name}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <StatusBadge status={product.status} />
              <span className="text-[10px] text-muted-foreground/70">{product.category}</span>
            </div>
            {product.videoHistory.length > 0 && (
              <HistoryBadge history={product.videoHistory} />
            )}
            <div className="flex flex-col gap-0.5">
              <MetaLine label="ID" value={product.productId} />
              <MetaLine label="Group" value={product.itemGroupId} />
            </div>
          </div>
        </>
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: Product["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        status === "no-video"
          ? "bg-amber-100 text-amber-800"
          : "bg-success-soft text-success",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "no-video" ? "bg-amber-600" : "bg-success",
        )}
      />
      {status === "no-video" ? "No video" : "Ready"}
    </span>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[10px] text-muted-foreground/70">
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
}

function HistoryBadge({ history, compact = false }: { history: VideoHistoryEntry[]; compact?: boolean }) {
  const latest = history[history.length - 1];
  const tooltipText = [
    `Son üretim: ${latest.date}`,
    `Kampanya: ${latest.campaignName}`,
    "Bu ürünü tekrar seçerseniz yeni bir video üretimi başlatılır.",
  ].join("\n");

  if (compact) {
    return (
      <span
        title={tooltipText}
        className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-200 cursor-default"
      >
        <History className="h-2.5 w-2.5 shrink-0" />
        {history.length}× geçmiş
      </span>
    );
  }

  return (
    <span
      title={tooltipText}
      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-200 cursor-default"
    >
      <History className="h-2.5 w-2.5 shrink-0" />
      Daha önce video üretildi
    </span>
  );
}
