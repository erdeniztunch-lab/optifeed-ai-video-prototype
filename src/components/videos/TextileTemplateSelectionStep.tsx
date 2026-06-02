import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/data/products";
import { SECTORS, THEMES, PRODUCT_TYPES } from "@/data/taxonomy";
import { type TemplateId, type CampaignContext } from "@/types/video-flow";
import { TEXTILE_TEMPLATES } from "@/data/textile-templates";
import { TextileTemplateCard } from "./TextileTemplateCard";

interface Props {
  products: Product[];
  campaignContext: CampaignContext;
  onContinue: (opts: { template: TemplateId; templateNote: string }) => void;
  onBack: () => void;
}

export function TextileTemplateSelectionStep({
  products,
  campaignContext,
  onContinue,
  onBack,
}: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [templateNote, setTemplateNote] = useState("");

  const handleContinue = () => {
    if (!selectedTemplate) return;
    onContinue({ template: selectedTemplate, templateNote });
  };

  const sectorLabel = SECTORS.find((s) => s.value === campaignContext.sector)?.label;
  const themeLabel =
    campaignContext.theme === "other"
      ? campaignContext.themeCustom
      : THEMES.find((t) => t.value === campaignContext.theme)?.label;
  const productTypeLabel = PRODUCT_TYPES.find(
    (p) => p.value === campaignContext.productType,
  )?.label;
  const summaryParts = [sectorLabel, themeLabel, productTypeLabel].filter(Boolean) as string[];

  const selectedDef = TEXTILE_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 pb-28 md:px-10">
      {/* Header */}
      <header className="mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Sahneyi seçin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Her sahne 8-10 saniye olup kıyafeti farklı açılardan gösterir.
        </p>
      </header>

      {/* Kampanya özeti */}
      <div className="mb-6">
        {summaryParts.length > 0 ? (
          <p className="text-xs text-muted-foreground/70">{summaryParts.join(" · ")}</p>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* Tekstil bilgi bannerı */}
      <div className="mb-6 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
        <div>
          <p className="text-xs font-medium text-foreground">
            Bu şablonlar Moda &amp; Giyim sektörüne özel hazırlanmıştır.
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            En iyi sonuç için ürününüzün ön, arka ve yan fotoğraflarını yüklediğinizden emin olun.
          </p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TEXTILE_TEMPLATES.map((t) => (
          <TextileTemplateCard
            key={t.id}
            template={t}
            selected={selectedTemplate === t.id}
            onSelect={() => setSelectedTemplate(t.id)}
          />
        ))}
      </div>

      {/* Ek detay textarea */}
      <div className="mb-4">
        <label htmlFor="template-note" className="mb-1.5 block text-sm font-medium text-foreground">
          Ek detay{" "}
          <span className="ml-1 text-xs font-normal text-muted-foreground">(opsiyonel)</span>
        </label>
        <textarea
          id="template-note"
          value={templateNote}
          onChange={(e) => setTemplateNote(e.target.value)}
          placeholder="Örn. ürün metalik yüzey, gece sahnesi tercih edilsin, 25-35 yaş kadın kitlesine hitap etsin..."
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
          Videolar 8-10 saniye, 1:1 formatta üretilir. Fiyat/marka bilgisi sonradan Dynamic
          Creative ile eklenebilir.
        </p>
      </div>

      {/* Sabit alt bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{products.length} ürün</span>
            {selectedDef && <> · {selectedDef.label}</>}
          </p>
          <div className="flex items-center gap-2">
            {!selectedTemplate && (
              <p className="hidden text-xs text-muted-foreground/60 sm:block">
                Devam etmek için bir sahne seçin
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
