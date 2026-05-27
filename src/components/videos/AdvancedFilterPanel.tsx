import { cn } from "@/lib/utils";

export interface AdvFilters {
  imageReadiness: "" | "has-extra" | "no-extra";
  statusFilter: "" | "no-video" | "ready";
  hasHistory: boolean;
  category: string;
  brand: string;
  sortBy: "recent" | "name" | "suitable" | "no-video-yet";
}


interface Props {
  filters: AdvFilters;
  onChange: (filters: AdvFilters) => void;
  onClear: () => void;
  activeCount: number;
  categoryOptions: string[];
  brandOptions: string[];
}

const IMAGE_OPTIONS: { label: string; value: AdvFilters["imageReadiness"] }[] = [
  { label: "Tümü", value: "" },
  { label: "Ek görsel var", value: "has-extra" },
  { label: "Ek görsel yok", value: "no-extra" },
];

const STATUS_OPTIONS: { label: string; value: AdvFilters["statusFilter"] }[] = [
  { label: "Tümü", value: "" },
  { label: "Videosu yok", value: "no-video" },
  { label: "Hazır", value: "ready" },
];

const SORT_OPTIONS: { label: string; value: AdvFilters["sortBy"] }[] = [
  { label: "Son eklenen", value: "recent" },
  { label: "Video için uygun", value: "suitable" },
  { label: "Videosu olmayanlar", value: "no-video-yet" },
  { label: "Ürün adı", value: "name" },
];

export function AdvancedFilterPanel({ filters, onChange, onClear, activeCount, categoryOptions, brandOptions }: Props) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start gap-8">
        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kategori
          </span>
          <select
            aria-label="Kategori filtresi"
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none"
          >
            <option value="">Tüm kategoriler</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Marka */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Marka
          </span>
          <select
            aria-label="Marka filtresi"
            value={filters.brand}
            onChange={(e) => onChange({ ...filters, brand: e.target.value })}
            className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none"
          >
            <option value="">Tüm markalar</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Görsel hazırlık */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Görsel hazırlık
          </span>
          <div className="flex items-center gap-1.5">
            {IMAGE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                aria-pressed={filters.imageReadiness === opt.value}
                onClick={() => onChange({ ...filters, imageReadiness: opt.value })}
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
                aria-pressed={filters.statusFilter === opt.value}
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
            aria-pressed={filters.hasHistory}
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

        {/* Sıralama */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sıralama
          </span>
          <div className="flex items-center gap-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={filters.sortBy === opt.value}
                onClick={() => onChange({ ...filters, sortBy: opt.value })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filters.sortBy === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
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
