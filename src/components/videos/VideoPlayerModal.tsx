import { useTranslation } from "react-i18next";
import { Check, Pencil, Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";

export type VideoDisplayStatus = "generating" | "pending_review" | "approved" | "rejected";

interface VideoPlayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  videoUrl: string | null;
  status: VideoDisplayStatus;
  templateLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
}

export function VideoPlayerModal({
  open,
  onOpenChange,
  product,
  videoUrl,
  status,
  templateLabel,
  onApprove,
  onReject,
  onEdit,
}: VideoPlayerModalProps) {
  const { t } = useTranslation();

  const statusCls: Record<VideoDisplayStatus, string> = {
    generating:     "bg-amber-100 text-amber-700",
    pending_review: "bg-primary/10 text-primary",
    approved:       "bg-success/15 text-success",
    rejected:       "bg-muted text-muted-foreground",
  };

  const isPendingReview = status === "pending_review";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  const handleApprove = () => { onApprove?.(); onOpenChange(false); };
  const handleReject  = () => { onReject?.();  onOpenChange(false); };
  const handleEdit = () => { onOpenChange(false); setTimeout(() => onEdit?.(), 0); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">{t("videoModal.titleSr", { name: product.name })}</DialogTitle>

        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {videoUrl ? (
            <video key={videoUrl} src={videoUrl} className="h-full w-full object-contain" muted loop playsInline autoPlay />
          ) : (
            <>
              <img src={product.image} alt={product.name} className="h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="h-7 w-7 fill-white text-white" />
                </div>
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-white/60">
                {t("videoModal.loadingPreview")}
              </p>
            </>
          )}

          <span className={cn("absolute left-2 top-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", statusCls[status])}>
            {t(`generate.statusBadge.${status}`)}
          </span>

          <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur-sm">
            Demo
          </span>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-1 text-base font-semibold text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>
          </div>

          <dl className="mb-5 space-y-1.5 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <MetaRow label={t("videoModal.meta.category")} value={product.category} />
            {templateLabel && <MetaRow label={t("videoModal.meta.template")} value={templateLabel} />}
          </dl>

          {isPendingReview && (
            <div className="flex flex-wrap items-center gap-2">
              <Button className="flex-1" onClick={handleApprove}>
                <Check className="mr-1.5 h-4 w-4" strokeWidth={3} />
                {t("videoModal.approve")}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                <Pencil className="mr-1.5 h-4 w-4" />
                {t("videoModal.edit")}
              </Button>
              <Button variant="outline" className="flex-1 text-destructive hover:border-destructive/40 hover:bg-destructive/5" onClick={handleReject}>
                <X className="mr-1.5 h-4 w-4" />
                {t("videoModal.reject")}
              </Button>
            </div>
          )}

          {isApproved && (
            <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-2.5 text-center text-sm font-medium text-success">
              {t("videoModal.approved")}
            </div>
          )}

          {isRejected && (
            <div className="rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
              {t("videoModal.rejected")}
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              {t("videoModal.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
