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
          Video şablonu seçin
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ürününüz için bir video formatı seçin. İsterseniz kampanya bağlamıyla sonucu yönlendirin.
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

      {/* Two-column layout: template grid (left) + context & CTA (right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

        {/* Left: Template grid */}
        <section>
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

        {/* Right: Campaign context + cost confirm */}
        <div className="space-y-6">
          <section>
            <div className="mb-4">
              <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                Kampanya bağlamı
              </h3>
              <p className="mt-1 text-xs text-muted-foreground/50">
                Bu alanlar sonucu iyileştirir, boş bırakabilirsiniz.
              </p>
            </div>
            <GuidedPromptFields value={guidedPrompt} onChange={setGuidedPrompt} />
          </section>

          <GenerateCostConfirm
            videoCount={products.length}
            tokenBalance={tokenBalance}
            onGenerate={handleGenerate}
          />
        </div>

      </div>
    </div>
  );
}
