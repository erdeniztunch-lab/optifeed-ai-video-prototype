import { cn } from "@/lib/utils";
import { type VideoFolder } from "@/data/folders";

interface FolderCardProps {
  folder: VideoFolder;
  onOpen: () => void;
}

export function FolderCard({ folder, onOpen }: FolderCardProps) {
  const formattedUpdatedAt = new Date(folder.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const gradientClass =
    folder.status === "active"
      ? "bg-gradient-to-br from-violet-500 to-indigo-600"
      : folder.status === "archived"
        ? "bg-gradient-to-br from-slate-300 to-slate-400"
        : "bg-gradient-to-br from-slate-400 to-slate-500";

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-all",
        "hover:border-primary/30 hover:shadow-md",
      )}
    >
      {/* Thumbnail */}
      <div className={cn("flex h-28 items-center justify-center", gradientClass)}>
        <span className="text-4xl font-bold text-white/70 select-none">
          {folder.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2 p-3">
        <p className="line-clamp-1 text-sm font-semibold text-foreground leading-snug">
          {folder.name}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
            {folder.videoCount} video
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              folder.status === "active"
                ? "bg-success/10 text-success border border-success/20"
                : folder.status === "archived"
                  ? "bg-muted text-muted-foreground/60 border border-border"
                  : "bg-muted text-muted-foreground border border-border",
            )}
          >
            {folder.status === "active" ? "Aktif" : folder.status === "archived" ? "Arşivlendi" : "Taslak"}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">Son güncelleme {formattedUpdatedAt}</p>
      </div>
    </button>
  );
}
