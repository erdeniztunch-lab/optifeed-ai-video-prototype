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
    label: "Ürün Odağı",
    description: "Ürün odaklı, performans kampanyaları için temiz format.",
    helperText: "İndirim olmadığında en iyi tercih",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "sale-promotion",
    label: "İndirim Kampanyası",
    description: "İndirim ve promosyon kampanyaları için tasarlandı.",
    helperText: "İndirim veya acil kampanyalarda",
    previewImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "new-arrival",
    label: "Yeni Ürün",
    description: "Kataloğa yeni eklenen ürünler için başlatmaya hazır format.",
    helperText: "Yeni gelişler ve sezon koleksiyonları için güçlü tercih",
    previewImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "social-story",
    label: "Sosyal Hikaye",
    description: "Instagram ve TikTok gibi mobil yerleşimler için.",
    helperText: "Hızlı kaydırmalı yerleşimler için",
    previewImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=600&q=80",
  },
];
