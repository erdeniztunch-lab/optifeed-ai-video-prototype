export type FolderStatus = "active" | "draft" | "archived";

export interface VideoFolder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  videoCount: number;
  status: FolderStatus;
}

export const FOLDERS: VideoFolder[] = [
  {
    id: "f1",
    name: "Anneler Günü Kampanyası",
    createdAt: "2025-04-28",
    updatedAt: "2025-05-10",
    videoCount: 8,
    status: "active",
  },
  {
    id: "f2",
    name: "Yaz Koleksiyonu 2025",
    createdAt: "2025-04-15",
    updatedAt: "2025-04-30",
    videoCount: 3,
    status: "draft",
  },
  {
    id: "f3",
    name: "Ramazan Özel Seçkisi",
    createdAt: "2025-03-20",
    updatedAt: "2025-04-01",
    videoCount: 12,
    status: "active",
  },
];
