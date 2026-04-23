import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { SendChannel } from "./SendStep";

const LABELS: Record<SendChannel, string> = {
  google: "Google feed",
  meta: "Meta feed",
  tiktok: "TikTok feed",
};

interface Props {
  count: number;
  channels: SendChannel[];
  onAnother: () => void;
  onViewProducts: () => void;
}

export function SuccessStep({ count, channels, onAnother, onViewProducts }: Props) {
  const channelText =
    channels.length === 0
      ? "Saved as draft"
      : `Sent to ${channels.map((c) => LABELS[c]).join(", ")}`;

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-6 py-8">
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-soft">
          <Check className="h-7 w-7 text-success" strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Video sent successfully
        </h2>

        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            {count} product{count === 1 ? "" : "s"} now ha{count === 1 ? "s" : "ve"} a video asset
          </p>
          <p>{channelText}</p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <Button size="lg" onClick={onAnother}>
            Create another video
          </Button>
          <Button size="lg" variant="outline" onClick={onViewProducts}>
            View products
          </Button>
          <button className="mt-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            Go to feed
          </button>
        </div>
      </div>
    </div>
  );
}
