import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type TemplateDefinition } from "@/data/templates";

interface TemplateCardProps {
  template: TemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}

export function TemplateCard({ template, selected, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border text-left transition-all",
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
        <p className="font-semibold text-foreground">{template.label}</p>
        <p className="text-sm text-muted-foreground">{template.description}</p>
        {template.helperText && (
          <span className="mt-1 inline-flex self-start rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {template.helperText}
          </span>
        )}
      </div>
    </button>
  );
}
