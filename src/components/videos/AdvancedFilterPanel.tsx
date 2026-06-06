import { useTranslation } from "react-i18next";
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

export function AdvancedFilterPanel({ filters, onChange, onClear, activeCount, categoryOptions, brandOptions }: Props) {
  const { t } = useTranslation();

  const IMAGE_OPTIONS: { label: string; value: AdvFilters["imageReadiness"] }[] = [
    { label: t("filters.imageReadiness.all"), value: "" },
    { label: t("filters.imageReadiness.hasExtra"), value: "has-extra" },
    { label: t("filters.imageReadiness.noExtra"), value: "no-extra" },
  ];

  const STATUS_OPTIONS: { label: string; value: AdvFilters["statusFilter"] }[] = [
    { label: t("filters.status.all"), value: "" },
    { label: t("filters.status.noVideo"), value: "no-video" },
    { label: t("filters.status.ready"), value: "ready" },
  ];

  const SORT_OPTIONS: { label: string; value: AdvFilters["sortBy"] }[] = [
    { label: t("filters.sort.recent"), value: "recent" },
    { label: t("filters.sort.suitable"), value: "suitable" },
    { label: t("filters.sort.noVideoYet"), value: "no-video-yet" },
    { label: t("filters.sort.name"), value: "name" },
  ];

  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start gap-8">
        {/* Category */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("filters.category.label")}
          </span>
          <select
            aria-label={t("filters.category.label")}
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none"
          >
            <option value="">{t("filters.category.all")}</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("filters.brand.label")}
          </span>
          <select
            aria-label={t("filters.brand.label")}
            value={filters.brand}
            onChange={(e) => onChange({ ...filters, brand: e.target.value })}
            className="cursor-pointer rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground focus:outline-none"
          >
            <option value="">{t("filters.brand.all")}</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Image readiness */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("filters.imageReadiness.label")}
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
                  filters.imageReadiness === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video status */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("filters.status.label")}
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

        {/* History */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("filters.history.label")}
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
            {t("filters.history.toggle")}
          </button>
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("filters.sort.label")}
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
              {t("filters.clear")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
