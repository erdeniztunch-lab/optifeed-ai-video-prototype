import { Button } from "@/components/ui/button";
import { Sparkles, Video, ArrowRight } from "lucide-react";

export function EntryStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-12 shadow-soft text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
          <Video className="h-6 w-6 text-accent-foreground" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create product videos for your catalog
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          Use your existing product data and images to create video assets for
          Google, Meta, and TikTok.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          124 products have no video assets
        </div>

        <div className="mt-8">
          <Button size="lg" className="px-8" onClick={onStart}>
            Create videos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
