import { useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { TOKEN_COST_PER_VIDEO } from "@/data/tokens";
import { SECTOR_OPTIONS, THEME_OPTIONS, BACKGROUND_OPTIONS } from "@/data/guidedPromptOptions";
import { type GuidedPrompt, type TemplateId } from "@/types/video-flow";

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
  template: TemplateId;
  guidedPrompt: GuidedPrompt;
  onRegenerate: (productId: string, promptText: string) => void;
  onCancel: () => void;
}

export function EditPromptStep({
  product,
  tokenBalance,
  template: _template,
  guidedPrompt,
  onRegenerate,
  onCancel,
}: EditPromptStepProps) {
  const [sector, setSector] = useState(guidedPrompt.sector ?? "");
  const [theme, setTheme] = useState(guidedPrompt.theme ?? "");
  const [background, setBackground] = useState(guidedPrompt.background ?? "");
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
      onRegenerate(product.id, promptText);
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

      <h2 className="mb-1 text-xl font-semibold text-foreground">Prompt Düzenle</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Videoyu nasıl görmek istediğinizi açıklayın: stil, atmosfer, sahne, sunum.
      </p>

      {/* Guided dropdowns */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Sektör</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Seçin...</option>
            {SECTOR_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Tema</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Seçin...</option>
            {THEME_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Arka Plan</label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Seçin...</option>
            {BACKGROUND_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Free text area */}
      <div className="mb-4">
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Örn. Beyaz fon, ürün yavaşça dönsün, yumuşak gölgeler, premium his..."
          rows={4}
          maxLength={200}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground/60">
          {promptText.length} / 200
        </p>
      </div>

      {/* Example prompt chips */}
      <div className="mb-8">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Örnek promptlar — eklemek için tıklayın
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
          <span className="text-muted-foreground">Yeniden üretim maliyeti</span>
          <span className="font-semibold text-foreground">{TOKEN_COST_PER_VIDEO} token</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Bakiyeniz</span>
          <span
            className={cn(
              "font-semibold",
              insufficient ? "text-amber-500" : "text-foreground",
            )}
          >
            {tokenBalance} token
          </span>
        </div>
        {insufficient && (
          <p className="mt-2 text-xs text-amber-500">
            Bakiye yetersiz. Yeniden üretim yapılamaz.
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
          İptal
        </Button>
        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating || insufficient}
          className="flex-1"
        >
          {isRegenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Üretiliyor...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Yeniden üret
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
