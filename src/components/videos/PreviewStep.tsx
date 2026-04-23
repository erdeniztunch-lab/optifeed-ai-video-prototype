import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Pause, Play, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import type { Format } from "./GenerateDialog";

interface Props {
  products: Product[];
  format: Format;
  onApproveAll: () => void;
  onBack: () => void;
}

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export function PreviewStep({ products, format, onApproveAll, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const product = products[index];
  const isLast = index === products.length - 1;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [index]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const handleApprove = () => {
    if (isLast) onApproveAll();
    else setIndex((i) => i + 1);
  };

  if (!product) return null;

  return (
    <div className="px-6 py-2 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Video */}
        <div>
          <div
            className={cn(
              "relative mx-auto overflow-hidden rounded-2xl border bg-foreground shadow-pop",
              format === "vertical" ? "max-w-sm aspect-[9/16]" : "aspect-square max-w-2xl",
            )}
          >
            <video
              ref={videoRef}
              src={SAMPLE_VIDEO}
              className="h-full w-full object-cover"
              autoPlay
              muted={muted}
              loop
              playsInline
            />
            {/* Overlay product image to suggest it's a product video */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur px-3 py-1 text-xs font-medium text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {product.brand}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="text-white">
                <p className="text-lg font-semibold leading-tight">{product.name}</p>
                <p className="text-xs opacity-80">Created from your catalog</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={togglePlay}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="flex h-8 w-8 items-center justify-center rounded-md border bg-card disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium text-foreground">
              Draft {index + 1} of {products.length}
            </span>
            <button
              onClick={() => setIndex((i) => Math.min(products.length - 1, i + 1))}
              disabled={isLast}
              className="flex h-8 w-8 items-center justify-center rounded-md border bg-card disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Side panel */}
        <aside className="rounded-2xl border bg-card p-6 shadow-soft h-fit">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <p className="truncate text-base font-semibold text-foreground">{product.name}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t pt-5">
            <Detail text="Created from existing product images" />
            <Detail text="Ready for catalog use" />
          </div>

          <div className="mt-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Draft
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <Button size="lg" className="w-full" onClick={handleApprove}>
              <Check className="h-4 w-4" />
              {isLast ? "Approve & finish" : "Approve"}
            </Button>
            <Button size="lg" variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <button
              onClick={onBack}
              className="w-full rounded-md py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              ← Back to products
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-soft text-success">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      {text}
    </div>
  );
}
