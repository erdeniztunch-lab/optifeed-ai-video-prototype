import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Download, Globe, Music2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export type SendChannel = "google" | "meta" | "tiktok";

interface Props {
  onSend: (channels: SendChannel[]) => void;
  onSkip: () => void;
}

const OPTIONS: { id: SendChannel; label: string; description: string; Icon: typeof Globe }[] = [
  { id: "google", label: "Google feed", description: "Merchant Center product video", Icon: Globe },
  { id: "meta", label: "Meta feed", description: "Facebook & Instagram catalog", Icon: ShoppingBag },
  { id: "tiktok", label: "TikTok feed", description: "TikTok Shop catalog", Icon: Music2 },
];

export function SendStep({ onSend, onSkip }: Props) {
  const [selected, setSelected] = useState<SendChannel[]>(["meta"]);

  const toggle = (id: SendChannel) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-start justify-center px-6 py-8">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
            <Check className="h-5 w-5 text-success" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Video approved</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Choose where to use this video.</p>
        </div>

        <div className="space-y-2.5">
          {OPTIONS.map((opt) => {
            const on = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all",
                  on ? "border-primary ring-2 ring-primary/15" : "border-border hover:border-foreground/20",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                  <opt.Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {on && <Check className="h-3 w-3" strokeWidth={3} />}
                </div>
              </button>
            );
          })}

          <button className="flex w-full items-center gap-4 rounded-xl border border-dashed bg-card p-4 text-left transition-colors hover:border-foreground/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Download video</p>
              <p className="text-xs text-muted-foreground">Save MP4 to your computer</p>
            </div>
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="w-full"
            disabled={selected.length === 0}
            onClick={() => onSend(selected)}
          >
            Send video
          </Button>
          <button
            onClick={onSkip}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
