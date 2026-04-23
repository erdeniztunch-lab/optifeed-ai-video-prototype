import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type Template =
  | "product-spotlight"
  | "sale-promotion"
  | "new-arrival"
  | "social-story";

interface Props {
  products: Product[];
  onGenerate: (opts: { template: Template }) => void;
  onBack: () => void;
}

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

const TEMPLATES: {
  id: Template;
  label: string;
  description: string;
  recommendation?: string;
  helperText?: string;
  previewImage: string;
  previewClassName: string;
  thumbnailClassName: string;
  renderPreviewChrome: () => JSX.Element;
  renderPickerChrome: () => JSX.Element;
}[] = [
  {
    id: "product-spotlight",
    label: "Product Spotlight",
    description: "Best for showcasing individual products clearly.",
    recommendation: "No discount detected -> best for product-focused format",
    helperText: "Best match for catalog campaigns",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&h=720&q=80",
    previewClassName: "object-cover",
    thumbnailClassName: "object-cover",
    renderPreviewChrome: () => (
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
    ),
    renderPickerChrome: () => (
      <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-900">
        Clean product focus
      </div>
    ),
  },
  {
    id: "sale-promotion",
    label: "Sale Promotion",
    description: "Best for discounted products and promotional offers.",
    helperText: "Use when price-drop messaging should lead the creative",
    previewImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&h=720&q=80",
    previewClassName: "object-cover",
    thumbnailClassName: "object-cover",
    renderPreviewChrome: () => (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/75 via-red-500/20 to-black/55" />
        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
          -25% Off
        </div>
        <div className="absolute bottom-4 right-4 rounded-2xl bg-white/90 px-4 py-3 text-right text-slate-900 shadow-lg">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">From</p>
          <p className="text-lg font-semibold">$49</p>
        </div>
      </>
    ),
    renderPickerChrome: () => (
      <>
        <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          Sale
        </div>
        <div className="absolute bottom-2 right-2 rounded-xl bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-900">
          Pricing overlay
        </div>
      </>
    ),
  },
  {
    id: "new-arrival",
    label: "New Arrival",
    description: "Best for launching new products.",
    helperText: "Strong fit for fresh arrivals and launch moments",
    previewImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&h=720&q=80",
    previewClassName: "object-cover",
    thumbnailClassName: "object-cover",
    renderPreviewChrome: () => (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-950">
          New
        </div>
      </>
    ),
    renderPickerChrome: () => (
      <div className="absolute left-2 top-2 rounded-full bg-emerald-400 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-950">
        New
      </div>
    ),
  },
  {
    id: "social-story",
    label: "Social Story",
    description: "Best for vertical, mobile-first placements.",
    helperText: "Built for fast-scrolling mobile placements",
    previewImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&h=1200&q=80",
    previewClassName: "object-cover object-top",
    thumbnailClassName: "object-cover object-top",
    renderPreviewChrome: () => (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        <div className="absolute right-4 top-4 w-[88px] rounded-[24px] border border-white/35 bg-black/25 p-1.5 backdrop-blur">
          <div className="aspect-[9/16] rounded-[18px] border border-white/25 bg-white/10" />
        </div>
      </>
    ),
    renderPickerChrome: () => (
      <div className="absolute right-2 top-2 w-8 rounded-xl border border-white/35 bg-black/25 p-1 backdrop-blur">
        <div className="aspect-[9/16] rounded-lg bg-white/20" />
      </div>
    ),
  },
];

export function GenerateStep({ products, onGenerate, onBack }: Props) {
  const [template, setTemplate] = useState<Template>("product-spotlight");
  const [draftTemplate, setDraftTemplate] = useState<Template>("product-spotlight");
  const [showPicker, setShowPicker] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [sampleTemplate, setSampleTemplate] = useState<Template>("product-spotlight");
  const [loading, setLoading] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const pickerVideoRefs = useRef<Partial<Record<Template, HTMLVideoElement | null>>>({});
  const pickerHoverTimeouts = useRef<Partial<Record<Template, number>>>({});
  const selectedTemplate = TEMPLATES.find((item) => item.id === template)!;
  const primaryProduct = products[0];
  const samplePreviewTemplate = TEMPLATES.find((item) => item.id === sampleTemplate)!;

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
      Object.values(pickerHoverTimeouts.current).forEach((timeoutId) => {
        if (timeoutId) window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGenerate({ template });
    }, 1200);
  };

  const handleOpenPicker = () => {
    setDraftTemplate(template);
    setShowPicker(true);
  };

  const handleApplyTemplate = () => {
    setTemplate(draftTemplate);
    setShowPicker(false);
  };

  const handlePreviewMouseEnter = async () => {
    const video = previewVideoRef.current;
    if (!video) return;
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    try {
      video.currentTime = 0;
      await video.play();
      hoverTimeoutRef.current = window.setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, 4000);
    } catch {
      // Ignore autoplay restrictions on hover previews.
    }
  };

  const handlePreviewMouseLeave = () => {
    const video = previewVideoRef.current;
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const handlePickerHoverStart = async (templateId: Template) => {
    const video = pickerVideoRefs.current[templateId];
    if (!video) return;
    const existingTimeout = pickerHoverTimeouts.current[templateId];
    if (existingTimeout) window.clearTimeout(existingTimeout);
    try {
      video.currentTime = 0;
      await video.play();
      pickerHoverTimeouts.current[templateId] = window.setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, 4000);
    } catch {
      // Ignore autoplay restrictions on hover previews.
    }
  };

  const handlePickerHoverEnd = (templateId: Template) => {
    const video = pickerVideoRefs.current[templateId];
    const existingTimeout = pickerHoverTimeouts.current[templateId];
    if (existingTimeout) window.clearTimeout(existingTimeout);
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const handlePickerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TEMPLATES.findIndex((item) => item.id === draftTemplate);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % TEMPLATES.length;
      setDraftTemplate(TEMPLATES[nextIndex].id);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextIndex = (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length;
      setDraftTemplate(TEMPLATES[nextIndex].id);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      handleApplyTemplate();
    }
  };

  const generateLabel =
    products.length === 1 && primaryProduct
      ? `Generate draft for "${primaryProduct.name}"`
      : `Generate ${products.length} drafts`;

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl rounded-3xl border bg-card p-8 shadow-soft">
        {!loading ? (
          <div className="space-y-6">
            <div className="space-y-4 text-center sm:text-left">
              <h1 className="text-3xl font-semibold text-foreground">Generate video drafts</h1>

              {primaryProduct && (
                <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-border bg-muted/40 px-3 py-3">
                  <img
                    src={primaryProduct.image}
                    alt={primaryProduct.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 text-left">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {primaryProduct.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {products.length === 1
                        ? "Ready to turn into a draft"
                        : `+${products.length - 1} more selected product${
                            products.length - 1 === 1 ? "" : "s"
                          }`}
                    </p>
                  </div>
                </div>
              )}

              <p className="max-w-2xl text-sm text-muted-foreground">
                We'll use your product images and catalog data to create polished draft videos.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <button
                  type="button"
                  onClick={() => setShowSample(true)}
                  onMouseEnter={handlePreviewMouseEnter}
                  onMouseLeave={handlePreviewMouseLeave}
                  className="group overflow-hidden rounded-[28px] border border-border bg-slate-950 text-left"
                >
                  <div className="relative aspect-[16/9]">
                    <img
                      src={selectedTemplate.previewImage}
                      alt={`${selectedTemplate.label} preview`}
                      className={cn("h-full w-full", selectedTemplate.previewClassName)}
                    />
                    <video
                      ref={previewVideoRef}
                      src={SAMPLE_VIDEO}
                      muted
                      playsInline
                      loop
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    {selectedTemplate.renderPreviewChrome()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/70">Preview</p>
                        <h2 className="mt-2 text-xl font-semibold">{selectedTemplate.label}</h2>
                      </div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-slate-950 shadow-lg transition-transform duration-200 group-hover:scale-105">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </div>
                  </div>
                </button>

                <div className="flex flex-col justify-between rounded-[28px] border border-border bg-slate-50 p-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {selectedTemplate.label}
                      </h2>
                      {selectedTemplate.recommendation && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          Recommended for this product
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.description}
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Created from your product images and catalog data</p>
                      <p>No manual editing required</p>
                    </div>
                    {selectedTemplate.recommendation && (
                      <p className="text-xs text-muted-foreground">
                        {selectedTemplate.recommendation}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setShowSample(true)}
                      className="inline-flex items-center rounded-full px-0 py-2 text-sm font-medium text-primary transition hover:text-primary/90"
                    >
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Play sample
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenPicker}
                      className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onBack} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {generateLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-white p-12 text-center shadow-soft">
            <div className="mx-auto mb-5 flex justify-center -space-x-3">
              {products.slice(0, 4).map((product, i) => (
                <div
                  key={product.id}
                  className="relative h-14 w-14 overflow-hidden rounded-xl border border-border bg-muted"
                  style={{ zIndex: 10 - i }}
                >
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-base font-semibold text-foreground">Creating drafts...</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Using {products.reduce((sum, product) => sum + (product.image ? 1 : 0), 0)} images •
              ~10s
            </p>
          </div>
        )}
      </div>

      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent className="max-w-2xl rounded-3xl border border-border bg-card p-0 shadow-pop">
          <DialogHeader className="border-b border-border px-6 py-5 text-left">
            <DialogTitle>Change video type (optional)</DialogTitle>
            <DialogDescription>Use the recommended type or choose another.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 px-6 py-5" onKeyDown={handlePickerKeyDown}>
            {TEMPLATES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDraftTemplate(item.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-primary/20",
                  draftTemplate === item.id
                    ? "border-primary bg-accent ring-2 ring-primary/15"
                    : "border-border bg-white hover:border-foreground/25",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    draftTemplate === item.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                </span>
                <div
                  className="group relative h-16 w-24 overflow-hidden rounded-2xl bg-slate-950"
                  onMouseEnter={() => handlePickerHoverStart(item.id)}
                  onMouseLeave={() => handlePickerHoverEnd(item.id)}
                >
                  <img
                    src={item.previewImage}
                    alt={`${item.label} thumbnail`}
                    className={cn("h-full w-full", item.thumbnailClassName)}
                  />
                  <video
                    ref={(node) => {
                      pickerVideoRefs.current[item.id] = node;
                    }}
                    src={SAMPLE_VIDEO}
                    muted
                    playsInline
                    loop
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  {item.renderPickerChrome()}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSampleTemplate(item.id);
                      setShowSample(true);
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                    aria-label={`Play ${item.label} sample`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow">
                      <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                    </span>
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{item.label}</span>
                    {item.recommendation && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        Recommended for this product
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  {item.recommendation && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.recommendation}</p>
                  )}
                  {item.helperText && (
                    <p className="mt-1 text-xs text-muted-foreground/85">{item.helperText}</p>
                  )}
                </div>
              </button>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Works with your current product images and feed data.
            </p>
          </div>

          <DialogFooter className="border-t border-border px-6 py-5">
            <Button variant="ghost" onClick={() => setShowPicker(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyTemplate}>Use this type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSample} onOpenChange={setShowSample}>
        <DialogContent className="max-w-4xl rounded-3xl border border-border bg-card p-0 shadow-pop">
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm font-medium text-foreground">{samplePreviewTemplate.label} sample</p>
            <p className="text-xs text-muted-foreground">{samplePreviewTemplate.description}</p>
          </div>
          <div className="overflow-hidden rounded-[24px] bg-black">
            <video
              src={SAMPLE_VIDEO}
              controls
              autoPlay
              loop
              playsInline
              className="aspect-video w-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
