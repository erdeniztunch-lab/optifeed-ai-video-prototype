import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ open, onClose }: HowItWorksModalProps) {
  const { t } = useTranslation();
  const steps = t("howItWorks.steps", { returnObjects: true }) as { title: string; desc: string }[];
  const faqs = t("howItWorks.faq", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("onboarding.modal.title")}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="before-after" className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="before-after" className="flex-1">{t("howItWorks.tabs.beforeAfter")}</TabsTrigger>
            <TabsTrigger value="steps" className="flex-1">{t("howItWorks.tabs.steps")}</TabsTrigger>
            <TabsTrigger value="faq" className="flex-1">{t("howItWorks.tabs.faq")}</TabsTrigger>
          </TabsList>

          <TabsContent value="before-after" className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-center">
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                  {t("howItWorks.beforeAfter.static")}
                </div>
                <p className="text-xs font-semibold text-muted-foreground">{t("howItWorks.beforeAfter.before")}</p>
              </div>

              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />

              <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary">
                  {t("howItWorks.beforeAfter.video")}
                </div>
                <p className="text-xs font-semibold text-primary">{t("howItWorks.beforeAfter.after")}</p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("howItWorks.beforeAfter.desc")}
            </p>
          </TabsContent>

          <TabsContent value="steps" className="mt-4">
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </TabsContent>

          <TabsContent value="faq" className="mt-4">
            <div className="space-y-4">
              {faqs.map((item, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">{item.q}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose}>{t("howItWorks.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
