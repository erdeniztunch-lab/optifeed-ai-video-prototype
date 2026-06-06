import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2, Pencil, PlayCircle, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { DEMO_VIDEO_GENERATION_DELAY_MS, SAMPLE_VIDEO, TOKEN_COST_PER_VIDEO } from "@/data/tokens";
import { type TemplateId } from "@/types/video-flow";
import { VideoPlayerModal } from "./VideoPlayerModal";

type LocalStatus = "generating" | "pending_review";
type DisplayStatus = "generating" | "pending_review" | "approved" | "rejected";

interface VideoRecord {
  productId: string;
  status: LocalStatus;
  videoUrl: string | null;
}

interface GenerateReviewStepProps {
  products: Product[];
  selectedTemplate: TemplateId;
  approvedIds: string[];
  rejectedIds: string[];
  notifyOnComplete: boolean;
  tokenNotice?: { amount: number; id: number } | null;
  onApprove: (productId: string) => void;
  onReject: (productId: string) => void;
  onEditPrompt: (productId: string) => void;
  onGoToExport: () => void;
}

export function GenerateReviewStep({
  products,
  selectedTemplate,
  approvedIds,
  rejectedIds,
  notifyOnComplete,
  tokenNotice,
  onApprove,
  onReject,
  onEditPrompt,
  onGoToExport,
}: GenerateReviewStepProps) {
  const { t, i18n } = useTranslation();

  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>(() =>
    products.map((p) => {
      const alreadyDecided = approvedIds.includes(p.id) || rejectedIds.includes(p.id);
      return {
        productId: p.id,
        status: alreadyDecided ? "pending_review" : "generating",
        videoUrl: alreadyDecided ? SAMPLE_VIDEO : null,
      };
    }),
  );

  const timeoutRefs = useRef<number[]>([]);
  const notificationSentRef = useRef(false);
  const [activeTokenNotice, setActiveTokenNotice] = useState(tokenNotice ?? null);

  useEffect(() => {
    const toGenerate = products.filter(
      (p) => !approvedIds.includes(p.id) && !rejectedIds.includes(p.id),
    );
    if (toGenerate.length === 0) return;

    toGenerate.forEach((p, order) => {
      const id = window.setTimeout(() => {
        setVideoRecords((prev) =>
          prev.map((r) =>
            r.productId === p.id
              ? { ...r, status: "pending_review", videoUrl: SAMPLE_VIDEO }
              : r,
          ),
        );
      }, (order + 1) * DEMO_VIDEO_GENERATION_DELAY_MS);
      timeoutRefs.current.push(id);
    });

    return () => {
      timeoutRefs.current.forEach((id) => window.clearTimeout(id));
      timeoutRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDisplayStatus = (record: VideoRecord): DisplayStatus => {
    if (approvedIds.includes(record.productId)) return "approved";
    if (rejectedIds.includes(record.productId)) return "rejected";
    return record.status;
  };

  const totalCount = products.length;
  const completedCount = videoRecords.filter((r) => getDisplayStatus(r) !== "generating").length;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const approvedCount = approvedIds.length;

  const pendingReviewIds = videoRecords
    .filter((r) => getDisplayStatus(r) === "pending_review")
    .map((r) => r.productId);

  useEffect(() => {
    if (
      !allDone ||
      !notifyOnComplete ||
      notificationSentRef.current ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    ) return;

    notificationSentRef.current = true;
    try {
      new Notification(t("generate.notification.title"), {
        body: t("generate.notification.body"),
      });
    } catch {
      toast(t("generate.notification.toast"));
    }
  }, [allDone, notifyOnComplete, t]);

  useEffect(() => {
    if (!tokenNotice) return;
    setActiveTokenNotice(tokenNotice);
    const timer = window.setTimeout(() => setActiveTokenNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [tokenNotice]);

  const [approveAllOpen, setApproveAllOpen] = useState(false);
  const [previewProductId, setPreviewProductId] = useState<string | null>(null);

  const handleApproveAll = () => {
    if (pendingReviewIds.length === 0) return;
    setApproveAllOpen(true);
  };

  const handleApproveAllConfirm = () => {
    pendingReviewIds.forEach((id) => onApprove(id));
    setApproveAllOpen(false);
  };

  const handleApproveToggle = (productId: string) => { onApprove(productId); };

  const templateLabel = t(`templates.${selectedTemplate}.label`, {
    defaultValue: t(`textileTemplates.${selectedTemplate}.label`, { defaultValue: selectedTemplate }),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 pb-36 md:px-10">
      {/* Header */}
      <div className="mb-1">
        <div className="flex items-center gap-2">
          {!allDone && <Sparkles className="h-5 w-5 text-primary" />}
          <h2 className="text-2xl font-semibold text-foreground">
            {allDone ? t("generate.title.done") : t("generate.title.generating")}
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{t("generate.subtitle")}</p>
        <p className="mt-2 text-xs text-muted-foreground/60">
          {t("generate.templateLabel", { name: templateLabel })}
        </p>
      </div>

      {/* Progress row */}
      <div className="mb-6 mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{completedCount}</span>
            {" / "}{totalCount}{" "}
            {t("generate.progress", { completed: completedCount, total: totalCount }).replace(`${completedCount} / ${totalCount} `, "")}
          </span>
          {pendingReviewIds.length > 0 && (
            <button
              type="button"
              onClick={handleApproveAll}
              className="text-xs text-primary underline-offset-2 hover:underline"
            >
              {t("generate.approveAll")}
            </button>
          )}
        </div>
        <div
          role="progressbar"
          aria-label={t("generate.progressBarLabel")}
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={totalCount}
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              allDone ? "bg-success" : "bg-primary",
            )}
            style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%" }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs text-muted-foreground/60">
          {t("generate.tokensSpent", { count: totalCount * TOKEN_COST_PER_VIDEO })}
        </p>
      </div>

      <p className="mb-4 text-xs text-muted-foreground">{t("generate.confidence")}</p>

      {/* Video cards */}
      <div className="space-y-3">
        {videoRecords.map((record) => {
          const product = products.find((p) => p.id === record.productId)!;
          const status = getDisplayStatus(record);
          return (
            <VideoReviewCard
              key={record.productId}
              product={product}
              status={status}
              videoUrl={record.videoUrl}
              onApprove={() => handleApproveToggle(record.productId)}
              onReject={() => onReject(record.productId)}
              onEditPrompt={() => onEditPrompt(record.productId)}
              onPreview={() => setPreviewProductId(record.productId)}
            />
          );
        })}
      </div>

      {activeTokenNotice && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-6 md:left-64">
          <div className="rounded-full border border-primary/20 bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-lg">
            {t("generate.tokenNotice", { amount: activeTokenNotice.amount })}
          </div>
        </div>
      )}

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 md:px-10">
          <p className="text-sm text-muted-foreground">
            {approvedCount > 0
              ? t("generate.footer.approved", { count: approvedCount, total: totalCount })
              : t("generate.footer.none")}
          </p>
          <Button size="lg" disabled={approvedCount === 0} onClick={onGoToExport}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {t("generate.exportBtn")}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={approveAllOpen}
        title={t("generate.approveAllDialog.title")}
        description={t("generate.approveAllDialog.desc", { count: pendingReviewIds.length })}
        confirmLabel={t("generate.approveAllDialog.confirm")}
        cancelLabel={t("generate.approveAllDialog.cancel")}
        onConfirm={handleApproveAllConfirm}
        onCancel={() => setApproveAllOpen(false)}
      />

      {(() => {
        const previewRecord = previewProductId
          ? videoRecords.find((r) => r.productId === previewProductId)
          : null;
        const previewProduct = previewProductId
          ? products.find((p) => p.id === previewProductId)
          : null;
        if (!previewRecord || !previewProduct) return null;
        const previewStatus = getDisplayStatus(previewRecord);
        return (
          <VideoPlayerModal
            open={previewProductId !== null}
            onOpenChange={(o) => { if (!o) setPreviewProductId(null); }}
            product={previewProduct}
            videoUrl={previewRecord.videoUrl}
            status={previewStatus}
            templateLabel={templateLabel}
            onApprove={() => handleApproveToggle(previewProduct.id)}
            onReject={() => onReject(previewProduct.id)}
            onEdit={() => onEditPrompt(previewProduct.id)}
          />
        );
      })()}
    </div>
  );
}

interface VideoReviewCardProps {
  product: Product;
  status: DisplayStatus;
  videoUrl: string | null;
  onApprove: () => void;
  onReject: () => void;
  onEditPrompt: () => void;
  onPreview: () => void;
}

function VideoReviewCard({ product, status, videoUrl, onApprove, onReject, onEditPrompt, onPreview }: VideoReviewCardProps) {
  const { t } = useTranslation();
  const isGenerating = status === "generating";
  const isPendingReview = status === "pending_review";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300",
        isApproved && "border-success/25 bg-success/5",
        isRejected && "border-border bg-card opacity-60",
        isGenerating && "border-primary/20 bg-primary/5",
        isPendingReview && "border-border bg-card",
      )}
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
        {isApproved && (
          <div className="absolute inset-0 flex items-center justify-center bg-success/30">
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
          <StatusBadge status={status} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.brand}</p>

        {isPendingReview && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" onClick={onApprove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-success/50 hover:text-success">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {t("generate.card.approve")}
            </button>
            <button type="button" onClick={onEditPrompt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary">
              <Pencil className="h-3.5 w-3.5" />
              {t("generate.card.editPrompt")}
            </button>
            <button type="button" onClick={onReject}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-destructive/40 hover:text-destructive">
              <X className="h-3.5 w-3.5" />
              {t("generate.card.reject")}
            </button>
          </div>
        )}

        {isApproved && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onApprove}
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground">
              {t("generate.card.revert")}
            </button>
            {videoUrl && (
              <button type="button" onClick={onPreview}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary">
                {t("generate.card.preview")}
              </button>
            )}
          </div>
        )}

        {isRejected && (
          <button type="button" onClick={onReject}
            className="mt-2 text-xs text-muted-foreground/60 hover:text-muted-foreground">
            {t("generate.rejectUndo")}
          </button>
        )}

        {!isGenerating && !isApproved && videoUrl && (
          <button type="button" onClick={onPreview}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary">
            {t("generate.card.preview")}
          </button>
        )}
      </div>

      {(isPendingReview || isApproved || isRejected) && videoUrl ? (
        <button
          type="button"
          onClick={onPreview}
          aria-label={t("generate.videoPreviewAriaLabel", { name: product.name })}
          className="group relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-black focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <video src={videoUrl} muted loop playsInline autoPlay className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm">
              <PlayCircle className="h-4 w-4" />
            </span>
          </span>
        </button>
      ) : isGenerating ? (
        <div className="h-20 w-28 shrink-0 animate-pulse rounded-xl bg-primary/10" />
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: DisplayStatus }) {
  const { t } = useTranslation();
  const clsMap: Record<DisplayStatus, string> = {
    generating: "bg-amber-100 text-amber-700",
    pending_review: "bg-primary/10 text-primary",
    approved: "bg-success/15 text-success",
    rejected: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", clsMap[status])}>
      {t(`generate.statusBadge.${status}`)}
    </span>
  );
}
