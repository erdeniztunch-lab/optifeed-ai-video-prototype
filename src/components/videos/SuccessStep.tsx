import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Props {
  count: number;
  exportedFeeds: string[];
  onAnother: () => void;
  onViewProducts: () => void;
}

export function SuccessStep({ count, exportedFeeds, onAnother, onViewProducts }: Props) {
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

        <div className="mt-8 flex flex-col gap-2">
          <Button size="lg" onClick={onAnother}>
            Yeni video oluştur
          </Button>
          <Button size="lg" variant="outline" onClick={onViewProducts}>
            Ürünlere git
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
