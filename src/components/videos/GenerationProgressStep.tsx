import { useEffect, useRef, useState } from "react";
import { CheckCircle, Coins, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import {
  DEMO_VIDEO_GENERATION_DELAY_MS,
  SAMPLE_VIDEO,
  TOKEN_COST_PER_VIDEO,
} from "@/data/tokens";
import { type VideoProgressJob } from "@/types/video-flow";
import { VideoProgressCard } from "./VideoProgressCard";

interface GenerationProgressStepProps {
  products: Product[];
  onComplete: () => void;
}

export function GenerationProgressStep({ products, onComplete }: GenerationProgressStepProps) {
  const [jobs, setJobs] = useState<VideoProgressJob[]>(() =>
    products.map((p) => ({
      productId: p.id,
      productName: p.name,
      productImage: p.image,
      status: "pending",
      videoUrl: null,
    })),
  );

  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    if (products.length === 0) return;

    const delay = DEMO_VIDEO_GENERATION_DELAY_MS;

    // Kick off first video immediately
    setJobs((prev) =>
      prev.map((j, i) => (i === 0 ? { ...j, status: "generating" } : j)),
    );

    // Each video becomes ready staggered by `delay` ms; the next one starts generating
    for (let i = 0; i < products.length; i++) {
      const id = window.setTimeout(() => {
        setJobs((prev) =>
          prev.map((j, idx) => {
            if (idx === i) return { ...j, status: "ready", videoUrl: SAMPLE_VIDEO };
            if (idx === i + 1) return { ...j, status: "generating" };
            return j;
          }),
        );
      }, (i + 1) * delay);
      timeoutRefs.current.push(id);
    }

    return () => {
      timeoutRefs.current.forEach((id) => window.clearTimeout(id));
      timeoutRefs.current = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const readyCount = jobs.filter((j) => j.status === "ready").length;

  const [displayedTokens, setDisplayedTokens] = useState(0);
  useEffect(() => {
    setDisplayedTokens(readyCount * TOKEN_COST_PER_VIDEO);
  }, [readyCount]);
  const allComplete = readyCount === jobs.length && jobs.length > 0;
  const anyReady = readyCount > 0;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10">
      {/* Header */}
      <div className="mb-8">
        {allComplete ? (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-7 w-7 text-success" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Tüm videolar hazır!</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {jobs.length} video başarıyla üretildi.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Videolar üretiliyor...</h2>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                {readyCount} / {jobs.length} video hazır
              </p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{
              width: jobs.length > 0 ? `${(readyCount / jobs.length) * 100}%` : "0%",
            }}
          />
        </div>
      </div>

      {/* Job list */}
      <div className="space-y-2">
        {jobs.map((job) => (
          <VideoProgressCard key={job.productId} job={job} />
        ))}
      </div>

      {/* Fixed bottom-left token counter */}
      {!allComplete && displayedTokens > 0 && (
        <div className="fixed bottom-6 left-6 z-30 md:left-72">
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/95 px-4 py-2 shadow-sm backdrop-blur">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-700">
              <span
                key={displayedTokens}
                className="inline-block font-semibold tabular-nums animate-token-tick"
              >
                {displayedTokens}
              </span>
              {" "}token harcandı
            </span>
          </div>
        </div>
      )}

      {/* Early review note + CTA */}
      {anyReady && (
        <div
          className={cn(
            "mt-8 rounded-2xl border p-5 text-center",
            allComplete
              ? "border-success/25 bg-success/5"
              : "border-border bg-card",
          )}
        >
          {!allComplete && (
            <p className="mb-3 text-sm text-muted-foreground">
              Hazır olan videoları incelemeye başlayabilirsiniz — tümünü beklemeniz gerekmez.
            </p>
          )}
          <Button size="lg" onClick={onComplete} className={cn(allComplete && "w-full sm:w-auto")}>
            Videoları İncele →
          </Button>
        </div>
      )}
    </div>
  );
}
