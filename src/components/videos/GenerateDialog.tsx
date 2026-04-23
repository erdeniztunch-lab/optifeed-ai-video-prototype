import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export type Format = "square" | "vertical";
export type Channel = "meta" | "tiktok" | "google";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  count: number;
  thumbnails: string[];
  onGenerate: (opts: { format: Format; channels: Channel[] }) => void;
}

const FORMATS: { id: Format; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "vertical", label: "Vertical" },
];
const CHANNELS: { id: Channel; label: string }[] = [
  { id: "meta", label: "Meta" },
  { id: "tiktok", label: "TikTok" },
  { id: "google", label: "Google" },
];

export function GenerateDialog({ open, onOpenChange, count, thumbnails, onGenerate }: Props) {
  const [format, setFormat] = useState<Format>("square");
  const [channels, setChannels] = useState<Channel[]>(["meta"]);
  const [loading, setLoading] = useState(false);

  const toggleChannel = (c: Channel) =>
    setChannels((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGenerate({ format, channels });
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        {!loading ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Generate video drafts</DialogTitle>
            </DialogHeader>

            <div className="space-y-1 pt-1">
              <p className="text-sm font-medium text-foreground">
                You selected {count} product{count === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-muted-foreground">
                We'll use your product images and catalog data to create video drafts.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Format
                </p>
                <div className="inline-flex rounded-lg border bg-muted p-1">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={cn(
                        "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                        format === f.id
                          ? "bg-card text-foreground shadow-card"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Channel intent
                </p>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS.map((c) => {
                    const on = channels.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleChannel(c.id)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                          on
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border bg-card text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={channels.length === 0}>
                <Sparkles className="h-4 w-4" />
                Generate drafts
              </Button>
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-5 flex justify-center -space-x-3">
              {thumbnails.slice(0, 4).map((t, i) => (
                <div
                  key={i}
                  className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-card shadow-card"
                  style={{ zIndex: 10 - i }}
                >
                  <img src={t} alt="" className="h-full w-full object-cover" />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
                    style={{ backgroundSize: "400px 100%" }}
                  />
                </div>
              ))}
            </div>
            <p className="text-base font-medium text-foreground">Creating your videos…</p>
            <p className="mt-1 text-sm text-muted-foreground">This usually takes a few seconds.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
