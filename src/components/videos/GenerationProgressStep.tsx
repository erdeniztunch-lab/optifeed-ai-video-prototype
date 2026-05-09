import { useEffect, useRef, useState } from "react";
import { CheckCircle, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Product } from "@/data/products";
import {
  DEMO_VIDEO_GENERATION_DELAY_MS,
  ESTIMATED_MINUTES_PER_VIDEO,
  SAMPLE_VIDEO,
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
  const inFlightCount = jobs.filter((j) => j.status !== "ready").length;
  const allComplete = readyCount === jobs.length && jobs.length > 0;
  const anyReady = readyCount > 0;
  const estimatedRemainingMin = inFlightCount * ESTIMATED_MINUTES_PER_VIDEO;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 md:px-10">
      {/* Header */}
      <div className="mb-8">
        {allComplete ? (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-7 w-7 text-success" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">All videos ready!</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {jobs.length} video{jobs.length !== 1 ? "s" : ""} generated successfully.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Generating videos...</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {readyCount} / {jobs.length} videos ready
              {estimatedRemainingMin > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground/70">
                  <Clock className="h-3.5 w-3.5" />
                  ~{estimatedRemainingMin} min remaining
                </span>
              )}
            </p>
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
              You can start reviewing the videos that are ready — you don't have to wait for all of
              them.
            </p>
          )}
          <Button size="lg" onClick={onComplete} className={cn(allComplete && "w-full sm:w-auto")}>
            Review videos →
          </Button>
        </div>
      )}
    </div>
  );
}
