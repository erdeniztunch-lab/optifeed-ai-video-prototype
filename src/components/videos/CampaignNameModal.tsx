import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SECTORS, THEMES, PRODUCT_TYPES } from "@/data/taxonomy";
import { type CampaignContext } from "@/types/video-flow";

interface CampaignNameModalProps {
  open: boolean;
  onConfirm: (context: CampaignContext) => void;
  onCancel: () => void;
}

export function CampaignNameModal({ open, onConfirm, onCancel }: CampaignNameModalProps) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [theme, setTheme] = useState("");
  const [themeCustom, setThemeCustom] = useState("");
  const [productType, setProductType] = useState("");

  const nameError =
    name.trim().length > 0 && name.trim().length < 3 ? "En az 3 karakter girin" : null;

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
          <DialogTitle>Kampanyanı tanımla</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Şablon seçimine geçmeden önce kampanya bilgilerini girin.
        </p>

        <div className="space-y-4">
          {/* Campaign name */}
          <div className="space-y-1.5">
            <label htmlFor="modal-campaign-name" className="text-sm font-medium text-foreground">
              Kampanya adı <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <Input
              id="modal-campaign-name"
              autoFocus
              aria-required="true"
              aria-describedby={nameError ? "modal-campaign-name-error" : undefined}
              placeholder="Örn. Yaz Koleksiyonu 2025"
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
            <label htmlFor="modal-sector" className="text-sm font-medium text-foreground">
              Sektör <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <select
              id="modal-sector"
              aria-required="true"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Seçin...</option>
              {SECTORS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div className="space-y-1.5">
            <label htmlFor="modal-theme" className="text-sm font-medium text-foreground">
              Kampanya teması
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
              <option value="">Seçin...</option>
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {theme === "other" && (
              <Input
                aria-label="Özel tema"
                placeholder="Temanızı yazın..."
                value={themeCustom}
                onChange={(e) => setThemeCustom(e.target.value)}
                maxLength={40}
              />
            )}
          </div>

          {/* Product type */}
          <div className="space-y-1.5">
            <label htmlFor="modal-product-type" className="text-sm font-medium text-foreground">
              Ürün tipi
            </label>
            <select
              id="modal-product-type"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Seçin...</option>
              {PRODUCT_TYPES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            İptal
          </Button>
          <Button className="flex-1" disabled={!isValid} onClick={handleConfirm}>
            Şablona geç →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
