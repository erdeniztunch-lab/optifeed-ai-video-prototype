import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StepIndicator } from "@/components/videos/StepIndicator";
import { LibraryStep } from "@/components/videos/LibraryStep";
import { SelectStep } from "@/components/videos/SelectStep";
import { TemplateSelectionStep } from "@/components/videos/TemplateSelectionStep";
import { GenerationProgressStep } from "@/components/videos/GenerationProgressStep";
import { ReviewStep } from "@/components/videos/ReviewStep";
import { EditPromptStep } from "@/components/videos/EditPromptStep";
import { ExportStep } from "@/components/videos/ExportStep";
import { SuccessStep } from "@/components/videos/SuccessStep";
import { TokenBadge } from "@/components/videos/TokenBadge";
import { PRODUCTS } from "@/data/products";
import { FOLDERS, type VideoFolder } from "@/data/folders";
import { MOCK_TOKEN_BALANCE, TOKEN_COST_PER_VIDEO, SAMPLE_VIDEO } from "@/data/tokens";
import { type GuidedPrompt, DEFAULT_GUIDED_PROMPT, type VideoJob, type TemplateId } from "@/types/video-flow";
import { ArrowLeft } from "lucide-react";

// ─── Stage machine ────────────────────────────────────────────────────────────
//
// Validated flow:  library → select → template → progress → review → export → success

type Stage =
  | "library"
  | "select"
  | "template"
  | "progress"
  | "review"
  | "edit-prompt"
  | "export"
  | "success";

const stageToStep: Record<Stage, number> = {
  // Step bar is hidden for library (step 0)
  library: 0,
  // Validated steps 1–6
  select: 1,
  template: 2,
  progress: 3,
  review: 4,
  "edit-prompt": 4,
  export: 5,
  success: 6,
};

const getPreviousStage = (current: Stage): Stage | null => {
  switch (current) {
    // Validated back-navigation
    case "select":      return "library";
    case "template":    return "select";
    case "progress":    return null;
    case "review":      return null;   // no back from review — generation already ran
    case "edit-prompt": return "review";
    case "export":      return "review";
    case "success":     return null;
    default:            return null;
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

const Videos = () => {
  // ── Routing ────────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>("library");

  // ── Library / folder state ─────────────────────────────────────────────────
  const [folders, setFolders] = useState<VideoFolder[]>(FOLDERS);

  // ── Product selection ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedProducts = useMemo(
    () => PRODUCTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  );

  // ── Template + guided prompt ───────────────────────────────────────────────
  const [template, setTemplate] = useState<TemplateId>("product-spotlight");
  const [guidedPrompt, setGuidedPrompt] = useState<GuidedPrompt>(DEFAULT_GUIDED_PROMPT);

  // ── Token balance ──────────────────────────────────────────────────────────
  const [tokenBalance, setTokenBalance] = useState(MOCK_TOKEN_BALANCE);

  // ── Generation jobs ────────────────────────────────────────────────────────
  const [videoJobs, setVideoJobs] = useState<VideoJob[]>([]);

  // ── Review state ───────────────────────────────────────────────────────────
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // ── Export state ───────────────────────────────────────────────────────────
  const [exportedFeeds, setExportedFeeds] = useState<string[]>([]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  // Library → Select
  const handleOpenFolder = (_folderId: string) => {
    setStage("select");
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: VideoFolder = {
      id: `f${Date.now()}`,
      name,
      createdAt: new Date().toISOString().split("T")[0],
      videoCount: 0,
      status: "draft",
    };
    setFolders((prev) => [newFolder, ...prev]);
    setStage("select");
  };

  // Select → Template
  const handleChooseTemplate = () => setStage("template");

  // Template → Progress
  const handleStartGeneration = (opts: { template: TemplateId; guidedPrompt: GuidedPrompt }) => {
    setTemplate(opts.template);
    setGuidedPrompt(opts.guidedPrompt);
    // Deduct tokens upfront
    setTokenBalance((b) => b - selectedIds.length * TOKEN_COST_PER_VIDEO);
    // Initialise one job per selected product (all pending)
    setVideoJobs(
      selectedIds.map((id) => ({ productId: id, status: "pending", videoUrl: null })),
    );
    setStage("progress");
  };

  // Progress → Review
  const handleProgressComplete = () => {
    // Mark all jobs ready so Review can access the video URLs
    setVideoJobs((prev) =>
      prev.map((j) => ({ ...j, status: "ready", videoUrl: SAMPLE_VIDEO })),
    );
    setStage("review");
  };

  // Review actions — mutually exclusive toggle
  const handleApprove = (productId: string) => {
    setApprovedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
    setRejectedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleReject = (productId: string) => {
    setRejectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
    setApprovedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleOpenEditPrompt = (productId: string) => {
    setEditingProductId(productId);
    setStage("edit-prompt");
  };

  // Edit Prompt → regenerate → back to Review
  const handleEditRegenerate = (productId: string, _promptText: string) => {
    setTokenBalance((b) => b - TOKEN_COST_PER_VIDEO);
    setVideoJobs((prev) =>
      prev.map((j) =>
        j.productId === productId ? { ...j, status: "ready", videoUrl: j.videoUrl } : j,
      ),
    );
    // Reset review state for the regenerated video so user re-reviews it
    setApprovedIds((prev) => prev.filter((id) => id !== productId));
    setRejectedIds((prev) => prev.filter((id) => id !== productId));
    setEditingProductId(null);
    setStage("review");
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setStage("review");
  };

  // Review → Export
  const handleGoToExport = () => setStage("export");

  // Export → Success
  const handleExportComplete = (feedNames: string[]) => {
    setExportedFeeds(feedNames);
    setStage("success");
  };

  // Success → Library (start fresh)
  const handleAnother = () => {
    setSelectedIds([]);
    setApprovedIds([]);
    setRejectedIds([]);
    setVideoJobs([]);
    setGuidedPrompt(DEFAULT_GUIDED_PROMPT);
    setEditingProductId(null);
    setExportedFeeds([]);
    setStage("library");
  };

  // ─── Layout helpers ─────────────────────────────────────────────────────────

  const showStepBar = stage !== "library";
  const previousStage = getPreviousStage(stage);

  return (
    <AppShell>
      <div className="min-h-screen">
        {showStepBar && (
          <div className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-10">
              <div className="flex items-center gap-3">
                {previousStage !== null && (
                  <button
                    type="button"
                    onClick={() => setStage(previousStage)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Geri
                  </button>
                )}
                <h1 className="text-base font-semibold text-foreground">Ürün videoları oluştur</h1>
              </div>
              <div className="hidden md:block">
                <StepIndicator current={stageToStep[stage]} />
              </div>
              <div className="flex items-center gap-3">
                <TokenBadge balance={tokenBalance} />
                <button
                  onClick={() => {
                    if (window.confirm("İlerlemeniz kaybolacak. Çıkmak istediğinize emin misiniz?")) {
                      setStage("library");
                    }
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Çıkış
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Phase 1: Library ─────────────────────────────────────────────── */}
        {stage === "library" && (
          <LibraryStep
            folders={folders}
            onOpenFolder={handleOpenFolder}
            onCreateFolder={handleCreateFolder}
          />
        )}

        {/* ── Phase 2: Product Selection ───────────────────────────────────── */}
        {stage === "select" && (
          <SelectStep
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onContinue={handleChooseTemplate}
            tokenBalance={tokenBalance}
          />
        )}

        {/* ── Phase 3: Template Selection ──────────────────────────────────── */}
        {stage === "template" && (
          <TemplateSelectionStep
            products={selectedProducts}
            tokenBalance={tokenBalance}
            onGenerate={handleStartGeneration}
          />
        )}

        {/* ── Phase 4: Generation Progress ─────────────────────────────────── */}
        {stage === "progress" && (
          <GenerationProgressStep
            products={selectedProducts}
            onComplete={handleProgressComplete}
          />
        )}

        {/* ── Phase 5: Review ──────────────────────────────────────────────── */}
        {stage === "review" && (
          <ReviewStep
            products={selectedProducts}
            videoJobs={videoJobs}
            approvedIds={approvedIds}
            rejectedIds={rejectedIds}
            onApprove={handleApprove}
            onReject={handleReject}
            onEditPrompt={handleOpenEditPrompt}
            onContinue={handleGoToExport}
          />
        )}

        {/* ── Phase 5: Edit Prompt ─────────────────────────────────────────── */}
        {stage === "edit-prompt" && editingProductId && (
          <EditPromptStep
            product={selectedProducts.find((p) => p.id === editingProductId)!}
            tokenBalance={tokenBalance}
            template={template}
            guidedPrompt={guidedPrompt}
            onRegenerate={handleEditRegenerate}
            onCancel={handleCancelEdit}
          />
        )}

        {/* ── Phase 6: Export ──────────────────────────────────────────────── */}
        {stage === "export" && (
          <ExportStep
            approvedCount={approvedIds.length}
            approvedIds={approvedIds}
            selectedProducts={selectedProducts}
            onComplete={handleExportComplete}
            onSkip={() => handleExportComplete([])}
          />
        )}

        {/* ── Success ──────────────────────────────────────────────────────── */}
        {stage === "success" && (
          <SuccessStep
            count={approvedIds.length}
            exportedFeeds={exportedFeeds}
            onAnother={handleAnother}
            onViewProducts={() => setStage("library")}
          />
        )}

      </div>
    </AppShell>
  );
};

export default Videos;
