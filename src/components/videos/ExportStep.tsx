import { useState } from "react";
import { Archive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEED_EXPORTS } from "@/data/feedExports";
import { SAMPLE_VIDEO } from "@/data/tokens";
import { ExportFeedCard } from "./ExportFeedCard";

interface ExportStepProps {
  approvedCount: number;
  onComplete: (feedNames: string[]) => void;
  onSkip: () => void;
}

type FeedState = {
  attribute: string;
  applied: boolean;
};

export function ExportStep({ approvedCount, onComplete, onSkip }: ExportStepProps) {
  const [feedStates, setFeedStates] = useState<Record<string, FeedState>>(() =>
    Object.fromEntries(
      FEED_EXPORTS.map((f) => [f.id, { attribute: f.videoAttribute, applied: false }]),
    ),
  );
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const appliedCount = Object.values(feedStates).filter((s) => s.applied).length;
  const allApplied = appliedCount === FEED_EXPORTS.length;
  const canComplete = appliedCount > 0;

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

  const handleApplyAll = () => {
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
          <h2 className="text-2xl font-semibold text-foreground">Apply to exports</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{approvedCount}</span> approved video
            {approvedCount !== 1 ? "s" : ""} ready to export
          </p>
        </div>
        {!allApplied && (
          <Button variant="outline" size="sm" onClick={handleApplyAll}>
            Apply all
          </Button>
        )}
      </div>

      {/* Feed cards grid */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEED_EXPORTS.map((feed) => (
          <ExportFeedCard
            key={feed.id}
            feed={feed}
            approvedCount={approvedCount}
            applied={feedStates[feed.id]?.applied ?? false}
            selectedAttribute={feedStates[feed.id]?.attribute ?? feed.videoAttribute}
            onAttributeChange={(attr) => handleAttributeChange(feed.id, attr)}
            onApply={() => handleApply(feed.id)}
          />
        ))}
      </div>

      {/* Download section */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Download videos</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={SAMPLE_VIDEO}
            download="approved-video.mp4"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-foreground/30"
          >
            <Download className="h-4 w-4" />
            Download MP4 ({approvedCount} file{approvedCount !== 1 ? "s" : ""})
          </a>
          <button
            type="button"
            onClick={handleZipDownload}
            disabled={isDownloadingZip}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-foreground/30 disabled:opacity-60"
          >
            <Archive className="h-4 w-4" />
            {isDownloadingZip ? "Preparing ZIP..." : "Download as ZIP"}
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
          Complete →
        </Button>
        {canComplete && (
          <p className="text-xs text-muted-foreground">
            Applied to {appliedCount} feed export{appliedCount !== 1 ? "s" : ""}
          </p>
        )}
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Skip and complete
        </button>
      </div>
    </div>
  );
}
