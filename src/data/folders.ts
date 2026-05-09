export type FolderStatus = "active" | "draft";

export interface VideoFolder {
  id: string;
  name: string;
  createdAt: string;
  videoCount: number;
  status: FolderStatus;
}

export const FOLDERS: VideoFolder[] = [
  {
    id: "f1",
    name: "Anneler Günü Kampanyası",
    createdAt: "2025-04-28",
    videoCount: 8,
    status: "active",
  },
  {
    id: "f2",
    name: "Yaz Koleksiyonu 2025",
    createdAt: "2025-04-15",
    videoCount: 3,
    status: "draft",
  },
  {
    id: "f3",
    name: "Ramazan Özel Seçkisi",
    createdAt: "2025-03-20",
    videoCount: 12,
    status: "active",
  },
];
