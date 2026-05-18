import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { StepIndicator } from "@/components/videos/StepIndicator";
import { LibraryStep } from "@/components/videos/LibraryStep";
import { SelectStep } from "@/components/videos/SelectStep";
import { TemplateSelectionStep } from "@/components/videos/TemplateSelectionStep";
import { GenerationProgressStep } from "@/components/videos/GenerationProgressStep";
import { ReviewStep } from "@/components/videos/ReviewStep";
import { GenerateReviewStep } from "@/components/videos/GenerateReviewStep";
import { EditPromptStep } from "@/components/videos/EditPromptStep";
import { ExportStep } from "@/components/videos/ExportStep";
import { SuccessStep } from "@/components/videos/SuccessStep";
import { ConfirmStep } from "@/components/videos/ConfirmStep";
import { PRODUCTS } from "@/data/products";
import { FOLDERS, type VideoFolder } from "@/data/folders";
import { MOCK_TOKEN_BALANCE, TOKEN_COST_PER_VIDEO, SAMPLE_VIDEO } from "@/data/tokens";
import { type GuidedPrompt, DEFAULT_GUIDED_PROMPT, type VideoJob, type TemplateId, type CampaignContext, DEFAULT_CAMPAIGN_CONTEXT } from "@/types/video-flow";
import { ArrowLeft } from "lucide-react";
import { CampaignNameModal } from "@/components/videos/CampaignNameModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

// ─── Stage machine ────────────────────────────────────────────────────────────

type Stage =
  | "library"
  | "select"
  | "template"
  | "confirm"
  | "generate-review"
  | "progress"
  | "review"
  | "edit-prompt"
  | "export"
  | "success";

const stageToStep: Record<Stage, number> = {
  library: 0,
  select: 1,
  template: 2,
  confirm: 3,
  "generate-review": 4,
  progress: 4,
  review: 4,
  "edit-prompt": 4,
  export: 5,
  success: 5,
};

const getPreviousStage = (current: Stage): Stage | null => {
  switch (current) {
    case "select":      return "library";
    case "template":    return "select";
    case "confirm":     return "template";
    case "generate-review": return null;
    case "progress":    return null;
    case "review":      return null;
    case "edit-prompt": return "generate-review";
    case "export":      return "generate-review";
    case "success":     return null;
    default:            return null;
  }
};

// Per-folder snapshot for draft video access (3.2)
type FolderSnapshot = { jobs: VideoJob[]; productIds: string[] };

// ─── Component ───────────────────────────────────────────────────────────────

const Videos = () => {
  // ── Routing ────────────────────────────────────────────────────────────────
  const [searchParams] = useSearchParams();
  const [stage, setStage] = useState<Stage>("select");
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("view") === "library") {
      setStage("library");
    }
  }, [searchParams]);

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

  // ── Notification preference (set at ConfirmStep) ───────────────────────────
  const [notifyOnComplete, setNotifyOnComplete] = useState(false);

  // ── Exit confirmation dialog ────────────────────────────────────────────────
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // ── Campaign context (design.md v2 fields — populated by CampaignSetupModal in Phase 1) ──
  const [campaignContext, setCampaignContext] = useState<CampaignContext>(DEFAULT_CAMPAIGN_CONTEXT);

  // ── Active campaign context ────────────────────────────────────────────────
  const [activeFolderName, setActiveFolderName] = useState<string>("");
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // ── Per-folder draft video snapshots (3.2) ─────────────────────────────────
  const [folderSnapshots, setFolderSnapshots] = useState<Record<string, FolderSnapshot>>({});

  const pendingCounts = useMemo(
    () => Object.fromEntries(
      Object.entries(folderSnapshots).map(([id, s]) => [id, s.jobs.length])
    ),
    [folderSnapshots],
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────

  // Library → Select (or generate-review if pending snapshot exists)
  const handleOpenFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    setActiveFolderName(folder?.name ?? "");
    setActiveFolderId(folderId);
    const snap = folderSnapshots[folderId];
    if (snap && snap.jobs.length > 0) {
      setVideoJobs(snap.jobs);
      setSelectedIds(snap.productIds);
      setStage("generate-review");
    } else {
      setStage("select");
    }
  };

  const handleNewCampaign = () => setStage("select");

  // Toggle folder active/draft status (3.1)
  const handleToggleFolderStatus = (id: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === "active" ? "draft" : "active",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : f,
      ),
    );
  };

  // Folder management (Phase 6)
  const handleResumeFolder = (folderId: string) => handleOpenFolder(folderId);

  const handleDeleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setFolderSnapshots((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleRenameFolder = (id: string, newName: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, name: newName, updatedAt: new Date().toISOString().split("T")[0] }
          : f,
      ),
    );
  };

  const handleArchiveFolder = (id: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: "archived", updatedAt: new Date().toISOString().split("T")[0] }
          : f,
      ),
    );
  };

  // Select → Campaign modal → Template
  const handleChooseTemplate = () => setShowCampaignModal(true);

  const handleCampaignConfirm = (context: CampaignContext) => {
    const newFolder: VideoFolder = {
      id: `f${Date.now()}`,
      name: context.name,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      videoCount: 0,
      status: "draft",
      productIds: selectedIds,
    };
    setFolders((prev) => [newFolder, ...prev]);
    setActiveFolderName(context.name);
    setActiveFolderId(newFolder.id);
    setCampaignContext(context);
    setShowCampaignModal(false);
    setStage("template");
  };

  const handleCampaignCancel = () => setShowCampaignModal(false);

  const handleGoToLibrary = () => setStage("library");

  // Template → Confirm
  const handleTemplateComplete = (opts: { template: TemplateId; templateNote: string }) => {
    setTemplate(opts.template);
    setCampaignContext((prev) => ({ ...prev, templateNote: opts.templateNote }));
    setStage("confirm");
  };

  // Confirm → Progress
  const handleConfirmGenerate = (notify: boolean) => {
    setNotifyOnComplete(notify);
    setTokenBalance((b) => b - selectedIds.length * TOKEN_COST_PER_VIDEO);
    setVideoJobs(
      selectedIds.map((id) => ({ productId: id, status: "pending", videoUrl: null })),
    );
    setStage("generate-review");
  };

  // Progress → Review (save snapshot for 3.2)
  const handleProgressComplete = () => {
    const readyJobs = videoJobs.map((j) => ({ ...j, status: "ready" as const, videoUrl: SAMPLE_VIDEO }));
    setVideoJobs(readyJobs);
    if (activeFolderId) {
      setFolderSnapshots((prev) => ({
        ...prev,
        [activeFolderId]: { jobs: readyJobs, productIds: selectedIds },
      }));
    }
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
    setApprovedIds((prev) => prev.filter((id) => id !== productId));
    setRejectedIds((prev) => prev.filter((id) => id !== productId));
    setEditingProductId(null);
    setStage("generate-review");
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setStage("generate-review");
  };

  // Review → Export
  const handleGoToExport = () => setStage("export");

  // Export → Success (clear snapshot for this folder)
  const handleExportComplete = (feedNames: string[]) => {
    if (activeFolderId) {
      setFolderSnapshots((prev) => {
        const next = { ...prev };
        delete next[activeFolderId];
        return next;
      });
    }
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
    setCampaignContext(DEFAULT_CAMPAIGN_CONTEXT);
    setNotifyOnComplete(false);
    setEditingProductId(null);
    setExportedFeeds([]);
    setActiveFolderName("");
    setActiveFolderId(null);
    setStage("library");
  };

  // ─── Layout helpers ─────────────────────────────────────────────────────────

  const showStepBar = stage !== "library";
  const previousStage = getPreviousStage(stage);
  const spentTokens = MOCK_TOKEN_BALANCE - tokenBalance;

  return (
    <AppShell tokenBalance={tokenBalance} spentTokens={spentTokens}>
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
                <div>
                  <h1 className="text-base font-semibold text-foreground">Ürün videoları oluştur</h1>
                  {activeFolderName && (
                    <p className="text-xs text-muted-foreground">{activeFolderName}</p>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <StepIndicator current={stageToStep[stage]} />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExitConfirmOpen(true)}
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
            onNewCampaign={handleNewCampaign}
            onToggleStatus={handleToggleFolderStatus}
            tokenBalance={tokenBalance}
            pendingCounts={pendingCounts}
            onResumeFolder={handleResumeFolder}
            onDeleteFolder={handleDeleteFolder}
            onRenameFolder={handleRenameFolder}
            onArchiveFolder={handleArchiveFolder}
          />
        )}

        {/* ── Phase 2: Product Selection ───────────────────────────────────── */}
        {stage === "select" && (
          <>
            <SelectStep
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              onContinue={handleChooseTemplate}
              tokenBalance={tokenBalance}
              onGoToLibrary={handleGoToLibrary}
            />
            <CampaignNameModal
              open={showCampaignModal}
              onConfirm={handleCampaignConfirm}
              onCancel={handleCampaignCancel}
            />
          </>
        )}

        {/* ── Phase 3: Template Selection ──────────────────────────────────── */}
        {stage === "template" && (
          <TemplateSelectionStep
            products={selectedProducts}
            campaignContext={campaignContext}
            onContinue={handleTemplateComplete}
            onBack={() => setStage("select")}
          />
        )}

        {/* ── Confirm ──────────────────────────────────────────────────────── */}
        {stage === "confirm" && (
          <ConfirmStep
            products={selectedProducts}
            selectedTemplate={template}
            campaignContext={campaignContext}
            tokenBalance={tokenBalance}
            onConfirm={handleConfirmGenerate}
            onBack={() => setStage("template")}
            onEditTemplate={() => setStage("template")}
          />
        )}

        {/* ── Phase 4: Generate & Review (merged) ──────────────────────────── */}
        {stage === "generate-review" && (
          <GenerateReviewStep
            products={selectedProducts}
            selectedTemplate={template}
            approvedIds={approvedIds}
            rejectedIds={rejectedIds}
            notifyOnComplete={notifyOnComplete}
            onApprove={handleApprove}
            onReject={handleReject}
            onEditPrompt={handleOpenEditPrompt}
            onGoToExport={handleGoToExport}
          />
        )}

        {/* ── Phase 4: Generation Progress (legacy, unreachable) ────────────── */}
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
            onComplete={handleExportComplete}
            onSkip={() => handleExportComplete([])}
            onBack={() => setStage("generate-review")}
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

        {/* ── Exit confirmation ─────────────────────────────────────────────── */}
        <ConfirmDialog
          open={exitConfirmOpen}
          title="Akıştan çıkılsın mı?"
          description="İlerlemeniz kaybolacak. Devam etmek istediğinizden emin misiniz?"
          confirmLabel="Çıkış yap"
          cancelLabel="Vazgeç"
          onConfirm={() => { setExitConfirmOpen(false); setStage("library"); }}
          onCancel={() => setExitConfirmOpen(false)}
        />
      </div>
    </AppShell>
  );
};

export default Videos;
