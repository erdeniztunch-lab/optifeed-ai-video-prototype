import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type VideoFolder } from "@/data/folders";

interface CampaignNameModalProps {
  open: boolean;
  folders: VideoFolder[];
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export function CampaignNameModal({ open, folders, onConfirm, onCancel }: CampaignNameModalProps) {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    setName("");
  };

  const handleCancel = () => {
    setName("");
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Kampanya adı</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Seçtiğiniz ürünler bu kampanya klasörüne kaydedilecek.
        </p>

        <Input
          autoFocus
          placeholder="Örn. Yaz Koleksiyonu 2025"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          maxLength={60}
        />

        {folders.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
              Mevcut klasörler
            </p>
            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setName(f.name)}
                className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            İptal
          </Button>
          <Button className="flex-1" disabled={!name.trim()} onClick={handleConfirm}>
            Devam et →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
