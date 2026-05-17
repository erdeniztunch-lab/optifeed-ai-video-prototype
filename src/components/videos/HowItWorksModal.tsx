import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ open, onClose }: HowItWorksModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nasıl çalışır?</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="before-after" className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="before-after" className="flex-1">Önce / Sonra</TabsTrigger>
            <TabsTrigger value="steps" className="flex-1">3 adımda</TabsTrigger>
            <TabsTrigger value="faq" className="flex-1">SSS</TabsTrigger>
          </TabsList>

          {/* ── Önce / Sonra ─────────────────────────────────────── */}
          <TabsContent value="before-after" className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-center">
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                  Statik görsel
                </div>
                <p className="text-xs font-semibold text-muted-foreground">Önce</p>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />

              <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary">
                  Video reklam
                </div>
                <p className="text-xs font-semibold text-primary">Sonra</p>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Statik kataloğunuz, performans odaklı video reklama dönüşür.
            </p>
          </TabsContent>

          {/* ── 3 adımda ─────────────────────────────────────────── */}
          <TabsContent value="steps" className="mt-4">
            <ol className="space-y-4">
              <StepRow
                number={1}
                title="Ürün seç"
                description="Kataloğundan video üretmek istediğin ürünleri seç."
              />
              <StepRow
                number={2}
                title="Şablon belirle"
                description="Senaryoyu seç, gerekirse ek detay ekle."
              />
              <StepRow
                number={3}
                title="Üret ve incele"
                description="Videoları onayla, reklam kanallarına gönder."
              />
            </ol>
          </TabsContent>

          {/* ── SSS ──────────────────────────────────────────────── */}
          <TabsContent value="faq" className="mt-4">
            <div className="space-y-4">
              <FaqRow
                q="Token nedir?"
                a="1 token ≈ 30 sn video üretimi. Bakiyeniz cüzdandan görünür."
              />
              <FaqRow
                q="Beğenmezsem?"
                a="Her video tek tek onaylanır. Beğenmediğinizi yeniden ürettirebilir veya reddedebilirsiniz."
              />
              <FaqRow
                q="Hangi kanallara gönderebilirim?"
                a="MVP'de Meta, Google Merchant ve TikTok Catalog destekleniyor."
              />
              <FaqRow
                q="Tek görsel yeterli mi?"
                a="Mümkün, ama çoklu görseller video kalitesini artırır."
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StepRow({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </li>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
      <p className="text-sm font-semibold text-foreground">{q}</p>
      <p className="mt-1 text-sm text-muted-foreground">{a}</p>
    </div>
  );
}
