// ─── Stage (design.md v2 target flow) ────────────────────────────────────────

export type FlowStage =
  | "catalog"
  | "library"
  | "campaign-setup"
  | "template"
  | "confirm"
  | "generate-review"
  | "edit-prompt"
  | "export"
  | "success";

// ─── Template ─────────────────────────────────────────────────────────────────

export type TemplateId =
  | "vitrine-bakan-kadin"
  | "paris-yuruyen-kadin"
  | "bahce-bulusmasi"
  | "product-spotlight";

// ─── Campaign Context ─────────────────────────────────────────────────────────

export interface CampaignContext {
  name: string;
  sector: string;
  theme: string;
  themeCustom: string;
  productType: string;
  templateNote: string;
}

export const DEFAULT_CAMPAIGN_CONTEXT: CampaignContext = {
  name: "",
  sector: "",
  theme: "",
  themeCustom: "",
  productType: "",
  templateNote: "",
};

// ─── Guided Prompt (kept for backward compat with existing screens) ────────────

export interface GuidedPrompt {
  sector: string;
  theme: string;
  themeCustom: string;
  background: string;
  productType: string;
}

export const DEFAULT_GUIDED_PROMPT: GuidedPrompt = {
  sector: "",
  theme: "",
  themeCustom: "",
  background: "",
  productType: "",
};

// ─── Video Status ──────────────────────────────────────────────────────────────

export type VideoStatus =
  | "pending"        // legacy — VideoJob in current flow
  | "ready"          // legacy — VideoJob in current flow
  | "generating"
  | "pending_review"
  | "approved"
  | "rejected"
  | "failed"
  | "draft"
  | "live";

// ─── Video Generation Job ──────────────────────────────────────────────────────

export interface VideoJob {
  productId: string;
  status: VideoStatus;
  videoUrl: string | null;
}

// ─── Video Progress Job ────────────────────────────────────────────────────────

export interface VideoProgressJob {
  productId: string;
  productName: string;
  productImage: string;
  status: VideoStatus;
  videoUrl: string | null;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected";
