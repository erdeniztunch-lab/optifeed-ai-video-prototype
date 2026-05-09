// ─── Template ────────────────────────────────────────────────────────────────

export type TemplateId =
  | "product-spotlight"
  | "sale-promotion"
  | "new-arrival"
  | "social-story";

// ─── Guided Prompt ───────────────────────────────────────────────────────────

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

// ─── Video Generation Job ────────────────────────────────────────────────────

export type VideoStatus = "pending" | "generating" | "ready";

export interface VideoJob {
  productId: string;
  status: VideoStatus;
  videoUrl: string | null;
}

// ─── Video Progress Job (used in GenerationProgressStep simulation) ───────────

export interface VideoProgressJob {
  productId: string;
  productName: string;
  productImage: string;
  status: VideoStatus;
  videoUrl: string | null;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected";
