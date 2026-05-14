import { useState } from "react";
import { Archive, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type Product } from "@/data/products";
import { FEED_EXPORTS } from "@/data/feedExports";
import { SAMPLE_VIDEO } from "@/data/tokens";
import { ExportFeedCard } from "./ExportFeedCard";

interface ExportStepProps {
  approvedCount: number;
  approvedIds: string[];
  selectedProducts: Product[];
  totalVideoCount: number;
  onComplete: (feedNames: string[]) => void;
  onSkip: () => void;
}

type FeedState = {
  attribute: string;
  applied: boolean;
};

export function ExportStep({ approvedCount, approvedIds, selectedProducts, totalVideoCount, onComplete, onSkip }: ExportStepProps) {
  const [feedStates, setFeedStates] = useState<Record<string, FeedState>>(() =>
    Object.fromEntries(
      FEED_EXPORTS.map((f) => [f.id, { attribute: f.videoAttribute, applied: false }]),
    ),
  );
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingAllZip, setIsDownloadingAllZip] = useState(false);

  const appliedCount = Object.values(feedStates).filter((s) => s.applied).length;
  const allApplied = appliedCount === FEED_EXPORTS.length;
  const canComplete = appliedCount > 0;

  const approvedProducts = selectedProducts.filter((p) => approvedIds.includes(p.id));

  const handleAttributeChange = (feedId: string, attr: string) => {
    setFeedStates((prev) => ({
      ...prev,
      [feedId]: { ...prev[feedId], attribute: attr },
    }));
  };

  const handleApply = (feedId: string) => {
    setFeedStates((prev) => ({
      ...prev,
      [feedId]: { ...prev[feedId], applied: true },
    }));
  };

  const handleZipDownloadAll = () => {
    if (isDownloadingAllZip) return;
    setIsDownloadingAllZip(true);
    setTimeout(() => {
      setIsDownloadingAllZip(false);
      toast("Tüm videolar hazırlanıyor... İndirme başladı.");
      const a = document.createElement("a");
      a.href = SAMPLE_VIDEO;
      a.download = "all-videos.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1000);
  };

  const handleApplyAll = () => {
    if (!window.confirm(`Kampanyadaki ${approvedCount} onaylı video seçilen tüm feed'lere uygulanacak. Devam edilsin mi?`)) return;
    setFeedStates((prev) =>
      Object.fromEntries(Object.entries(prev).map(([id, s]) => [id, { ...s, applied: true }])),
    );
  };

  const handleComplete = () => {
    const appliedNames = FEED_EXPORTS.filter((f) => feedStates[f.id]?.applied).map((f) => f.name);
    onComplete(appliedNames);
  };

  const handleZipDownload = () => {
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setTimeout(() => {
      setIsDownloadingZip(false);
      toast("ZIP hazırlanıyor... İndirme başladı.");
      const a = document.createElement("a");
      a.href = SAMPLE_VIDEO;
      a.download = "approved-videos.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:px-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dışa aktar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{approvedCount}</span> onaylı video,{" "}
            kampanyadaki <span className="font-semibold text-foreground">{totalVideoCount}</span> videodan feed'lere aktarılmaya hazır
          </p>
        </div>
        {!allApplied && (
          <Button variant="outline" size="sm" onClick={handleApplyAll}>
            Tümünü uygula
          </Button>
        )}
      </div>

      {/* Approved product strip */}
      {approvedProducts.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex -space-x-2">
            {approvedProducts.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="h-9 w-9 overflow-hidden rounded-lg border-2 border-background bg-muted"
                style={{ zIndex: 10 - i }}
              >
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {approvedProducts.slice(0, 2).map((p) => p.name).join(", ")}
            {approvedProducts.length > 2 && ` +${approvedProducts.length - 2} daha`}
          </p>
        </div>
      )}

      {/* Feed cards grid */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEED_EXPORTS.map((feed) => (
          <ExportFeedCard
            key={feed.id}
            feed={feed}
            applied={feedStates[feed.id]?.applied ?? false}
            selectedAttribute={feedStates[feed.id]?.attribute ?? feed.videoAttribute}
            onAttributeChange={(attr) => handleAttributeChange(feed.id, attr)}
            onApply={() => handleApply(feed.id)}
          />
        ))}
      </div>

      {/* Download section */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Videoları indir</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={SAMPLE_VIDEO}
            download="approved-video.mp4"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-foreground/30"
          >
            <Download className="h-4 w-4" />
            Örnek video indir (MP4)
          </a>
          <button
            type="button"
            onClick={handleZipDownload}
            disabled={isDownloadingZip}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-foreground/30 disabled:opacity-60"
          >
            <Archive className="h-4 w-4" />
            {isDownloadingZip ? "Hazırlanıyor..." : `Onaylananları indir (${approvedCount} video)`}
          </button>
          <button
            type="button"
            onClick={handleZipDownloadAll}
            disabled={isDownloadingAllZip}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-foreground/30 disabled:opacity-60"
          >
            <Archive className="h-4 w-4" />
            {isDownloadingAllZip ? "Hazırlanıyor..." : `Tüm videoları indir (${totalVideoCount} video)`}
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="w-full sm:w-auto sm:min-w-52"
          disabled={!canComplete}
          onClick={handleComplete}
        >
          Tamamla →
        </Button>
        {canComplete && (
          <p className="text-xs text-muted-foreground">
            {appliedCount} dışa aktarıma uygulandı
          </p>
        )}
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Atla ve tamamla
        </button>
      </div>
    </div>
  );
}
