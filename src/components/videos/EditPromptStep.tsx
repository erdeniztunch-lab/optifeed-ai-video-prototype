import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { TOKEN_COST_PER_VIDEO } from "@/data/tokens";
import { SECTOR_OPTIONS, THEME_OPTIONS, BACKGROUND_OPTIONS } from "@/data/guidedPromptOptions";
import { type GuidedPrompt, type TemplateId } from "@/types/video-flow";

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
  const { t } = useTranslation();

  const presetCategories = t("editPrompt.presets.categories", { returnObjects: true }) as { label: string; items: string[] }[];
  const optionLabels = t("editPrompt.optionLabels", { returnObjects: true }) as {
    sectors: string[];
    themes: string[];
    backgrounds: string[];
  };

  const [sector, setSector] = useState(guidedPrompt.sector ?? "");
  const [theme, setTheme] = useState(guidedPrompt.theme ?? "");
  const [background, setBackground] = useState(guidedPrompt.background ?? "");
  const [promptText, setPromptText] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const insufficient = tokenBalance < TOKEN_COST_PER_VIDEO;

  const handlePresetClick = (preset: string) => {
    setPromptText((prev) => {
      if (prev.toLowerCase().includes(preset.toLowerCase())) return prev;
      const trimmed = prev.trim();
      const next = trimmed ? `${trimmed}\n${preset}` : preset;
      if (next.length > 200) return prev;
      return next;
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
      <div className="mb-8 flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-1 text-base font-semibold text-foreground">{product.name}</p>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>
      </div>

      <h2 className="mb-1 text-xl font-semibold text-foreground">{t("editPrompt.title")}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t("editPrompt.subtitle")}</p>

      {/* Guided dropdowns */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { id: "edit-sector", label: t("editPrompt.fields.sector"), value: sector, onChange: setSector, options: SECTOR_OPTIONS, optionLabels: optionLabels.sectors },
          { id: "edit-theme", label: t("editPrompt.fields.theme"), value: theme, onChange: setTheme, options: THEME_OPTIONS, optionLabels: optionLabels.themes },
          { id: "edit-background", label: t("editPrompt.fields.background"), value: background, onChange: setBackground, options: BACKGROUND_OPTIONS, optionLabels: optionLabels.backgrounds },
        ].map(({ id, label, value, onChange, options, optionLabels }) => (
          <div key={id} className="flex flex-col gap-1">
            <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>
            <select
              id={id}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">{t("editPrompt.fields.placeholder")}</option>
              {options.map((o, index) => (
                <option key={o} value={o}>{optionLabels[index] ?? o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Preset categories */}
      <div className="mb-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          {t("editPrompt.presets.title")}
        </p>
        <div className="flex flex-col gap-4">
          {Array.isArray(presetCategories) && presetCategories.map((cat) => (
            <div key={cat.label}>
              <p className="mb-1.5 text-[11px] font-medium text-muted-foreground/70">{cat.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((preset) => {
                  const isActive = promptText.toLowerCase().includes(preset.toLowerCase());
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        isActive
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                      )}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free text area */}
      <div className="mb-8">
        <label htmlFor="edit-prompt-text" className="mb-1.5 block text-xs text-muted-foreground">
          {t("editPrompt.freeText.label")}
        </label>
        <textarea
          id="edit-prompt-text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder={t("editPrompt.freeText.placeholder")}
          rows={4}
          maxLength={200}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground/60">{promptText.length} / 200</p>
      </div>

      {/* Cost */}
      <div className={cn("mb-6 rounded-xl border p-4", insufficient ? "border-amber-500/25 bg-amber-500/5" : "border-border bg-card")}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("editPrompt.cost.label")}</span>
          <span className="font-semibold text-foreground">{TOKEN_COST_PER_VIDEO} {t("editPrompt.cost.unit")}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("editPrompt.cost.balance")}</span>
          <span className={cn("font-semibold", insufficient ? "text-amber-500" : "text-foreground")}>
            {tokenBalance} {t("editPrompt.cost.unit")}
          </span>
        </div>
        {insufficient && (
          <p className="mt-2 text-xs text-amber-500">{t("editPrompt.cost.insufficient")}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isRegenerating} className="flex-1">
          {t("editPrompt.cancel")}
        </Button>
        <Button onClick={handleRegenerate} disabled={isRegenerating || insufficient} className="flex-1">
          {isRegenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("editPrompt.regenerating")}</>
          ) : (
            <><RefreshCw className="mr-2 h-4 w-4" />{t("editPrompt.regenerate")}</>
          )}
        </Button>
      </div>
    </div>
  );
}
