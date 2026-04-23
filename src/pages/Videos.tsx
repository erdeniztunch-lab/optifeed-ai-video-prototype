import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StepIndicator } from "@/components/videos/StepIndicator";
import { EntryStep } from "@/components/videos/EntryStep";
import { SelectStep } from "@/components/videos/SelectStep";
import { GenerateDialog, type Channel, type Format } from "@/components/videos/GenerateDialog";
import { PreviewStep } from "@/components/videos/PreviewStep";
import { SendStep, type SendChannel } from "@/components/videos/SendStep";
import { SuccessStep } from "@/components/videos/SuccessStep";
import { PRODUCTS } from "@/data/products";

type Stage = "entry" | "select" | "generate" | "preview" | "send" | "success";

const stageToStep: Record<Stage, number> = {
  entry: 0,
  select: 1,
  generate: 2,
  preview: 3,
  send: 4,
  success: 5,
};

const Videos = () => {
  const [stage, setStage] = useState<Stage>("entry");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [format, setFormat] = useState<Format>("square");
  const [, setChannels] = useState<Channel[]>(["meta"]);
  const [sentTo, setSentTo] = useState<SendChannel[]>([]);

  const selectedProducts = useMemo(
    () => PRODUCTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  );

  const handleStart = () => setStage("select");

  const handleOpenGenerate = () => {
    setGenerateOpen(true);
    setStage("generate");
  };

  const handleGenerated = (opts: { format: Format; channels: Channel[] }) => {
    setFormat(opts.format);
    setChannels(opts.channels);
    setGenerateOpen(false);
    setStage("preview");
  };

  const handleApproveAll = () => setStage("send");

  const handleSend = (channels: SendChannel[]) => {
    setSentTo(channels);
    setStage("success");
  };

  const handleAnother = () => {
    setSelectedIds([]);
    setSentTo([]);
    setStage("select");
  };

  const showStepBar = stage !== "entry";

  return (
    <AppShell>
      <div className="min-h-screen">
        {showStepBar && (
          <div className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-10">
              <div className="flex items-center gap-3">
                <h1 className="text-base font-semibold text-foreground">Create product videos</h1>
              </div>
              <div className="hidden md:block">
                <StepIndicator current={stageToStep[stage]} />
              </div>
              <button
                onClick={() => setStage("entry")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Exit
              </button>
            </div>
          </div>
        )}

        {stage === "entry" && <EntryStep onStart={handleStart} />}

        {(stage === "select" || stage === "generate") && (
          <SelectStep
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onContinue={handleOpenGenerate}
          />
        )}

        {stage === "preview" && (
          <PreviewStep
            products={selectedProducts}
            format={format}
            onApproveAll={handleApproveAll}
            onBack={() => setStage("select")}
          />
        )}

        {stage === "send" && (
          <SendStep onSend={handleSend} onSkip={() => handleSend([])} />
        )}

        {stage === "success" && (
          <SuccessStep
            count={selectedProducts.length}
            channels={sentTo}
            onAnother={handleAnother}
            onViewProducts={() => setStage("select")}
          />
        )}

        <GenerateDialog
          open={generateOpen}
          onOpenChange={(v) => {
            setGenerateOpen(v);
            if (!v && stage === "generate") setStage("select");
          }}
          count={selectedIds.length}
          thumbnails={selectedProducts.map((p) => p.image)}
          onGenerate={handleGenerated}
        />
      </div>
    </AppShell>
  );
};

export default Videos;
