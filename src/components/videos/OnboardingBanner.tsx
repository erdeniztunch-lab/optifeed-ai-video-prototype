import { useState } from "react";
import { X } from "lucide-react";
import { HowItWorksModal } from "./HowItWorksModal";

const STORAGE_KEY = "has_seen_video_intro";

function readDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // incognito / storage blocked — fail silently
  }
}

export function OnboardingBanner() {
  const [visible, setVisible] = useState(() => !readDismissed());
  const [modalOpen, setModalOpen] = useState(false);

  const dismiss = () => {
    writeDismissed();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="mb-6 flex items-start gap-4 rounded-xl border border-primary/25 bg-primary/5 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            Ürünlerinden saniyeler içinde video reklam üret.
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Önce ürün seçin, sonra şablona karar verin.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Nasıl çalışır?
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Anladım, başlayalım
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Kapat"
          className="mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <HowItWorksModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
