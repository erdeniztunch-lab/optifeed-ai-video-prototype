import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/AppShell";
import { StepIndicator } from "@/components/videos/StepIndicator";
import { LibraryStep } from "@/components/videos/LibraryStep";
import { SelectStep } from "@/components/videos/SelectStep";
import { TemplateSelectionStep } from "@/components/videos/TemplateSelectionStep";
import { GenerateReviewStep } from "@/components/videos/GenerateReviewStep";
import { EditPromptStep } from "@/components/videos/EditPromptStep";
import { ExportStep } from "@/components/videos/ExportStep";
import { SuccessStep } from "@/components/videos/SuccessStep";
import { ConfirmStep } from "@/components/videos/ConfirmStep";
import { PRODUCTS } from "@/data/products";
import { FOLDERS, type VideoFolder } from "@/data/folders";
import { MOCK_TOKEN_BALANCE, TOKEN_COST_PER_VIDEO } from "@/data/tokens";
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
  | "edit-prompt"
  | "export"
  | "success";

const stageToStep: Record<Stage, number> = {
  library: 0,
  select: 1,
  template: 2,
  confirm: 3,
  "generate-review": 4,
  "edit-prompt": 4,
  export: 5,
  success: 5,
};

const getPreviousStage = (current: Stage): Stage | null => {
  switch (current) {
    case "select":          return "library";
    case "template":        return null;
    case "confirm":         return null;
    case "generate-review": return null;
    case "edit-prompt":     return null;
    case "export":          return null;
    case "success":         return null;
    default:                return null;
  }
};

// Per-folder snapshot for draft video access (3.2)
type FolderSnapshot = { jobs: VideoJob[]; productIds: string[] };
type TokenNotice = { amount: number; id: number };

type RecoverableVideoFlowState = {
  version: 1;
  savedAt: string;
  stage: Stage;
  folders: VideoFolder[];
  selectedIds: string[];
  template: TemplateId;
  guidedPrompt: GuidedPrompt;
  tokenBalance: number;
  videoJobs: VideoJob[];
  approvedIds: string[];
  rejectedIds: string[];
  editingProductId: string | null;
  exportedFeeds: string[];
  notifyOnComplete: boolean;
  campaignContext: CampaignContext;
  activeFolderName: string;
  activeFolderId: string | null;
  folderSnapshots: Record<string, FolderSnapshot>;
};

const RECOVERY_STORAGE_KEY = "optivideo_flow_session_v1";
const STAGES: Stage[] = [
  "library",
  "select",
  "template",
  "confirm",
  "generate-review",
  "edit-prompt",
  "export",
  "success",
];
const TEMPLATE_IDS: TemplateId[] = [
  "vitrine-bakan-kadin",
  "paris-yuruyen-kadin",
  "bahce-bulusmasi",
  "product-spotlight",
];
const PRODUCT_IDS = new Set(PRODUCTS.map((product) => product.id));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStage = (value: unknown): value is Stage =>
  typeof value === "string" && STAGES.includes(value as Stage);

const isTemplateId = (value: unknown): value is TemplateId =>
  typeof value === "string" && TEMPLATE_IDS.includes(value as TemplateId);

const sanitizeProductIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.filter((id): id is string => typeof id === "string" && PRODUCT_IDS.has(id))),
  );
};

const sanitizeString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const sanitizeNullableString = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const sanitizeBoolean = (value: unknown): boolean => value === true;

const sanitizeTokenBalance = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : MOCK_TOKEN_BALANCE;

const sanitizeCampaignContext = (value: unknown): CampaignContext => {
  if (!isRecord(value)) return DEFAULT_CAMPAIGN_CONTEXT;
  return {
    name: sanitizeString(value.name),
    sector: sanitizeString(value.sector),
    theme: sanitizeString(value.theme),
    themeCustom: sanitizeString(value.themeCustom),
    productType: sanitizeString(value.productType),
    templateNote: sanitizeString(value.templateNote),
  };
};

const sanitizeGuidedPrompt = (value: unknown): GuidedPrompt => {
  if (!isRecord(value)) return DEFAULT_GUIDED_PROMPT;
  return {
    sector: sanitizeString(value.sector),
    theme: sanitizeString(value.theme),
    themeCustom: sanitizeString(value.themeCustom),
    background: sanitizeString(value.background),
    productType: sanitizeString(value.productType),
  };
};

const sanitizeFolders = (value: unknown): VideoFolder[] => {
  if (!Array.isArray(value)) return FOLDERS;
  const folders = value
    .filter(isRecord)
    .map((folder) => ({
      id: sanitizeString(folder.id),
      name: sanitizeString(folder.name),
      createdAt: sanitizeString(folder.createdAt),
      updatedAt: sanitizeString(folder.updatedAt),
      videoCount:
        typeof folder.videoCount === "number" && Number.isFinite(folder.videoCount)
          ? folder.videoCount
          : 0,
      status:
        folder.status === "active" ||
        folder.status === "draft" ||
        folder.status === "archived" ||
        folder.status === "setup_in_progress"
          ? folder.status
          : "draft",
      productIds: sanitizeProductIds(folder.productIds),
    }))
    .filter((folder) => folder.id && folder.name);
  return folders.length > 0 ? folders : FOLDERS;
};

const sanitizeVideoJobs = (value: unknown): VideoJob[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((job) => ({
      productId: sanitizeString(job.productId),
      status:
        job.status === "pending" ||
        job.status === "ready" ||
        job.status === "generating" ||
        job.status === "pending_review" ||
        job.status === "approved" ||
        job.status === "rejected" ||
        job.status === "failed" ||
        job.status === "draft" ||
        job.status === "live"
          ? job.status
          : "pending",
      videoUrl: typeof job.videoUrl === "string" ? job.videoUrl : null,
    }))
    .filter((job) => PRODUCT_IDS.has(job.productId));
};

const sanitizeFolderSnapshots = (value: unknown): Record<string, FolderSnapshot> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, snapshot]) => isRecord(snapshot))
      .map(([folderId, snapshot]) => [
        folderId,
        {
          jobs: sanitizeVideoJobs(snapshot.jobs),
          productIds: sanitizeProductIds(snapshot.productIds),
        },
      ])
      .filter(([, snapshot]) => snapshot.jobs.length > 0 || snapshot.productIds.length > 0),
  );
};

const getSafeStage = (
  stage: Stage,
  selectedIds: string[],
  approvedIds: string[],
  exportedFeeds: string[],
  editingProductId: string | null,
): Stage => {
  if (stage === "library" || stage === "select") return stage;
  if (selectedIds.length === 0) return "select";
  if (stage === "edit-prompt") {
    return editingProductId && selectedIds.includes(editingProductId)
      ? "edit-prompt"
      : "generate-review";
  }
  if (stage === "export" && approvedIds.length === 0) return "generate-review";
  if (stage === "success" && approvedIds.length === 0 && exportedFeeds.length === 0) {
    return "library";
  }
  return stage;
};

const loadRecoverableState = (): RecoverableVideoFlowState | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(RECOVERY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isStage(parsed.stage)) {
      window.sessionStorage.removeItem(RECOVERY_STORAGE_KEY);
      return null;
    }

    const selectedIds = sanitizeProductIds(parsed.selectedIds);
    const approvedIds = sanitizeProductIds(parsed.approvedIds).filter((id) =>
      selectedIds.includes(id),
    );
    const rejectedIds = sanitizeProductIds(parsed.rejectedIds).filter(
      (id) => selectedIds.includes(id) && !approvedIds.includes(id),
    );
    const exportedFeeds = Array.isArray(parsed.exportedFeeds)
      ? parsed.exportedFeeds.filter((feed): feed is string => typeof feed === "string")
      : [];
    const editingProductId = sanitizeNullableString(parsed.editingProductId);
    const safeEditingProductId =
      editingProductId && selectedIds.includes(editingProductId) ? editingProductId : null;
    const stage = getSafeStage(
      parsed.stage,
      selectedIds,
      approvedIds,
      exportedFeeds,
      safeEditingProductId,
    );

    return {
      version: 1,
      savedAt: sanitizeString(parsed.savedAt, new Date().toISOString()),
      stage,
      folders: sanitizeFolders(parsed.folders),
      selectedIds,
      template: isTemplateId(parsed.template) ? parsed.template : "product-spotlight",
      guidedPrompt: sanitizeGuidedPrompt(parsed.guidedPrompt),
      tokenBalance: sanitizeTokenBalance(parsed.tokenBalance),
      videoJobs: sanitizeVideoJobs(parsed.videoJobs),
      approvedIds,
      rejectedIds,
      editingProductId: stage === "edit-prompt" ? safeEditingProductId : null,
      exportedFeeds,
      notifyOnComplete: sanitizeBoolean(parsed.notifyOnComplete),
      campaignContext: sanitizeCampaignContext(parsed.campaignContext),
      activeFolderName: sanitizeString(parsed.activeFolderName),
      activeFolderId: sanitizeNullableString(parsed.activeFolderId),
      folderSnapshots: sanitizeFolderSnapshots(parsed.folderSnapshots),
    };
  } catch {
    window.sessionStorage.removeItem(RECOVERY_STORAGE_KEY);
    return null;
  }
};

const saveRecoverableState = (state: RecoverableVideoFlowState) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(RECOVERY_STORAGE_KEY, JSON.stringify(state));
};

// ─── Component ───────────────────────────────────────────────────────────────

const Videos = () => {
  const { t } = useTranslation();
  // ── Routing ────────────────────────────────────────────────────────────────
  const [searchParams] = useSearchParams();
  const recoveredState = useMemo(() => loadRecoverableState(), []);
  const initialStage = searchParams.get("view") === "library"
    ? "library"
    : recoveredState?.stage ?? "select";
  const [stage, setStage] = useState<Stage>(initialStage);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const previousViewRef = useRef(searchParams.get("view"));

  useEffect(() => {
    const currentView = searchParams.get("view");
    const previousView = previousViewRef.current;
    previousViewRef.current = currentView;

    if (currentView === "library") {
      setStage("library");
    } else if (previousView === "library") {
      setStage("select");
    }
  }, [searchParams]);

  // ── Library / folder state ─────────────────────────────────────────────────
  const [folders, setFolders] = useState<VideoFolder[]>(recoveredState?.folders ?? FOLDERS);

  // ── Product selection ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<string[]>(recoveredState?.selectedIds ?? []);

  const selectedProducts = useMemo(
    () => PRODUCTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  );

  // ── Template + guided prompt ───────────────────────────────────────────────
  const [template, setTemplate] = useState<TemplateId>(recoveredState?.template ?? "product-spotlight");
  const [guidedPrompt, setGuidedPrompt] = useState<GuidedPrompt>(
    recoveredState?.guidedPrompt ?? DEFAULT_GUIDED_PROMPT,
  );

  // ── Token balance ──────────────────────────────────────────────────────────
  const [tokenBalance, setTokenBalance] = useState(recoveredState?.tokenBalance ?? MOCK_TOKEN_BALANCE);

  // ── Generation jobs ────────────────────────────────────────────────────────
  const [videoJobs, setVideoJobs] = useState<VideoJob[]>(recoveredState?.videoJobs ?? []);

  // ── Review state ───────────────────────────────────────────────────────────
  const [approvedIds, setApprovedIds] = useState<string[]>(recoveredState?.approvedIds ?? []);
  const [rejectedIds, setRejectedIds] = useState<string[]>(recoveredState?.rejectedIds ?? []);
  const [editingProductId, setEditingProductId] = useState<string | null>(
    recoveredState?.editingProductId ?? null,
  );

  // ── Export state ───────────────────────────────────────────────────────────
  const [exportedFeeds, setExportedFeeds] = useState<string[]>(recoveredState?.exportedFeeds ?? []);

  // ── Notification preference (set at ConfirmStep) ───────────────────────────
  const [notifyOnComplete, setNotifyOnComplete] = useState(recoveredState?.notifyOnComplete ?? false);
  const [tokenNotice, setTokenNotice] = useState<TokenNotice | null>(null);

  // ── Exit confirmation dialog ────────────────────────────────────────────────
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // ── Campaign context (design.md v2 fields — populated by CampaignSetupModal in Phase 1) ──
  const [campaignContext, setCampaignContext] = useState<CampaignContext>(
    recoveredState?.campaignContext ?? DEFAULT_CAMPAIGN_CONTEXT,
  );

  // ── Active campaign context ────────────────────────────────────────────────
  const [activeFolderName, setActiveFolderName] = useState<string>(
    recoveredState?.activeFolderName ?? "",
  );
  const [activeFolderId, setActiveFolderId] = useState<string | null>(
    recoveredState?.activeFolderId ?? null,
  );

  // ── Per-folder draft video snapshots (3.2) ─────────────────────────────────
  const [folderSnapshots, setFolderSnapshots] = useState<Record<string, FolderSnapshot>>(
    recoveredState?.folderSnapshots ?? {},
  );

  const pendingCounts = useMemo(
    () => Object.fromEntries(
      Object.entries(folderSnapshots).map(([id, s]) => [id, s.jobs.length])
    ),
    [folderSnapshots],
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────

  useEffect(() => {
    saveRecoverableState({
      version: 1,
      savedAt: new Date().toISOString(),
      stage,
      folders,
      selectedIds,
      template,
      guidedPrompt,
      tokenBalance,
      videoJobs,
      approvedIds,
      rejectedIds,
      editingProductId,
      exportedFeeds,
      notifyOnComplete,
      campaignContext,
      activeFolderName,
      activeFolderId,
      folderSnapshots,
    });
  }, [
    stage,
    folders,
    selectedIds,
    template,
    guidedPrompt,
    tokenBalance,
    videoJobs,
    approvedIds,
    rejectedIds,
    editingProductId,
    exportedFeeds,
    notifyOnComplete,
    campaignContext,
    activeFolderName,
    activeFolderId,
    folderSnapshots,
  ]);

  const resetCurrentCampaignState = () => {
    setSelectedIds([]);
    setApprovedIds([]);
    setRejectedIds([]);
    setVideoJobs([]);
    setCampaignContext(DEFAULT_CAMPAIGN_CONTEXT);
    setActiveFolderName("");
    setActiveFolderId(null);
    setNotifyOnComplete(false);
    setEditingProductId(null);
  };

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

  const handleNewCampaign = () => { resetCurrentCampaignState(); setStage("select"); };

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

  // Confirm → Generate-review
  const handleConfirmGenerate = (notify: boolean) => {
    const cost = selectedIds.length * TOKEN_COST_PER_VIDEO;
    setNotifyOnComplete(notify);
    setTokenBalance((b) => b - cost);
    setVideoJobs(
      selectedIds.map((id) => ({ productId: id, status: "pending", videoUrl: null })),
    );
    setTokenNotice({ amount: cost, id: Date.now() });
    setStage("generate-review");
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
    resetCurrentCampaignState();
    setGuidedPrompt(DEFAULT_GUIDED_PROMPT);
    setExportedFeeds([]);
    setStage("library");
  };

  // ─── Layout helpers ─────────────────────────────────────────────────────────

  const showStepBar = stage !== "library" && stage !== "success";
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
                    {t("flowChrome.back")}
                  </button>
                )}
                <div>
                  <h1 className="text-base font-semibold text-foreground">{t("flowChrome.title")}</h1>
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
                  {t("flowChrome.exit")}
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
            tokenNotice={tokenNotice}
            onApprove={handleApprove}
            onReject={handleReject}
            onEditPrompt={handleOpenEditPrompt}
            onGoToExport={handleGoToExport}
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
          title={t("flowChrome.exitDialog.title")}
          description={t("flowChrome.exitDialog.desc")}
          confirmLabel={t("flowChrome.exitDialog.confirm")}
          cancelLabel={t("flowChrome.exitDialog.cancel")}
          onConfirm={() => { setExitConfirmOpen(false); setStage("library"); }}
          onCancel={() => setExitConfirmOpen(false)}
        />
      </div>
    </AppShell>
  );
};

export default Videos;
