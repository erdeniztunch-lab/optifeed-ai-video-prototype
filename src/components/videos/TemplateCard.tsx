import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { type TemplateDefinition } from "@/data/templates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TemplateCardProps {
  template: TemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}

export function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
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
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border text-left transition-all cursor-pointer",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-foreground/20 hover:shadow-sm",
      )}
    >
      {/* Preview image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={template.previewImage}
          alt={template.label}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {selected && <div className="absolute inset-0 bg-primary/8" />}

        {/* Selection indicator */}
        <div
          className={cn(
            "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-white/80 bg-white/90 text-transparent",
          )}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </div>
      </div>

      {/* Card body */}
      <div className={cn("flex flex-col gap-1 p-3", selected && "bg-accent/30")}>

        {/* Label row: label solda, ⓘ sağda */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-foreground">{template.label}</p>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground focus:outline-none"
                aria-label={`${template.label} hakkında daha fazla bilgi`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>

            <PopoverContent side="right" align="start" className="w-72 p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{template.label}</p>

              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                {template.details.whenToUse}
              </p>

              <div className="mb-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Güçlü yanları
                </p>
                <ul className="space-y-1">
                  {template.details.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-muted/60 px-3 py-2">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Dikkat
                </p>
                <p className="text-xs text-muted-foreground">{template.details.avoid}</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <p className="text-sm text-muted-foreground">{template.description}</p>
        {template.helperText && (
          <span className="mt-1 inline-flex self-start rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {template.helperText}
          </span>
        )}
      </div>
    </div>
  );
}
