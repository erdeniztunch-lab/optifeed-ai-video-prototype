import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen, LayoutGrid, List, PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { PRODUCT_SELECTION_LIMIT } from "@/data/tokens";
import { ProductCard } from "./ProductCard";
import { CostEstimateBar } from "./CostEstimateBar";
import { OnboardingBanner } from "./OnboardingBanner";
import { EmptyState } from "./EmptyState";
import { AdvancedFilterPanel, type AdvFilters } from "./AdvancedFilterPanel";

const DEFAULT_ADV_FILTERS: AdvFilters = {
  imageReadiness: "",
  statusFilter: "",
  hasHistory: false,
  category: "",
  brand: "",
  sortBy: "recent",
};

interface Props {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onContinue: () => void;
  tokenBalance: number;
  onGoToLibrary: () => void;
}

export function SelectStep({ selectedIds, setSelectedIds, onContinue, tokenBalance, onGoToLibrary }: Props) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [advPanelOpen, setAdvPanelOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState<AdvFilters>(DEFAULT_ADV_FILTERS);

  const atLimit = selectedIds.length >= PRODUCT_SELECTION_LIMIT;

  const categoryOptions = useMemo(
    () => [...new Set(PRODUCTS.map((p) => p.category))].sort(),
    [],
  );
  const brandOptions = useMemo(
    () => [...new Set(PRODUCTS.map((p) => p.brand))].sort(),
    [],
  );

  const advActiveCount = (advFilters.imageReadiness !== "" ? 1 : 0)
    + (advFilters.statusFilter !== "" ? 1 : 0)
    + (advFilters.hasHistory ? 1 : 0)
    + (advFilters.category !== "" ? 1 : 0)
    + (advFilters.brand !== "" ? 1 : 0)
    + (advFilters.sortBy !== "recent" ? 1 : 0);

  const products = useMemo(() => {
    const q = query.toLowerCase();
    let filtered = !q
      ? [...PRODUCTS]
      : PRODUCTS.filter((p) =>
          `${p.name} ${p.brand} ${p.productId} ${p.itemGroupId}`
            .toLowerCase()
            .includes(q),
        );
    if (advFilters.category) filtered = filtered.filter((p) => p.category === advFilters.category);
    if (advFilters.brand) filtered = filtered.filter((p) => p.brand === advFilters.brand);
    if (advFilters.imageReadiness === "has-extra") filtered = filtered.filter((p) => p.additionalImageCount > 0);
    else if (advFilters.imageReadiness === "no-extra") filtered = filtered.filter((p) => p.additionalImageCount === 0);
    if (advFilters.statusFilter) filtered = filtered.filter((p) => p.status === advFilters.statusFilter);
    if (advFilters.hasHistory) filtered = filtered.filter((p) => p.videoHistory && p.videoHistory.length > 0);
    switch (advFilters.sortBy) {
      case "name": return filtered.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      case "suitable": return filtered.sort((a, b) => b.additionalImageCount - a.additionalImageCount);
      case "no-video-yet": return filtered.sort((a, b) => {
        const aHas = a.videoHistory.length > 0 ? 1 : 0;
        const bHas = b.videoHistory.length > 0 ? 1 : 0;
        return aHas - bHas;
      });
      default: return filtered;
    }
  }, [query, advFilters]);

  const allVisibleSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (!atLimit) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(selectedIds.filter((id) => !products.some((p) => p.id === id)));
    } else {
      const remaining = PRODUCT_SELECTION_LIMIT - selectedIds.length;
      const toAdd = products
        .filter((p) => !selectedIds.includes(p.id))
        .slice(0, remaining);
      setSelectedIds(Array.from(new Set([...selectedIds, ...toAdd.map((p) => p.id)])));
    }
  };

  const canSelectMore = products.some((p) => !selectedIds.includes(p.id)) && !atLimit;

  const hasActiveFilters = !!query || advActiveCount > 0;
  const clearFilters = () => {
    setQuery("");
    setAdvFilters(DEFAULT_ADV_FILTERS);
  };

  const clearAdvFilters = () => {
    setAdvFilters(DEFAULT_ADV_FILTERS);
  };

  return (
    <div className="px-6 pb-32 pt-2 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("select.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("select.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToLibrary}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            {t("select.libraryBtn")}
          </button>
        </header>

        <OnboardingBanner />

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold",
                atLimit ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground",
              )}
            >
              {t("select.selectedCount", { count: selectedIds.length })}
            </div>

            {products.length > 0 && (
              <button
                type="button"
                onClick={toggleSelectAll}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {allVisibleSelected
                  ? t("select.deselectAll")
                  : canSelectMore
                    ? t("select.selectAll", { limit: PRODUCT_SELECTION_LIMIT })
                    : t("select.deselectAll")}
              </button>
            )}
          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            <button
              type="button"
              onClick={() => setAdvPanelOpen((v) => !v)}
              className={cn(
                "hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:flex",
                advPanelOpen || advActiveCount > 0
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t("select.advancedFilter")}
              {advActiveCount > 0 && (
                <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground leading-none">
                  {advActiveCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div role="group" aria-label={t("select.view.grid")} className="inline-flex rounded-full border border-border bg-card p-1">
              <button
                type="button"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  view === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                {t("select.view.grid")}
              </button>
              <button
                type="button"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  view === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="h-4 w-4" aria-hidden="true" />
                {t("select.view.list")}
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label={t("select.search.placeholder")}
                placeholder={t("select.search.placeholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
          </div>
        </div>

        {advPanelOpen && (
          <AdvancedFilterPanel
            filters={advFilters}
            onChange={setAdvFilters}
            onClear={clearAdvFilters}
            activeCount={advActiveCount}
            categoryOptions={categoryOptions}
            brandOptions={brandOptions}
          />
        )}

        {atLimit && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            {t("select.limitWarning", { limit: PRODUCT_SELECTION_LIMIT })}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              {t("select.showing", { count: products.length })}
            </p>
            <div
              className={cn(
                view === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "overflow-hidden rounded-xl border border-border bg-card divide-y divide-border",
              )}
            >
              {view === "list" && products.length > 0 && (
                <div className="hidden grid-cols-[minmax(320px,1.7fr)_minmax(420px,1fr)] items-center gap-6 bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:grid">
                  <p>{t("select.headers.product")}</p>
                  <p>{t("select.headers.details")}</p>
                </div>
              )}
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  selected={selectedIds.includes(p.id)}
                  onToggle={toggle}
                  view={view}
                  disabled={atLimit && !selectedIds.includes(p.id)}
                />
              ))}
            </div>

            {products.length === 0 && PRODUCTS.length > 0 && (
              <EmptyState
                icon={Search}
                title={t("select.empty.filtered.title")}
                description={t("select.empty.filtered.desc")}
                actionLabel={hasActiveFilters ? t("select.empty.filtered.action") : undefined}
                onAction={hasActiveFilters ? clearFilters : undefined}
              />
            )}
            {PRODUCTS.length === 0 && (
              <EmptyState
                icon={PackageSearch}
                title={t("select.empty.catalog.title")}
                description={t("select.empty.catalog.desc")}
              />
            )}
          </>
        )}
      </div>

      <CostEstimateBar
        selectedCount={selectedIds.length}
        tokenBalance={tokenBalance}
        onContinue={onContinue}
      />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
