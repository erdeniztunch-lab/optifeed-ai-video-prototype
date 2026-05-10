import { useRef, useState } from "react";
import { FolderPlus, FolderOpen } from "lucide-react";
import { FolderCard } from "@/components/videos/FolderCard";
import { type VideoFolder } from "@/data/folders";

interface LibraryStepProps {
  folders: VideoFolder[];
  onOpenFolder: (id: string) => void;
  onCreateFolder: (name: string) => void;
}

export function LibraryStep({
  folders,
  onOpenFolder,
  onCreateFolder,
}: LibraryStepProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartCreate = () => {
    setIsCreating(true);
    setNewFolderName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleConfirmCreate = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    onCreateFolder(trimmed);
    setIsCreating(false);
    setNewFolderName("");
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewFolderName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirmCreate();
    if (e.key === "Escape") handleCancelCreate();
  };

  const isEmpty = folders.length === 0 && !isCreating;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Video Kütüphanesi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kampanyalarınız için ürün videoları oluşturun ve yönetin.
        </p>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-base font-semibold text-foreground">Henüz video klasörünüz yok</h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Kampanyalarınız için ürün videoları oluşturun ve yönetin.
          </p>
          <button
            type="button"
            onClick={handleStartCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <FolderPlus className="h-4 w-4" />
            İlk videonuzu oluşturun
          </button>
        </div>
      )}

      {/* Filled state */}
      {!isEmpty && (
        <>
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {folders.length} klasör
            </p>
            <button
              type="button"
              onClick={handleStartCreate}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-muted/50"
            >
              <FolderPlus className="h-4 w-4" />
              Yeni klasör
            </button>
          </div>

          {/* Inline creation row */}
          {isCreating && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-primary/30 bg-card p-3">
              <input
                ref={inputRef}
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Klasör adı"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="button"
                onClick={handleConfirmCreate}
                disabled={!newFolderName.trim()}
                className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-40 hover:bg-primary/90"
              >
                Oluştur
              </button>
              <button
                type="button"
                onClick={handleCancelCreate}
                className="rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                İptal
              </button>
            </div>
          )}

          {/* Folder grid — 2 columns max */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onOpen={() => onOpenFolder(folder.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
