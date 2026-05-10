import { useState } from "react";
import { type Product } from "@/data/products";
import { TEMPLATES } from "@/data/templates";
import { type GuidedPrompt, DEFAULT_GUIDED_PROMPT, type TemplateId } from "@/types/video-flow";
import { TemplateCard } from "./TemplateCard";
import { GuidedPromptFields } from "./GuidedPromptFields";
import { GenerateCostConfirm } from "./GenerateCostConfirm";

interface TemplateSelectionStepProps {
  products: Product[];
  tokenBalance: number;
  onGenerate: (opts: { template: TemplateId; guidedPrompt: GuidedPrompt }) => void;
}

export function TemplateSelectionStep({
  products,
  tokenBalance,
  onGenerate,
}: TemplateSelectionStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("product-spotlight");
  const [guidedPrompt, setGuidedPrompt] = useState<GuidedPrompt>(DEFAULT_GUIDED_PROMPT);

  const handleGenerate = () => {
    onGenerate({ template: selectedTemplate, guidedPrompt });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Şablon seç
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Video formatını seçin, ardından isteğe bağlı olarak kampanya bağlamını yapılandırın.
        </p>
      </header>

      {/* Selected products strip */}
      {products.length > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex -space-x-2">
            {products.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="h-9 w-9 overflow-hidden rounded-lg border-2 border-background bg-muted"
                style={{ zIndex: 10 - i }}
              >
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {products.length} ürün seçildi
            </p>
            {products.length > 0 && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {products
                  .slice(0, 3)
                  .map((p) => p.name)
                  .join(", ")}
                {products.length > 3 && ` +${products.length - 3} daha`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Template grid */}
      <section className="mb-10">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Video formatı
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              selected={selectedTemplate === t.id}
              onSelect={() => setSelectedTemplate(t.id)}
            />
          ))}
        </div>
      </section>

      {/* Guided prompt section */}
      <section className="mb-10">
        <div className="mb-4 flex items-baseline gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Kampanya bağlamı
          </h3>
          <span className="text-xs text-muted-foreground/60">
            Tüm alanlar isteğe bağlı — ilgili olanları doldurun
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <GuidedPromptFields value={guidedPrompt} onChange={setGuidedPrompt} />
        </div>
      </section>

      {/* Cost confirmation */}
      <section>
        <GenerateCostConfirm
          videoCount={products.length}
          tokenBalance={tokenBalance}
          onGenerate={handleGenerate}
        />
      </section>
    </div>
  );
}
