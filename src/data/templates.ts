import { type TemplateId } from "@/types/video-flow";

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  helperText: string;
  previewImage: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "product-spotlight",
    label: "Product Spotlight",
    description: "Clean, product-focused format. Best for catalog and performance campaigns.",
    helperText: "Best match when no discount is present",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "sale-promotion",
    label: "Sale Promotion",
    description: "Price-drop messaging leads the creative. Built for promotional offers.",
    helperText: "Use when discount or urgency should drive the ad",
    previewImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "new-arrival",
    label: "New Arrival",
    description: "Launch-ready format for new products hitting the catalog.",
    helperText: "Strong fit for fresh arrivals and new season drops",
    previewImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "social-story",
    label: "Social Story",
    description: "Mobile-first format optimised for fast-scrolling placements.",
    helperText: "Produced at 1:1 in MVP — vertical V2",
    previewImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=600&q=80",
  },
];
