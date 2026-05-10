import { useState } from "react";
import { LayoutGrid, List, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import { type VideoJob, type ReviewStatus } from "@/types/video-flow";
import { ReviewVideoCard } from "./ReviewVideoCard";

interface ReviewStepProps {
  products: Product[];
  videoJobs: VideoJob[];
  approvedIds: string[];
  rejectedIds: string[];
  onApprove: (productId: string) => void;
  onReject: (productId: string) => void;
  onEditPrompt: (productId: string) => void;
  onContinue: () => void;
}

export function ReviewStep({
  products,
  videoJobs,
  approvedIds,
  rejectedIds,
  onApprove,
  onReject,
  onEditPrompt,
  onContinue,
}: ReviewStepProps) {
  const [view, setView] = useState<"list" | "grid">("list");

  const approvedCount = approvedIds.length;
  const rejectedCount = rejectedIds.length;
  const pendingCount = products.length - approvedCount - rejectedCount;

  const canContinue = approvedCount > 0;

  const getReviewStatus = (productId: string): ReviewStatus => {
    if (approvedIds.includes(productId)) return "approved";
    if (rejectedIds.includes(productId)) return "rejected";
    return "pending";
  };

  const getVideoJob = (productId: string): VideoJob => {
    return (
      videoJobs.find((j) => j.productId === productId) ?? {
        productId,
        status: "ready",
        videoUrl: null,
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 pb-36 md:px-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Videoları İncele</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {approvedCount > 0 && (
              <span className="font-medium text-success">{approvedCount} onaylandı</span>
            )}
            {approvedCount > 0 && pendingCount > 0 && (
              <span className="mx-1.5 text-muted-foreground/50">·</span>
            )}
            {pendingCount > 0 && (
              <span>{pendingCount} beklemede</span>
            )}
            {rejectedCount > 0 && (
              <>
                <span className="mx-1.5 text-muted-foreground/50">·</span>
                <span>{rejectedCount} reddedildi</span>
              </>
            )}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
              view === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="h-3.5 w-3.5" />
            Liste
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
              view === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Izgara
          </button>
        </div>
      </div>

      {/* Cards */}
      {view === "list" ? (
        <div className="space-y-3">
          {products.map((product) => (
            <ReviewVideoCard
              key={product.id}
              product={product}
              videoJob={getVideoJob(product.id)}
              reviewStatus={getReviewStatus(product.id)}
              view="list"
              onApprove={() => onApprove(product.id)}
              onReject={() => onReject(product.id)}
              onEditPrompt={() => onEditPrompt(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((product) => (
            <ReviewVideoCard
              key={product.id}
              product={product}
              videoJob={getVideoJob(product.id)}
              reviewStatus={getReviewStatus(product.id)}
              view="grid"
              onApprove={() => onApprove(product.id)}
              onReject={() => onReject(product.id)}
              onEditPrompt={() => onEditPrompt(product.id)}
            />
          ))}
        </div>
      )}

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="text-sm text-muted-foreground">
            {canContinue ? (
              <span>
                <span className="font-semibold text-foreground">{approvedCount}</span> video dışa aktarmaya hazır
              </span>
            ) : (
              <span>Devam etmek için en az bir videoyu onaylayın</span>
            )}
          </div>
          <Button size="sm" disabled={!canContinue} onClick={onContinue}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Dışa aktarmaya geç
          </Button>
        </div>
      </div>
    </div>
  );
}
