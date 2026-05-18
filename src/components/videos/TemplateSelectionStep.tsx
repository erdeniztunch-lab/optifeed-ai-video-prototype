import { useEffect, useState } from "react";
import { ArrowLeft, Info, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type Product } from "@/data/products";
import { TEMPLATES } from "@/data/templates";
import { SECTORS, THEMES, PRODUCT_TYPES } from "@/data/taxonomy";
import { type TemplateId, type CampaignContext } from "@/types/video-flow";
import { TemplateCard } from "./TemplateCard";
import { EmptyState } from "./EmptyState";

interface TemplateSelectionStepProps {
  products: Product[];
  campaignContext: CampaignContext;
  onContinue: (opts: { template: TemplateId; templateNote: string }) => void;
  onBack: () => void;
}

export function TemplateSelectionStep({
  products,
  campaignContext,
  onContinue,
  onBack,
}: TemplateSelectionStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [templateNote, setTemplateNote] = useState("");

  const handleContinue = () => {
    if (!selectedTemplate) return;
    onContinue({ template: selectedTemplate, templateNote });
  };

  // Campaign context summary
  const sectorLabel = SECTORS.find((s) => s.value === campaignContext.sector)?.label;
  const themeLabel =
    campaignContext.theme === "other"
      ? campaignContext.themeCustom
      : THEMES.find((t) => t.value === campaignContext.theme)?.label;
  const productTypeLabel = PRODUCT_TYPES.find(
    (p) => p.value === campaignContext.productType,
  )?.label;
  const summaryParts = [sectorLabel, themeLabel, productTypeLabel].filter(Boolean) as string[];

  const selectedDef = TEMPLATES.find((t) => t.id === selectedTemplate);

  const isRecommended = (tpl: (typeof TEMPLATES)[0]) => {
    if (!campaignContext.sector) return false;
    return tpl.recommendedSectors.includes(campaignContext.sector);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 pb-28 md:px-10">
      {/* Header */}
      <header className="mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Şablon seçin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ürünlerinize en uygun video senaryosunu seçin.
        </p>
      </header>

      {/* Campaign summary */}
      <div className="mb-6">
        {summaryParts.length > 0 ? (
          <p className="text-xs text-muted-foreground/70">{summaryParts.join(" · ")}</p>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* 2×2 Template grid */}
      {isLoading ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : TEMPLATES.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="Şablon bulunamadı"
          description="Kullanılabilir video şablonu yok."
          actionLabel="Geri dön"
          onAction={onBack}
        />
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              selected={selectedTemplate === t.id}
              isRecommended={isRecommended(t)}
              onSelect={() => setSelectedTemplate(t.id)}
            />
          ))}
        </div>
      )}

      {/* Ek detay textarea */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Ek detay{" "}
          <span className="ml-1 text-xs font-normal text-muted-foreground">(opsiyonel)</span>
        </label>
        <textarea
          value={templateNote}
          onChange={(e) => setTemplateNote(e.target.value)}
          placeholder="Örn. ürün metalik yüzey, gece sahnesi tercih edilsin, 25–35 yaş kadın kitlesine hitap etsin..."
          rows={3}
          maxLength={300}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground/60">
          {templateNote.length} / 300
        </p>
      </div>

      {/* Info note */}
      <div className="mb-6 flex items-start gap-2 rounded-lg bg-muted/40 px-4 py-3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <p className="text-xs leading-relaxed text-muted-foreground/70">
          Videolar 8–10 saniye, 1:1 formatta üretilir. Fiyat/marka bilgisi sonradan Dynamic
          Creative ile eklenebilir.
        </p>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          {/* Left: product count + selected template name */}
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{products.length} ürün</span>
            {selectedDef && <> · {selectedDef.label}</>}
          </p>

          {/* Right: hint + Geri + Devam */}
          <div className="flex items-center gap-2">
            {!selectedTemplate && (
              <p className="hidden text-xs text-muted-foreground/60 sm:block">
                Devam etmek için bir şablon seçin
              </p>
            )}
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Geri
            </Button>
            <Button disabled={!selectedTemplate} onClick={handleContinue}>
              Devam →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
