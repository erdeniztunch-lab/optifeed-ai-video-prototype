import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Plus, Search, Video, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FolderCard } from "@/components/videos/FolderCard";
import { EmptyState } from "@/components/videos/EmptyState";
import { type VideoFolder, type FolderStatus } from "@/data/folders";
import { PRODUCTS } from "@/data/products";

type TabValue = "all" | FolderStatus;
type SortValue = "updatedAt" | "createdAt" | "name";

const TAB_LABELS: Record<TabValue, string> = {
  all: "Tümü",
  active: "Aktif",
  draft: "Taslak",
  setup_in_progress: "Üretim sürüyor",
  archived: "Arşiv",
};

const SORT_LABELS: Record<SortValue, string> = {
  updatedAt: "Son güncelleme",
  createdAt: "Oluşturma tarihi",
  name: "İsim",
};

interface LibraryStepProps {
  folders: VideoFolder[];
  onOpenFolder: (id: string) => void;
  onNewCampaign: () => void;
  onToggleStatus: (id: string) => void;
  tokenBalance: number;
  pendingCounts: Record<string, number>;
  onResumeFolder: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onArchiveFolder: (id: string) => void;
}

export function LibraryStep({
  folders,
  onOpenFolder,
  onNewCampaign,
  onToggleStatus,
  tokenBalance,
  pendingCounts,
  onResumeFolder,
  onDeleteFolder,
  onRenameFolder,
  onArchiveFolder,
}: LibraryStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [sortBy, setSortBy] = useState<SortValue>("updatedAt");
  const [query, setQuery] = useState("");

  const productImagesMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const folder of folders) {
      if (folder.productIds?.length) {
        map[folder.id] = folder.productIds
          .map((pid) => PRODUCTS.find((p) => p.id === pid)?.image)
          .filter(Boolean) as string[];
      }
    }
    return map;
  }, [folders]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = activeTab === "all" ? [...folders] : folders.filter((f) => f.status === activeTab);
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q));
    switch (sortBy) {
      case "name":      return list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      case "createdAt": return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      default:          return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
  }, [folders, activeTab, sortBy, query]);

  const isEmpty = folders.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur px-6 py-3 md:px-10">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Optifeed</span>
          <ChevronRight className="h-3 w-3" />
          <span>AI Studio</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">Video</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
            <Zap className="h-3 w-3 text-amber-500" />
            {tokenBalance.toLocaleString("tr-TR")} token
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-xs font-semibold text-white select-none">
            O
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">

        {/* ── Empty state ─────────────────────────────────────────────────────── */}
        {isEmpty && (
          <EmptyState
            icon={Video}
            title="Henüz hiç kampanyanız yok"
            description="Ürünleriniz için yapay zeka destekli video oluşturmaya hemen başlayın."
            actionLabel="İlk kampanyayı oluştur"
            onAction={onNewCampaign}
          />
        )}

        {/* ── Filled state ────────────────────────────────────────────────────── */}
        {!isEmpty && (
          <>
            {/* Page header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground">Video campaigns</h1>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Kampanya ara..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 bg-card w-52"
                  />
                </div>
                <button
                  type="button"
                  onClick={onNewCampaign}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" />
                  Yeni kampanya
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <div className="mb-5 flex gap-0 border-b border-border">
              {(Object.keys(TAB_LABELS) as TabValue[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === tab
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>

            {/* Sort pills */}
            <div className="mb-6 flex flex-wrap gap-2">
              {(Object.keys(SORT_LABELS) as SortValue[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortBy(s)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    sortBy === s
                      ? "bg-accent text-accent-foreground"
                      : "border border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                  )}
                >
                  {SORT_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Campaign grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CampaignCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onOpen={() => onOpenFolder(folder.id)}
                      onToggleStatus={(e) => { e.stopPropagation(); onToggleStatus(folder.id); }}
                      pendingCount={pendingCounts[folder.id] ?? 0}
                      productImages={productImagesMap[folder.id]}
                      onResume={() => onResumeFolder(folder.id)}
                      onDelete={() => onDeleteFolder(folder.id)}
                      onRename={(newName) => onRenameFolder(folder.id, newName)}
                      onArchive={() => onArchiveFolder(folder.id)}
                    />
                  ))}

                  {/* Dashed new campaign card */}
                  <button
                    type="button"
                    onClick={onNewCampaign}
                    className={cn(
                      "flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border",
                      "text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    <Plus className="h-8 w-8 opacity-50" />
                    <span className="text-sm font-medium">Yeni kampanya</span>
                  </button>
                </div>

                {filtered.length === 0 && (
                  <EmptyState
                    icon={Search}
                    title="Bu sekmede kampanya yok"
                    description="Bu filtreyle eşleşen kampanya bulunamadı."
                    actionLabel="Yeni kampanya oluştur"
                    onAction={onNewCampaign}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CampaignCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
