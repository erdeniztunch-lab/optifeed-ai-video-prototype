import { cn } from "@/lib/utils";
import { type VideoFolder } from "@/data/folders";

interface FolderCardProps {
  folder: VideoFolder;
  onOpen: () => void;
  onToggleStatus: (e: React.MouseEvent) => void;
  pendingCount?: number;
  productImages?: string[];
}

export function FolderCard({
  folder,
  onOpen,
  onToggleStatus,
  pendingCount = 0,
  productImages,
}: FolderCardProps) {
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

  const hasImages = productImages && productImages.length > 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left cursor-pointer transition-all",
        "hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      )}
    >
      {/* Thumbnail */}
      {hasImages ? (
        <div className="relative flex h-28 items-center justify-center overflow-hidden bg-muted/30">
          <div className="flex items-center">
            {productImages.slice(0, 4).map((src, i) => (
              <div
                key={i}
                className="h-20 w-20 overflow-hidden rounded-xl border-2 border-background shadow-sm"
                style={{ marginLeft: i > 0 ? "-16px" : "0", zIndex: 10 - i }}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {productImages.length > 4 && (
              <div
                className="flex h-20 w-10 items-center justify-center rounded-r-xl border-y-2 border-r-2 border-background bg-muted/80 text-xs font-semibold text-muted-foreground"
                style={{ marginLeft: "-16px", zIndex: 6 }}
              >
                +{productImages.length - 4}
              </div>
            )}
          </div>

          {pendingCount > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {pendingCount} onay bekliyor
            </span>
          )}
        </div>
      ) : (
        <div className={cn("relative flex h-28 items-center justify-center", gradientClass)}>
          <span className="select-none text-4xl font-bold text-white/70">
            {folder.name.charAt(0).toUpperCase()}
          </span>

          {pendingCount > 0 && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {pendingCount} onay bekliyor
            </span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-2 p-3">
        <p className="line-clamp-1 text-sm font-semibold text-foreground leading-snug">
          {folder.name}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
            {folder.videoCount} video
          </span>

          <button
            type="button"
            onClick={onToggleStatus}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              folder.status === "active"
                ? "border-success/30 bg-success/10 text-success hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                : folder.status === "archived"
                  ? "border-border bg-muted text-muted-foreground/60 cursor-default"
                  : "border-border bg-muted text-muted-foreground hover:bg-success/10 hover:border-success/30 hover:text-success",
            )}
            disabled={folder.status === "archived"}
          >
            {folder.status === "active" ? "Yayında" : folder.status === "archived" ? "Arşivlendi" : "Taslak"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground">Son güncelleme {formattedUpdatedAt}</p>
      </div>
    </div>
  );
}
