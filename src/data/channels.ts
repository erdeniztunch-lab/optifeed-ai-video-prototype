export interface Channel {
  id: string;
  name: string;
  platform: "meta" | "google" | "tiktok";
  description: string;
  isConnected: boolean;
  accountName: string | null;
}

export const CHANNELS: Channel[] = [
  {
    id: "meta-catalog",
    name: "Meta Catalog",
    platform: "meta",
    description: "Facebook ve Instagram ürün kataloğuna gönder",
    isConnected: true,
    accountName: "Optifeed Demo Store",
  },
  {
    id: "google-merchant",
    name: "Google Merchant Center",
    platform: "google",
    description: "Google Shopping kataloğuna gönder",
    isConnected: true,
    accountName: "Optifeed Demo Store",
  },
  {
    id: "tiktok-catalog",
    name: "TikTok Catalog",
    platform: "tiktok",
    description: "TikTok ürün kataloğuna gönder",
    isConnected: false,
    accountName: null,
  },
];
