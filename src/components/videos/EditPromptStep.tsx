import { useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { TOKEN_COST_PER_VIDEO } from "@/data/tokens";

const EXAMPLE_PROMPTS = [
  "Süet, tokalı, babet — zarif ve minimal sunum",
  "Siyah arka plan, dramatik aydınlatma, premium his",
  "Lifestyle sahnesi, doğal ışık, soft renk paleti",
  "Ürün dönerek gösterilsin, beyaz fon, temiz ve sade",
  "Yaz teması, canlı renkler, enerjik tempo",
  "Açık hava sahnesi, outdoor vibe, aktif kullanım",
];

interface EditPromptStepProps {
  product: Product;
  tokenBalance: number;
  onRegenerate: (productId: string) => void;
  onCancel: () => void;
}

export function EditPromptStep({
  product,
  tokenBalance,
  onRegenerate,
  onCancel,
}: EditPromptStepProps) {
  const [promptText, setPromptText] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const insufficient = tokenBalance < TOKEN_COST_PER_VIDEO;

  const handleChipClick = (chip: string) => {
    setPromptText((prev) => {
      if (prev.trim()) return `${prev.trim()}, ${chip.toLowerCase()}`;
      return chip;
    });
  };

  const handleRegenerate = () => {
    if (isRegenerating || insufficient) return;
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      onRegenerate(product.id);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-10 md:px-10">
      {/* Product context */}
      <div className="mb-8 flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-1 text-base font-semibold text-foreground">{product.name}</p>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>
      </div>

      <h2 className="mb-1 text-xl font-semibold text-foreground">Edit prompt</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Describe how you'd like the video to look. Be specific — style, mood, setting, presentation.
      </p>

      {/* Free text area */}
      <div className="mb-4">
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="e.g. Clean white background, product rotating slowly, soft shadows, premium feel..."
          rows={4}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground/60">
          {promptText.length} / 500
        </p>
      </div>

      {/* Example prompt chips */}
      <div className="mb-8">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Example prompts — click to add
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Cost confirmation */}
      <div
        className={cn(
          "mb-6 rounded-xl border p-4",
          insufficient ? "border-amber-500/25 bg-amber-500/5" : "border-border bg-card",
        )}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Regeneration cost</span>
          <span className="font-semibold text-foreground">{TOKEN_COST_PER_VIDEO} tokens</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your balance</span>
          <span
            className={cn(
              "font-semibold",
              insufficient ? "text-amber-500" : "text-foreground",
            )}
          >
            {tokenBalance} tokens
          </span>
        </div>
        {insufficient && (
          <p className="mt-2 text-xs text-amber-500">
            Insufficient balance. Top up to regenerate this video.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isRegenerating}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating || insufficient}
          className="flex-1"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate video
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
