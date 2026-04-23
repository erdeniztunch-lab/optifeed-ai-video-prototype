import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StepIndicator } from "@/components/videos/StepIndicator";
import { EntryStep } from "@/components/videos/EntryStep";
import { SelectStep } from "@/components/videos/SelectStep";
import { GenerateStep, type Template } from "@/components/videos/GenerateDialog";
import { PreviewStep } from "@/components/videos/PreviewStep";
import { SendStep, type SendChannel } from "@/components/videos/SendStep";
import { SuccessStep } from "@/components/videos/SuccessStep";
import { PRODUCTS } from "@/data/products";
import { ArrowLeft } from "lucide-react";

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
  const [template, setTemplate] = useState<Template>("product-spotlight");
  const [sentTo, setSentTo] = useState<SendChannel[]>([]);

  const selectedProducts = useMemo(
    () => PRODUCTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  );

  const handleStart = () => setStage("select");

  const handleOpenGenerate = () => {
    setStage("generate");
  };

  const handleGenerated = (opts: { template: Template }) => {
    setTemplate(opts.template);
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

  const getPreviousStage = (current: Stage): Stage | null => {
    switch (current) {
      case "select":
        return "entry";
      case "generate":
        return "select";
      case "preview":
        return "generate";
      case "send":
        return "preview";
      case "success":
        return "send";
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        {showStepBar && (
          <div className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const previous = getPreviousStage(stage);
                    if (previous) setStage(previous);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
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

        {stage === "select" && (
          <SelectStep
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onContinue={handleOpenGenerate}
          />
        )}

        {stage === "generate" && (
          <GenerateStep
            products={selectedProducts}
            onGenerate={handleGenerated}
            onBack={() => setStage("select")}
          />
        )}

        {stage === "preview" && (
          <PreviewStep
            products={selectedProducts}
            template={template}
            onApproveAll={handleApproveAll}
            onBack={() => setStage("select")}
            onRegenerate={handleOpenGenerate}
            onTryAnotherType={() => setStage("generate")}
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

      </div>
    </AppShell>
  );
};

export default Videos;
