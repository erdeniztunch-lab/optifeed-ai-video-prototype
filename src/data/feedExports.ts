export type FeedChannel = "google" | "meta" | "criteo";

export interface FeedExport {
  id: string;
  name: string;
  channel: FeedChannel;
  source: string;
  productCount: number;
  selectedCount: number;
  videoAttribute: string;
}

export const FEED_EXPORTS: FeedExport[] = [
  {
    id: "fe1",
    name: "Google Ads Page Feed",
    channel: "google",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    selectedCount: 26,
    videoAttribute: "Custom Label",
  },
  {
    id: "fe2",
    name: "Google Merchant Export",
    channel: "google",
    source: "Shopify Feed (summer collection)",
    productCount: 89,
    selectedCount: 31,
    videoAttribute: "g:custom_label_4",
  },
  {
    id: "fe3",
    name: "Meta Export",
    channel: "meta",
    source: "Shopify Feed (all collections)",
    productCount: 147,
    selectedCount: 18,
    videoAttribute: "internal_label",
  },
  {
    id: "fe4",
    name: "Meta Retargeting Export",
    channel: "meta",
    source: "Shopify Feed (retargeting)",
    productCount: 63,
    selectedCount: 24,
    videoAttribute: "internal_label",
  },
  {
    id: "fe5",
    name: "Meta export with dynamic creative",
    channel: "meta",
    source: "Shopify Feed (new arrivals)",
    productCount: 42,
    selectedCount: 12,
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
