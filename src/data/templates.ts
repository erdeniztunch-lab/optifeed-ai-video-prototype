import { type TemplateId } from "@/types/video-flow";

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  helperText: string;
  previewImage: string;
  details: {
    whenToUse: string;
    strengths: string[];
    avoid: string;
  };
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "product-spotlight",
    label: "Ürün Odağı",
    description: "Ürün odaklı, performans kampanyaları için temiz format.",
    helperText: "İndirim olmadığında en iyi tercih",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
    details: {
      whenToUse:
        "Ürünü ön plana çıkarmak istediğinizde. İndirim veya acil mesaj olmayan kampanyalarda idealdir.",
      strengths: [
        "Ürün detayını net ve sade gösterir",
        "Katalog ve retargeting kampanyaları için güçlü",
        "Dikkat dağıtmayan temiz kompozisyon",
      ],
      avoid: "Fiyat odaklı veya aciliyet içeren kampanyalarda yetersiz kalır.",
    },
  },
  {
    id: "sale-promotion",
    label: "İndirim Kampanyası",
    description: "İndirim ve promosyon kampanyaları için tasarlandı.",
    helperText: "İndirim veya acil kampanyalarda",
    previewImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
    details: {
      whenToUse:
        "İndirim, flaş sale veya sınırlı süreli teklif kampanyalarında kullanın.",
      strengths: [
        "Fiyat düşüşünü ve teklifi öne çıkarır",
        "Aciliyet duygusu yaratır",
        "Promosyon dönemlerinde yüksek tıklama oranı",
      ],
      avoid: "İndirim mesajı yoksa şablonun dili ve stili tutarsız görünür.",
    },
  },
  {
    id: "new-arrival",
    label: "Yeni Ürün",
    description: "Kataloğa yeni eklenen ürünler için başlatmaya hazır format.",
    helperText: "Yeni gelişler ve sezon koleksiyonları için güçlü tercih",
    previewImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&h=600&q=80",
    details: {
      whenToUse:
        "Kataloğa yeni eklenen ürünleri duyurmak için. Sezon açılışları ve koleksiyon tanıtımlarında güçlü.",
      strengths: [
        "Yenilik ve keşif hissini güçlendirir",
        "Sezon koleksiyonları için ideal",
        "İlk kez gösterim kampanyalarına uygun",
      ],
      avoid: "Katalogda zaten bilinen, eski bir ürün için mesaj tutarsız olur.",
    },
  },
  {
    id: "social-story",
    label: "Sosyal Hikaye",
    description: "Instagram ve TikTok gibi mobil yerleşimler için.",
    helperText: "Hızlı kaydırmalı yerleşimler için",
    previewImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=600&q=80",
    details: {
      whenToUse:
        "Instagram, TikTok ve Story yerleşimlerine yönelik kampanyalarda kullanın.",
      strengths: [
        "Mobil kaydırma davranışına uygun format",
        "Hızlı dikkat çeken dikey kompozisyon",
        "Sosyal kanallarda yüksek etkileşim",
      ],
      avoid: "Geniş ekran veya standart feed yerleşimleri için tasarlanmamıştır.",
    },
  },
];
