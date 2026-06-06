import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Info, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type Product } from "@/data/products";
import { TEMPLATES } from "@/data/templates";
import { type TemplateId, type CampaignContext } from "@/types/video-flow";
import { TemplateCard } from "./TemplateCard";
import { EmptyState } from "./EmptyState";
import { TextileTemplateSelectionStep } from "./TextileTemplateSelectionStep";

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
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [templateNote, setTemplateNote] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (campaignContext.sector === "tekstil") {
    return (
      <TextileTemplateSelectionStep
        products={products}
        campaignContext={campaignContext}
        onContinue={onContinue}
        onBack={onBack}
      />
    );
  }

  const handleContinue = () => {
    if (!selectedTemplate) return;
    onContinue({ template: selectedTemplate, templateNote });
  };

  const sectorLabel = campaignContext.sector ? t(`taxonomy.sectors.${campaignContext.sector}`) : "";
  const themeLabel =
    campaignContext.theme === "other"
      ? campaignContext.themeCustom
      : campaignContext.theme
        ? t(`taxonomy.themes.${campaignContext.theme}`)
        : "";
  const productTypeLabel = campaignContext.productType
    ? t(`taxonomy.productTypes.${campaignContext.productType}`)
    : "";
  const summaryParts = [sectorLabel, themeLabel, productTypeLabel].filter(Boolean) as string[];

  const selectedDef = TEMPLATES.find((tpl) => tpl.id === selectedTemplate);

  const isRecommended = (tpl: (typeof TEMPLATES)[0]) => {
    if (!campaignContext.sector) return false;
    return tpl.recommendedSectors.includes(campaignContext.sector);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 pb-28 md:px-10">
      <header className="mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("templateSelect.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("templateSelect.subtitle")}</p>
      </header>

      <div className="mb-6">
        {summaryParts.length > 0 ? (
          <p className="text-xs text-muted-foreground/70">{summaryParts.join(" · ")}</p>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {isLoading ? (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : TEMPLATES.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title={t("templateSelect.empty.title")}
          description={t("templateSelect.empty.desc")}
          actionLabel={t("templateSelect.empty.action")}
          onAction={onBack}
        />
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEMPLATES.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              selected={selectedTemplate === tpl.id}
              isRecommended={isRecommended(tpl)}
              onSelect={() => setSelectedTemplate(tpl.id)}
            />
          ))}
        </div>
      )}

      {/* Note textarea */}
      <div className="mb-4">
        <label htmlFor="template-note" className="mb-1.5 block text-sm font-medium text-foreground">
          {t("templateSelect.noteLabel")}{" "}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            ({t("common.optional")})
          </span>
        </label>
        <textarea
          id="template-note"
          value={templateNote}
          onChange={(e) => setTemplateNote(e.target.value)}
          placeholder={t("templateSelect.notePlaceholder")}
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
          {t("templateSelect.infoNote")}
        </p>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{products.length} {t("costBar.videos", { count: products.length })}</span>
            {selectedDef && <> · {t(`templates.${selectedDef.id}.label`)}</>}
          </p>
          <div className="flex items-center gap-2">
            {!selectedTemplate && (
              <p className="hidden text-xs text-muted-foreground/60 sm:block">
                {t("templateSelect.hint")}
              </p>
            )}
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {t("common.back")}
            </Button>
            <Button disabled={!selectedTemplate} onClick={handleContinue}>
              {t("common.continueArrow")}
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
