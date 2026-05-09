import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type VideoFolder } from "@/data/folders";

interface FolderCardProps {
  folder: VideoFolder;
  onOpen: () => void;
}

export function FolderCard({ folder, onOpen }: FolderCardProps) {
  const formattedDate = new Date(folder.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all",
        "hover:border-primary/30 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold text-foreground leading-snug">
          {folder.name}
        </p>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 mt-0.5" />
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
          {folder.videoCount} video
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            folder.status === "active"
              ? "bg-success/10 text-success border border-success/20"
              : "bg-muted text-muted-foreground border border-border",
          )}
        >
          {folder.status === "active" ? "Aktif" : "Taslak"}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{formattedDate}</p>
    </button>
  );
}
