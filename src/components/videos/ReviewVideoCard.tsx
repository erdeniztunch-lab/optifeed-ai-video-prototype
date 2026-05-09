import { Check, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { type VideoJob, type ReviewStatus } from "@/types/video-flow";
import { SAMPLE_VIDEO } from "@/data/tokens";

interface ReviewVideoCardProps {
  product: Product;
  videoJob: VideoJob;
  reviewStatus: ReviewStatus;
  view: "list" | "grid";
  onApprove: () => void;
  onReject: () => void;
  onEditPrompt: () => void;
}

export function ReviewVideoCard({
  product,
  videoJob,
  reviewStatus,
  view,
  onApprove,
  onReject,
  onEditPrompt,
}: ReviewVideoCardProps) {
  const isApproved = reviewStatus === "approved";
  const isRejected = reviewStatus === "rejected";
  const isPending = reviewStatus === "pending";

  const videoSrc = videoJob.videoUrl ?? SAMPLE_VIDEO;

  if (view === "grid") {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl border transition-all",
          isApproved && "border-success/25 bg-success/5",
          isRejected && "border-border bg-card opacity-55",
          isPending && "border-border bg-card",
        )}
      >
        {/* Video */}
        <div className="relative aspect-square overflow-hidden bg-black">
          <video
            src={videoSrc}
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full object-cover"
          />
          {isApproved && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
              Approved
            </div>
          )}
          {isRejected && (
            <div className="absolute right-2 top-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              Rejected
            </div>
          )}
        </div>

        {/* Info + actions */}
        <div className="flex flex-col gap-3 p-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          </div>
          <ActionButtons
            isApproved={isApproved}
            isRejected={isRejected}
            onApprove={onApprove}
            onReject={onReject}
            onEditPrompt={onEditPrompt}
            compact
          />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-4 transition-all",
        isApproved && "border-success/25 bg-success/5",
        isRejected && "border-border bg-card opacity-55",
        isPending && "border-border bg-card",
      )}
    >
      {/* Left: product info + actions */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          </div>
          {isApproved && (
            <span className="ml-auto shrink-0 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              <Check className="h-3 w-3" strokeWidth={3} />
              Approved
            </span>
          )}
          {isRejected && (
            <span className="ml-auto shrink-0 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Rejected
            </span>
          )}
        </div>

        <ActionButtons
          isApproved={isApproved}
          isRejected={isRejected}
          onApprove={onApprove}
          onReject={onReject}
          onEditPrompt={onEditPrompt}
        />
      </div>

      {/* Right: video player (1:1 square, 136px) */}
      <div className="relative h-34 w-34 shrink-0 overflow-hidden rounded-xl bg-black"
           style={{ width: 136, height: 136 }}>
        <video
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  isApproved: boolean;
  isRejected: boolean;
  onApprove: () => void;
  onReject: () => void;
  onEditPrompt: () => void;
  compact?: boolean;
}

function ActionButtons({
  isApproved,
  isRejected,
  onApprove,
  onReject,
  onEditPrompt,
  compact = false,
}: ActionButtonsProps) {
  return (
    <div className={cn("flex items-center gap-2", compact && "flex-wrap")}>
      {/* Approve */}
      <button
        type="button"
        onClick={onApprove}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
          isApproved
            ? "border-success bg-success text-white hover:bg-success/90"
            : "border-border bg-background text-foreground hover:border-success/50 hover:text-success",
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
        {isApproved ? "Approved" : "Approve"}
      </button>

      {/* Edit Prompt */}
      <button
        type="button"
        onClick={onEditPrompt}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit Prompt
      </button>

      {/* Reject / Undo */}
      <button
        type="button"
        onClick={onReject}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
          isRejected
            ? "border-border bg-muted text-muted-foreground hover:text-foreground"
            : "border-border bg-background text-muted-foreground hover:border-destructive/40 hover:text-destructive",
        )}
      >
        <X className="h-3.5 w-3.5" />
        {isRejected ? "Undo reject" : "Reject"}
      </button>
    </div>
  );
}
