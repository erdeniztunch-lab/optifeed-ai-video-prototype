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
    description: "Temiz, ürün odaklı format. Katalog ve performans kampanyaları için idealdir.",
    helperText: "İndirim olmadığında en iyi tercih",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
  },
  {
    id: "sale-promotion",
    label: "İndirim Kampanyası",
    description: "Fiyat düşüşü mesajı kreatife öncülük eder. Promosyon teklifleri için tasarlandı.",
    helperText: "İndirim veya aciliyet mesajı reklamı yönlendirdiğinde kullanın",
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
    description: "Hızlı kaydırmalı yerleşimler için optimize edilmiş, mobil öncelikli format.",
    helperText: "MVP'de 1:1 üretilir — dikey format V2'de",
    previewImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=600&q=80",
  },
];
