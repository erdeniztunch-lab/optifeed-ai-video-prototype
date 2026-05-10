import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { PRODUCT_SELECTION_LIMIT } from "@/data/tokens";
import { ProductCard } from "./ProductCard";
import { CostEstimateBar } from "./CostEstimateBar";

interface Props {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onContinue: () => void;
  tokenBalance: number;
}

export function SelectStep({ selectedIds, setSelectedIds, onContinue, tokenBalance }: Props) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const atLimit = selectedIds.length >= PRODUCT_SELECTION_LIMIT;

  const products = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter((p) =>
      `${p.name} ${p.brand} ${p.productId} ${p.itemGroupId}`
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

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
      const alreadySelected = selectedIds.filter((id) => products.some((p) => p.id === id));
      const remaining = PRODUCT_SELECTION_LIMIT - (selectedIds.length - alreadySelected.length);
      const toAdd = products
        .filter((p) => !selectedIds.includes(p.id))
        .slice(0, remaining);
      setSelectedIds(Array.from(new Set([...selectedIds, ...toAdd.map((p) => p.id)])));
    }
  };

  const canSelectMore = products.some((p) => !selectedIds.includes(p.id)) && !atLimit;

  return (
    <div className="px-6 pb-32 pt-2 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Video oluşturmak için ürün seçin
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            En fazla {PRODUCT_SELECTION_LIMIT} ürün seçin. Maliyet ve süre tahmini seçiminize göre güncellenir.
          </p>
        </header>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {/* Left: selection summary + select-all */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold",
                atLimit
                  ? "bg-primary/10 text-primary"
                  : "bg-accent text-accent-foreground",
              )}
            >
              {selectedIds.length} seçildi
            </div>

            {products.length > 0 && (
              <button
                type="button"
                onClick={toggleSelectAll}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                {allVisibleSelected
                  ? "Seçimi temizle"
                  : canSelectMore
                    ? `Tümünü seç (maks. ${PRODUCT_SELECTION_LIMIT})`
                    : "Seçimi temizle"}
              </button>
            )}
          </div>

          {/* Right: sort label + view toggle + search */}
          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
            {/* Sort indicator */}
            <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Son eklenen</span>
            </div>

            {/* View toggle */}
            <div className="inline-flex rounded-full border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  view === "grid"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Kart
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  view === "list"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="h-4 w-4" />
                Liste
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="İsim, ID veya grup ile ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
          </div>
        </div>

        {/* Limit warning banner */}
        {atLimit && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            En fazla {PRODUCT_SELECTION_LIMIT} ürün seçebilirsiniz. Farklı bir ürün seçmek için mevcut seçimi kaldırın.
          </div>
        )}

        {/* Product list/grid */}
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "overflow-hidden rounded-xl border border-border bg-card divide-y divide-border",
          )}
        >
          {view === "list" && products.length > 0 && (
            <div className="hidden grid-cols-[minmax(320px,1.7fr)_minmax(420px,1fr)] items-center gap-6 bg-muted/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:grid">
              <p>Ürün</p>
              <p>Detaylar</p>
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

        {/* Empty search state */}
        {products.length === 0 && (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center text-sm text-muted-foreground">
            Aramanızla eşleşen ürün bulunamadı.
          </div>
        )}
      </div>

      {/* Sticky cost estimate bar */}
      <CostEstimateBar
        selectedCount={selectedIds.length}
        tokenBalance={tokenBalance}
        onContinue={onContinue}
      />
    </div>
  );
}
