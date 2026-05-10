import { Check, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type VideoProgressJob } from "@/types/video-flow";

interface VideoProgressCardProps {
  job: VideoProgressJob;
}

export function VideoProgressCard({ job }: VideoProgressCardProps) {
  const isPending = job.status === "pending";
  const isGenerating = job.status === "generating";
  const isReady = job.status === "ready";

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border px-4 py-3 transition-all duration-300",
        isReady && "border-success/25 bg-success/5",
        isGenerating && "border-primary/25 bg-primary/5",
        isPending && "border-border bg-card opacity-60",
      )}
    >
      {/* Product image with status overlay */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={job.productImage}
          alt={job.productName}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-success/25">
            <Check className="h-5 w-5 text-success" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Product info + status */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-foreground">{job.productName}</p>
        <div className="mt-1.5">
          {isPending && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Sırada bekliyor
            </span>
          )}
          {isGenerating && (
            <>
              <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Loader2 className="h-3 w-3 animate-spin" />
                Üretiliyor...
              </span>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-primary/15">
                <div className="h-full w-full animate-pulse rounded-full bg-primary/40" />
              </div>
            </>
          )}
          {isReady && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <Check className="h-3 w-3" strokeWidth={3} />
              Hazır ✓
            </span>
          )}
        </div>
      </div>

      {/* Right side: video thumbnail for ready state (no play icon — not interactive) */}
      {isReady && (
        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <img
            src={job.productImage}
            alt="Video önizleme"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Right side: shimmer placeholder for generating */}
      {isGenerating && (
        <div className="h-12 w-16 shrink-0 animate-pulse rounded-lg bg-primary/10" />
      )}
    </div>
  );
}
