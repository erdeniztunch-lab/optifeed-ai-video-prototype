import { useRef } from "react";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type TextileTemplateDefinition } from "@/data/textile-templates";

interface Props {
  template: TextileTemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}

export function TextileTemplateCard({ template, selected, onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border text-left transition-all cursor-pointer",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-foreground/20 hover:shadow-sm",
      )}
    >
      {/* Görsel alan — 3:4 portrait */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <video
          ref={videoRef}
          src={template.previewVideo}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Seçim indikatörü — sağ üst */}
        <div
          className={cn(
            "absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-white/80 bg-white/90 text-transparent",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </div>

        {/* Sol alt — sahne metadata + hover pill */}
        <div className="absolute bottom-2 left-2 z-10 flex flex-col items-start gap-1">
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
              {template.sceneType}
            </span>
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
              8-10 sn
            </span>
          </div>
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            ▶ Önizle
          </span>
        </div>

        {selected && <div className="absolute inset-0 bg-primary/[0.08]" />}
      </div>

      {/* Kart body */}
      <div className={cn("flex flex-col gap-1 p-3", selected && "bg-accent/30")}>
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-foreground">{template.label}</p>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded-md p-1 text-primary/60 transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none"
                aria-label={`${template.label} hakkında daha fazla bilgi`}
              >
                <Info className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-72 p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{template.label}</p>

              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Senaryo akışı
              </p>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                {template.details.scenarioFlow}
              </p>

              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Uygun ürün tipi
              </p>
              <div className="mb-3 flex flex-wrap gap-1">
                {template.details.suitableProducts.map((p) => (
                  <span
                    key={p}
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="rounded-lg bg-muted/60 px-3 py-2">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Aksesuar
                </p>
                <p className="text-xs text-muted-foreground">{template.details.accessories}</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <p className="text-xs text-muted-foreground">{template.sceneContext}</p>

        <div className="mt-1 flex flex-wrap gap-1">
          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Önerilen
          </span>
          <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {template.sceneType}
          </span>
        </div>
      </div>
    </div>
  );
}
