import { type TemplateId } from "@/types/video-flow";

export interface TemplateDefinition {
  id: TemplateId;
  previewImage: string;
  templateNote: string;
  recommendedSectors: string[];
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "vitrine-bakan-kadin",
    previewImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty", "jewelry"],
  },
  {
    id: "paris-yuruyen-kadin",
    previewImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty", "jewelry"],
  },
  {
    id: "bahce-bulusmasi",
    previewImage:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty"],
  },
  {
    id: "product-spotlight",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty", "jewelry"],
  },
];
