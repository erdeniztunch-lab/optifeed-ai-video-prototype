export type FeedChannel = "google" | "meta" | "criteo";

export interface FeedExport {
  id: string;
  name: string;
  channel: FeedChannel;
  source: string;
  productCount: number;
  videoAttribute: string;
}

// Based on the "Apply to Exports" screen reference
export const FEED_EXPORTS: FeedExport[] = [
  {
    id: "fe1",
    name: "Google Ads Page Feed",
    channel: "google",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    videoAttribute: "Custom Label",
  },
  {
    id: "fe2",
    name: "Google Merchant Export",
    channel: "google",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    videoAttribute: "g:custom_label_4",
  },
  {
    id: "fe3",
    name: "Meta Export",
    channel: "meta",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    videoAttribute: "internal_label",
  },
  {
    id: "fe4",
    name: "Meta Export (Copy)",
    channel: "meta",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    videoAttribute: "internal_label",
  },
  {
    id: "fe5",
    name: "Meta export with dynamic creative",
    channel: "meta",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    videoAttribute: "internal_label",
  },
];

export const VIDEO_ATTRIBUTE_OPTIONS: string[] = [
  "video_url",
  "g:video_link",
  "g:custom_label_4",
  "internal_label",
  "internal_video",
  "custom_label_0",
  "Custom Label",
];
