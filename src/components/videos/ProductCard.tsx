import { Check } from "lucide-react";
import { Product, ProductTag } from "@/data/products";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  selected: boolean;
  onToggle: (id: string) => void;
  view?: "grid" | "list";
}

export function ProductCard({ product, selected, onToggle, view = "grid" }: Props) {
  const isList = view === "list";
  const secondaryTags = product.tags.filter((tag) => tag !== "no-video");

  return (
    <button
      type="button"
      onClick={() => onToggle(product.id)}
      className={cn(
        "group relative overflow-hidden border bg-card text-left transition-all",
        isList
          ? "grid grid-cols-1 gap-3 px-4 py-3 shadow-none md:grid-cols-[minmax(320px,1.7fr)_minmax(420px,1fr)] md:items-center md:gap-6"
          : "flex flex-col rounded-xl shadow-card hover:shadow-soft",
        isList &&
          (selected
            ? "border-l-4 border-l-primary border-y-primary/50 bg-accent/65"
            : "border-l-4 border-l-transparent hover:bg-muted/35"),
        !isList &&
          (selected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-foreground/20"),
      )}
    >
      {isList ? (
        <>
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

            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{product.brand}</p>

              <div className="mt-2 flex flex-wrap items-center gap-2 md:hidden">
                <StatusBadge status={product.status} />
                {secondaryTags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 md:w-full">
            <div className="hidden w-full items-center gap-2 md:flex">
              <StatusBadge status={product.status} />
            </div>
            <div className="hidden min-h-6 w-full items-center gap-2 pt-2 md:flex">
              {secondaryTags.length > 0 ? (
                secondaryTags.map((tag) => <TagBadge key={tag} tag={tag} />)
              ) : (
                <span className="text-[11px] font-medium text-transparent">placeholder</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
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
          </div>

          <div className="flex min-w-0 flex-col gap-2 p-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <p className="mt-0.5 line-clamp-1 text-sm font-medium leading-tight text-foreground">
                {product.name}
              </p>
            </div>
            <StatusBadge status={product.status} />
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

function TagBadge({ tag }: { tag: ProductTag }) {
  return (
    <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {tag === "best-seller" ? "Best seller" : "Recent"}
    </span>
  );
}
