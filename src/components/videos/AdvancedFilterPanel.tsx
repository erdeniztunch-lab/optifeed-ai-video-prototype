import { cn } from "@/lib/utils";

export interface AdvFilters {
  imageMin: 0 | 1 | 2 | 3;
  statusFilter: "" | "no-video" | "ready";
  hasHistory: boolean;
}

interface Props {
  filters: AdvFilters;
  onChange: (filters: AdvFilters) => void;
  onClear: () => void;
  activeCount: number;
}

const IMAGE_OPTIONS: { label: string; value: AdvFilters["imageMin"] }[] = [
  { label: "Tümü", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
];

const STATUS_OPTIONS: { label: string; value: AdvFilters["statusFilter"] }[] = [
  { label: "Tümü", value: "" },
  { label: "Videosu yok", value: "no-video" },
  { label: "Hazır", value: "ready" },
];

export function AdvancedFilterPanel({ filters, onChange, onClear, activeCount }: Props) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start gap-8">
        {/* Görsel sayısı */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Ek görsel sayısı
          </span>
          <div className="flex items-center gap-1.5">
            {IMAGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...filters, imageMin: opt.value })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filters.imageMin === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video durumu */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Video durumu
          </span>
          <div className="flex items-center gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...filters, statusFilter: opt.value })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filters.statusFilter === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Geçmiş */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Video geçmişi
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...filters, hasHistory: !filters.hasHistory })}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filters.hasHistory
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-3 w-3 rounded-full border-2 transition-colors",
                filters.hasHistory ? "border-primary bg-primary" : "border-muted-foreground",
              )}
            />
            Daha önce video üretildi
          </button>
        </div>

        {/* Clear */}
        {activeCount > 0 && (
          <div className="ml-auto flex items-end pb-0.5">
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Gelişmiş filtreleri sıfırla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
