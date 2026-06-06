import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { SECTORS, THEMES, PRODUCT_TYPES } from "@/data/taxonomy";
import { type CampaignContext } from "@/types/video-flow";
import { cn } from "@/lib/utils";

interface CampaignNameModalProps {
  open: boolean;
  onConfirm: (context: CampaignContext) => void;
  onCancel: () => void;
}

export function CampaignNameModal({ open, onConfirm, onCancel }: CampaignNameModalProps) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [theme, setTheme] = useState("");
  const [themeCustom, setThemeCustom] = useState("");
  const [productType, setProductType] = useState("");

  const nameError =
    name.trim().length > 0 && name.trim().length < 3 ? t("modal.name.error") : null;

  const isValid = name.trim().length >= 3 && sector !== "";

  const reset = () => {
    setName("");
    setSector("");
    setTheme("");
    setThemeCustom("");
    setProductType("");
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm({
      name: name.trim(),
      sector,
      theme,
      themeCustom: theme === "other" ? themeCustom.trim() : "",
      productType,
      templateNote: "",
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modal.title")}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{t("modal.subtitle")}</p>

        <div className="space-y-4">
          {/* Campaign name */}
          <div className="space-y-1.5">
            <label htmlFor="modal-campaign-name" className="text-sm font-medium text-foreground">
              {t("modal.name.label")}{" "}
              <span className="text-destructive" aria-hidden="true">{t("common.required")}</span>
            </label>
            <Input
              id="modal-campaign-name"
              autoFocus
              aria-required="true"
              aria-describedby={nameError ? "modal-campaign-name-error" : undefined}
              placeholder={t("modal.name.placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isValid && handleConfirm()}
              maxLength={60}
            />
            {nameError && (
              <p id="modal-campaign-name-error" role="alert" className="text-xs text-destructive">
                {nameError}
              </p>
            )}
          </div>

          {/* Sector */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              {t("modal.sector.label")}{" "}
              <span className="text-destructive" aria-hidden="true">{t("common.required")}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={sector === s.value}
                  onClick={() => setSector(s.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    sector === s.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                  )}
                >
                  {t(`taxonomy.sectors.${s.value}`)}
                  {s.value === "tekstil" && (
                    <span
                      title={t("modal.prototypeTooltip")}
                      className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary"
                    >
                      <Info className="h-2.5 w-2.5" />
                      {t("modal.prototypeBadge")}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-1.5">
            <label htmlFor="modal-theme" className="text-sm font-medium text-foreground">
              {t("modal.theme.label")}
            </label>
            <select
              id="modal-theme"
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                setThemeCustom("");
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">{t("modal.theme.placeholder")}</option>
              {THEMES.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(`taxonomy.themes.${item.value}`)}
                </option>
              ))}
            </select>
            {theme === "other" && (
              <Input
                aria-label={t("modal.theme.label")}
                placeholder={t("modal.theme.customPlaceholder")}
                value={themeCustom}
                onChange={(e) => setThemeCustom(e.target.value)}
                maxLength={40}
              />
            )}
          </div>

          {/* Product type */}
          <div className="space-y-1.5">
            <label htmlFor="modal-product-type" className="text-sm font-medium text-foreground">
              {t("modal.productType.label")}
            </label>
            <select
              id="modal-product-type"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">{t("modal.productType.placeholder")}</option>
              {PRODUCT_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {t(`taxonomy.productTypes.${p.value}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            {t("modal.cancel")}
          </Button>
          <Button className="flex-1" disabled={!isValid} onClick={handleConfirm}>
            {t("modal.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
