import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, PartyPopper } from "lucide-react";

const FIRST_CAMPAIGN_KEY = "has_completed_first_campaign";

function readFirstCampaign(): boolean {
  try {
    return localStorage.getItem(FIRST_CAMPAIGN_KEY) === "true";
  } catch {
    return false;
  }
}

function writeFirstCampaign() {
  try {
    localStorage.setItem(FIRST_CAMPAIGN_KEY, "true");
  } catch {
    // incognito / storage blocked — fail silently
  }
}

interface Props {
  count: number;
  exportedFeeds: string[];
  onAnother: () => void;
  onViewProducts: () => void;
}

export function SuccessStep({ count, exportedFeeds, onAnother, onViewProducts }: Props) {
  const [isFirst] = useState(() => {
    const first = !readFirstCampaign();
    writeFirstCampaign();
    return first;
  });

  const channelText =
    exportedFeeds.length === 0
      ? "Taslak olarak kaydedildi"
      : exportedFeeds.length <= 2
        ? `${exportedFeeds.join(" ve ")}'ye uygulandı`
        : `${exportedFeeds.length} dışa aktarıma uygulandı`;

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-6 py-8">
      <div className="w-full max-w-md animate-fade-in text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <Check className="h-7 w-7 text-success" strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Videolar başarıyla dışa aktarıldı
        </h2>

        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p>
            {count} ürün artık video içeriğine sahip
          </p>
          <p>{channelText}</p>
        </div>

        {isFirst && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-left">
            <PartyPopper className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              Bu senin ilk video kampanyan! Library&apos;den her zaman tekrar gözden geçirebilirsin.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2">
          <Button size="lg" onClick={onAnother}>
            Yeni video oluştur
          </Button>
          <Button size="lg" variant="outline" onClick={onViewProducts}>
            Kampanyalarıma git
          </Button>
          <button
            type="button"
            onClick={onViewProducts}
            className="mt-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Kütüphaneye dön
          </button>
        </div>
      </div>
    </div>
  );
}
