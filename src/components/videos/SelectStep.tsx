import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PRODUCTS, ProductTag } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface Props {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onContinue: () => void;
}

const FILTERS: { id: ProductTag; label: string }[] = [
  { id: "no-video", label: "No video" },
  { id: "best-seller", label: "Best sellers" },
  { id: "recent", label: "Recently added" },
];

export function SelectStep({ selectedIds, setSelectedIds, onContinue }: Props) {
  const [filter, setFilter] = useState<ProductTag>("no-video");
  const [query, setQuery] = useState("");

  const products = useMemo(() => {
    return PRODUCTS.filter((p) => p.tags.includes(filter)).filter((p) =>
      `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [filter, query]);

  const toggle = (id: string) => {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    );
  };

  return (
    <div className="px-6 pb-32 pt-2 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Select products to create videos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with products that are missing video assets.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  filter === f.id
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              selected={selectedIds.includes(p.id)}
              onToggle={toggle}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="rounded-xl border border-dashed bg-card p-12 text-center text-sm text-muted-foreground">
            No products match your filters.
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      {selectedIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64 animate-fade-in">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
            <p className="text-sm font-medium text-foreground">
              {selectedIds.length} product{selectedIds.length === 1 ? "" : "s"} selected
            </p>
            <Button size="lg" onClick={onContinue}>
              Generate video{selectedIds.length === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
