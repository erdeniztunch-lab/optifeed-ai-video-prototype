import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";

interface Props {
  product: Product;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function ProductCard({ product, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={() => onToggle(product.id)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-all shadow-card hover:shadow-soft",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-foreground/20",
      )}
    >
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

      <div className="flex flex-col gap-2 p-4">
        <div>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="mt-0.5 text-sm font-medium leading-tight text-foreground line-clamp-1">
            {product.name}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            product.status === "no-video"
              ? "bg-muted text-muted-foreground"
              : "bg-success-soft text-success",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              product.status === "no-video" ? "bg-muted-foreground" : "bg-success",
            )}
          />
          {product.status === "no-video" ? "No video" : "Ready for video"}
        </span>
      </div>
    </button>
  );
}
