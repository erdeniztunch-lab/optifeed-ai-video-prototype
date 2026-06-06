import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product } from "@/data/products";
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
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null);
  const [templateNote, setTemplateNote] = useState("");

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

  const selectedDef = TEXTILE_TEMPLATES.find((tpl) => tpl.id === selectedTemplate);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 pb-28 md:px-10">
      {/* Header */}
      <header className="mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t("textileSelect.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("textileSelect.subtitle")}</p>
      </header>

      {/* Campaign summary */}
      <div className="mb-6">
        {summaryParts.length > 0 ? (
          <p className="text-xs text-muted-foreground/70">{summaryParts.join(" · ")}</p>
        ) : (
          <div className="h-4" />
        )}
      </div>

      {/* Textile info banner */}
      <div className="mb-6 flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
        <div>
          <p className="text-xs font-medium text-foreground">{t("textileSelect.banner.title")}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("textileSelect.banner.desc")}</p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TEXTILE_TEMPLATES.map((tpl) => (
          <TextileTemplateCard
            key={tpl.id}
            template={tpl}
            selected={selectedTemplate === tpl.id}
            onSelect={() => setSelectedTemplate(tpl.id)}
          />
        ))}
      </div>

      {/* Note textarea */}
      <div className="mb-4">
        <label htmlFor="template-note" className="mb-1.5 block text-sm font-medium text-foreground">
          {t("textileSelect.noteLabel")}{" "}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            ({t("common.optional")})
          </span>
        </label>
        <textarea
          id="template-note"
          value={templateNote}
          onChange={(e) => setTemplateNote(e.target.value)}
          placeholder={t("textileSelect.notePlaceholder")}
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
          {t("textileSelect.infoNote")}
        </p>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {t("costBar.videos", { count: products.length })}
            </span>
            {selectedDef && <> · {t(`textileTemplates.${selectedDef.id}.label`)}</>}
          </p>
          <div className="flex items-center gap-2">
            {!selectedTemplate && (
              <p className="hidden text-xs text-muted-foreground/60 sm:block">
                {t("textileSelect.hint")}
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
