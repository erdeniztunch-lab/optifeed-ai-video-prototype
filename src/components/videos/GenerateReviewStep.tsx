import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Pencil, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { TEMPLATES } from "@/data/templates";
import { DEMO_VIDEO_GENERATION_DELAY_MS, SAMPLE_VIDEO } from "@/data/tokens";
import { type TemplateId } from "@/types/video-flow";
import { VideoPlayerModal } from "./VideoPlayerModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalStatus = "generating" | "pending_review";
type DisplayStatus = "generating" | "pending_review" | "approved" | "rejected";

interface VideoRecord {
  productId: string;
  status: LocalStatus;
  videoUrl: string | null;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GenerateReviewStepProps {
  products: Product[];
  selectedTemplate: TemplateId;
  approvedIds: string[];
  rejectedIds: string[];
  notifyOnComplete: boolean;
  onApprove: (productId: string) => void;
  onReject: (productId: string) => void;
  onEditPrompt: (productId: string) => void;
  onGoToExport: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GenerateReviewStep({
  products,
  selectedTemplate,
  approvedIds,
  rejectedIds,
  notifyOnComplete,
  onApprove,
  onReject,
  onEditPrompt,
  onGoToExport,
}: GenerateReviewStepProps) {
  // Local state: only "generating" → "pending_review" transitions.
  // Approved/rejected status is derived from parent props (persists across remounts).
  const [videoRecords, setVideoRecords] = useState<VideoRecord[]>(() =>
    products.map((p) => {
      const alreadyDecided =
        approvedIds.includes(p.id) || rejectedIds.includes(p.id);
      return {
        productId: p.id,
        status: alreadyDecided ? "pending_review" : "generating",
        videoUrl: alreadyDecided ? SAMPLE_VIDEO : null,
      };
    }),
  );

  const timeoutRefs = useRef<number[]>([]);
  const notificationSentRef = useRef(false);

  // Generation: transition each undecided video to pending_review, staggered.
  // Intentionally runs once on mount — products/approvedIds/rejectedIds are
  // captured at mount time to determine which videos still need generation.
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

  // Derive effective display status per video
  const getDisplayStatus = (record: VideoRecord): DisplayStatus => {
    if (approvedIds.includes(record.productId)) return "approved";
    if (rejectedIds.includes(record.productId)) return "rejected";
    return record.status;
  };

  const totalCount = products.length;
  const completedCount = videoRecords.filter(
    (r) => getDisplayStatus(r) !== "generating",
  ).length;
  const allDone = totalCount > 0 && completedCount === totalCount;
  const approvedCount = approvedIds.length;

  const pendingReviewIds = videoRecords
    .filter((r) => getDisplayStatus(r) === "pending_review")
    .map((r) => r.productId);

  // Browser notification when all videos are done — fires at most once per mount
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
      new Notification("Videolar hazır", {
        body: "Video üretimi tamamlandı. İncelemeye devam edebilirsiniz.",
      });
    } catch {
      toast("Videolar hazır.");
    }
  }, [allDone, notifyOnComplete]);

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

  const templateDef = TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 pb-36 md:px-10">
      {/* Header */}
      <div className="mb-1">
        <div className="flex items-center gap-2">
          {!allDone && <Sparkles className="h-5 w-5 text-primary" />}
          <h2 className="text-2xl font-semibold text-foreground">
            {allDone
              ? "Videolar hazır — inceleme tamamlanınca gönderebilirsiniz"
              : "Videolar üretiliyor..."}
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Videolar hazır oldukça inceleyebilirsiniz. Onay vermeden hiçbir video kanala
          gönderilmez.
        </p>
        {templateDef && (
          <p className="mt-2 text-xs text-muted-foreground/60">
            Şablon: {templateDef.label}
          </p>
        )}
      </div>

      {/* Progress row */}
      <div className="mb-6 mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{completedCount}</span> /{" "}
            {totalCount} tamamlandı
          </span>
          {pendingReviewIds.length > 0 && (
            <button
              type="button"
              onClick={handleApproveAll}
              className="text-xs text-primary underline-offset-2 hover:underline"
            >
              Tümünü onayla
            </button>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              allDone ? "bg-success" : "bg-primary",
            )}
            style={{
              width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

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
              onApprove={() => onApprove(record.productId)}
              onReject={() => onReject(record.productId)}
              onEditPrompt={() => onEditPrompt(record.productId)}
              onPreview={() => setPreviewProductId(record.productId)}
            />
          );
        })}
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:left-64">
        <div className="flex w-full items-center justify-between gap-4 px-6 py-4 md:px-10">
          <p className="text-sm text-muted-foreground">
            {approvedCount > 0 ? (
              <>
                <span className="font-semibold text-foreground">{approvedCount}</span>{" "}
                onaylandı / {totalCount} toplam
              </>
            ) : (
              "Dışa aktarmak için en az 1 videoyu onaylayın"
            )}
          </p>
          <Button size="lg" disabled={approvedCount === 0} onClick={onGoToExport}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Dışa aktar →
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={approveAllOpen}
        title="Tümünü onayla"
        description={`İncelemeyi bekleyen ${pendingReviewIds.length} video onaylanacak. Devam edilsin mi?`}
        confirmLabel="Onayla"
        cancelLabel="İptal"
        onConfirm={handleApproveAllConfirm}
        onCancel={() => setApproveAllOpen(false)}
      />

      {/* Video preview modal */}
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
            templateLabel={templateDef?.label}
            onApprove={() => onApprove(previewProduct.id)}
            onReject={() => onReject(previewProduct.id)}
            onEdit={() => onEditPrompt(previewProduct.id)}
          />
        );
      })()}
    </div>
  );
}

// ─── VideoReviewCard ──────────────────────────────────────────────────────────

interface VideoReviewCardProps {
  product: Product;
  status: DisplayStatus;
  videoUrl: string | null;
  onApprove: () => void;
  onReject: () => void;
  onEditPrompt: () => void;
  onPreview: () => void;
}

function VideoReviewCard({
  product,
  status,
  videoUrl,
  onApprove,
  onReject,
  onEditPrompt,
  onPreview,
}: VideoReviewCardProps) {
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
      {/* Product thumbnail with overlay */}
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

      {/* Info + actions */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
          <StatusBadge status={status} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.brand}</p>

        {isPendingReview && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-success/50 hover:text-success"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Onayla
            </button>
            {videoUrl && (
              <button
                type="button"
                onClick={onPreview}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
              >
                Önizle
              </button>
            )}
            <button
              type="button"
              onClick={onEditPrompt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
            >
              <Pencil className="h-3.5 w-3.5" />
              Düzenle
            </button>
            <button
              type="button"
              onClick={onReject}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:border-destructive/40 hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
              Reddet
            </button>
          </div>
        )}

        {isApproved && (
          <button
            type="button"
            onClick={onApprove}
            className="mt-2 text-xs text-muted-foreground/60 hover:text-muted-foreground"
          >
            Onayı geri al
          </button>
        )}

        {isRejected && (
          <button
            type="button"
            onClick={onReject}
            className="mt-2 text-xs text-muted-foreground/60 hover:text-muted-foreground"
          >
            Reddi geri al
          </button>
        )}
      </div>

      {/* Right: inline video or shimmer */}
      {(isPendingReview || isApproved || isRejected) && videoUrl ? (
        <div
          className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-black"
        >
          <video
            src={videoUrl}
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full object-cover"
          />
        </div>
      ) : isGenerating ? (
        <div className="h-20 w-28 shrink-0 animate-pulse rounded-xl bg-primary/10" />
      ) : null}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DisplayStatus }) {
  const map: Record<DisplayStatus, { cls: string; label: string }> = {
    generating: { cls: "bg-amber-100 text-amber-700", label: "Üretiliyor" },
    pending_review: { cls: "bg-primary/10 text-primary", label: "İncele" },
    approved: { cls: "bg-success/15 text-success", label: "Onaylandı" },
    rejected: { cls: "bg-muted text-muted-foreground", label: "Reddedildi" },
  };
  const { cls, label } = map[status];
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", cls)}>
      {label}
    </span>
  );
}
