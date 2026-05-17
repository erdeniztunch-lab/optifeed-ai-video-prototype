import { useEffect, useRef, useState } from "react";
import { AlertTriangle, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { type VideoFolder } from "@/data/folders";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface FolderCardProps {
  folder: VideoFolder;
  onOpen: () => void;
  onToggleStatus: (e: React.MouseEvent) => void;
  pendingCount?: number;
  productImages?: string[];
  onResume?: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  onArchive?: () => void;
}

export function FolderCard({
  folder,
  onOpen,
  onToggleStatus,
  pendingCount = 0,
  productImages,
  onResume,
  onDelete,
  onRename,
  onArchive,
}: FolderCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const formattedUpdatedAt = new Date(folder.updatedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const closeAndRun = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    closeAndRun(e, () => {
      const newName = window.prompt("Yeni kampanya adı:", folder.name);
      if (newName && newName.trim() && newName.trim() !== folder.name) {
        onRename?.(newName.trim());
      }
    });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    closeAndRun(e, () => setDeleteOpen(true));
  };

  // ── Shared confirm dialog ─────────────────────────────────────────────────────

  const confirmDialog = (
    <ConfirmDialog
      open={deleteOpen}
      title="Kampanyayı sil"
      description={`"${folder.name}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
      confirmLabel="Sil"
      cancelLabel="İptal"
      confirmVariant="destructive"
      onConfirm={() => { onDelete?.(); setDeleteOpen(false); }}
      onCancel={() => setDeleteOpen(false)}
    />
  );

  // ── setup_in_progress variant ─────────────────────────────────────────────────

  if (folder.status === "setup_in_progress") {
    return (
      <>
        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-amber-200/60 bg-card opacity-80">
          <div className="flex h-28 items-center justify-center bg-slate-200/60">
            <span className="select-none text-4xl font-bold text-slate-400/50">
              {folder.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col gap-2 p-3">
            <p className="line-clamp-1 text-sm font-semibold text-foreground leading-snug">
              {folder.name}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Kurulum yarım kaldı</span>
            </div>

            <p className="text-xs text-muted-foreground">Son güncelleme {formattedUpdatedAt}</p>

            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onResume?.(); }}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Devam et →
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setDeleteOpen(true); }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
        {confirmDialog}
      </>
    );
  }

  // ── Normal card ───────────────────────────────────────────────────────────────

  const gradientClass =
    folder.status === "active"
      ? "bg-gradient-to-br from-violet-500 to-indigo-600"
      : folder.status === "archived"
        ? "bg-gradient-to-br from-slate-300 to-slate-400"
        : "bg-gradient-to-br from-slate-400 to-slate-500";

  const hasImages = productImages && productImages.length > 0;

  return (
    <>
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      className={cn(
        "group flex w-full flex-col rounded-xl border border-border bg-card text-left cursor-pointer transition-all",
        "hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      )}
    >
      {/* Thumbnail — overflow-hidden here to clip images while letting the kebab escape */}
      {hasImages ? (
        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-t-xl bg-muted/30">
          <div className="flex items-center">
            {productImages!.slice(0, 4).map((src, i) => (
              <div
                key={i}
                className="h-20 w-20 overflow-hidden rounded-xl border-2 border-background shadow-sm"
                style={{ marginLeft: i > 0 ? "-16px" : "0", zIndex: 10 - i }}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {productImages!.length > 4 && (
              <div
                className="flex h-20 w-10 items-center justify-center rounded-r-xl border-y-2 border-r-2 border-background bg-muted/80 text-xs font-semibold text-muted-foreground"
                style={{ marginLeft: "-16px", zIndex: 6 }}
              >
                +{productImages!.length - 4}
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
        <div
          className={cn(
            "relative flex h-28 items-center justify-center overflow-hidden rounded-t-xl",
            gradientClass,
          )}
        >
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

          <div className="flex items-center gap-1.5">
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
              {folder.status === "active"
                ? "Yayında"
                : folder.status === "archived"
                  ? "Arşivlendi"
                  : "Taslak"}
            </button>

            {/* Kebab menu */}
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Daha fazla seçenek"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 z-50 min-w-[160px] rounded-xl border border-border bg-card p-1 shadow-lg">
                  <MenuItem
                    label="Detay"
                    onClick={(e) => closeAndRun(e, () => toast("Bu özellik yakında"))}
                  />
                  <MenuItem label="Yeniden adlandır" onClick={handleRenameClick} />
                  <MenuItem
                    label="Dışa aktar"
                    onClick={(e) => closeAndRun(e, () => toast("Bu özellik yakında"))}
                  />
                  <MenuItem
                    label="Arşivle"
                    onClick={(e) => closeAndRun(e, () => onArchive?.())}
                    disabled={folder.status === "archived"}
                  />
                  <div className="my-1 h-px bg-border" />
                  <MenuItem label="Sil" onClick={handleDeleteClick} destructive />
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Son güncelleme {formattedUpdatedAt}</p>
      </div>
    </div>
    {confirmDialog}
  </>
  );
}

// ── MenuItem ──────────────────────────────────────────────────────────────────

function MenuItem({
  label,
  onClick,
  destructive = false,
  disabled = false,
}: {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
        destructive ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {label}
    </button>
  );
}
