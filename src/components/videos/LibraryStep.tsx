import { useMemo, useState } from "react";
import { CheckCircle, ChevronRight, Plus, Search, Video, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FolderCard } from "@/components/videos/FolderCard";
import { type VideoFolder, type FolderStatus } from "@/data/folders";

type TabValue = "all" | FolderStatus;
type SortValue = "updatedAt" | "createdAt" | "name";

const TAB_LABELS: Record<TabValue, string> = {
  all: "Tümü",
  active: "Aktif",
  draft: "Taslak",
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
  tokenBalance: number;
}

export function LibraryStep({ folders, onOpenFolder, onNewCampaign, tokenBalance }: LibraryStepProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [sortBy, setSortBy] = useState<SortValue>("updatedAt");
  const [query, setQuery] = useState("");

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
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
              <Video className="h-8 w-8 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Henüz hiç kampanyanız yok</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Ürünleriniz için yapay zeka destekli video oluşturmaya hemen başlayın.
              </p>
            </div>
            <button
              type="button"
              onClick={onNewCampaign}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              İlk kampanyayı oluştur
            </button>
            <div className="mt-4 flex flex-col gap-2 text-left">
              {[
                "Ürün seçin",
                "Şablon ve prompt ayarlayın",
                "Videolarınızı onaylayın ve dışa aktarın",
              ].map((step) => (
                <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                  {step}
                </div>
              ))}
            </div>
          </div>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={() => onOpenFolder(folder.id)}
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

            {/* Empty filtered state */}
            {filtered.length === 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Bu filtreyle eşleşen kampanya bulunamadı.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
