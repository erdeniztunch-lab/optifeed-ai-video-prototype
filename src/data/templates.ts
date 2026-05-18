import { type TemplateId } from "@/types/video-flow";

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  helperText: string;
  previewImage: string;
  templateNote: string;
  recommendedSectors: string[];
  details: {
    whenToUse: string;
    strengths: string[];
    avoid: string;
  };
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "vitrine-bakan-kadin",
    label: "Vitrine bakan kadın",
    description: "Şehir vitrininde ürünle etkileşen gerçekçi lifestyle sahnesi.",
    helperText: "Mağaza deneyimi hissi yaratan kampanyalar için",
    previewImage:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty", "jewelry"],
    details: {
      whenToUse:
        "Ürünü gerçek yaşam bağlamında göstermek istediğinizde. Şehirli, alışveriş odaklı kampanyalarda güçlü.",
      strengths: [
        "Ürünü doğal kullanım sahnesinde gösterir",
        "Alışveriş davranışına yakın atmosfer",
        "Kadın hedef kitle için yüksek özdeşleşme",
      ],
      avoid: "Teknik ürün detayı ön planda tutulması gereken kampanyalar için uygun değil.",
    },
  },
  {
    id: "paris-yuruyen-kadin",
    label: "Paris'te yürüyen kadın",
    description: "Premium şehir atmosferinde ürünü taşıyan model ile zarif sunum.",
    helperText: "Lüks ve lifestyle markalar için ideal",
    previewImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty", "jewelry"],
    details: {
      whenToUse:
        "Lüks, premium veya lifestyle markaları konumlandırmak için. Seyahat ve moda kampanyalarında güçlü.",
      strengths: [
        "Aspirasyonel ve premium his verir",
        "Moda ve aksesuar ürünleri için biçilmiş kaftan",
        "Yüksek kaliteli görsel atmosfer",
      ],
      avoid: "Uygun fiyatlı veya gündelik ürünler için mesaj tutarsız kalabilir.",
    },
  },
  {
    id: "bahce-bulusmasi",
    label: "Günlük moda sahnesi",
    description: "Günlük yaşam ortamında ürünü doğal şekilde sergileyen moda sahnesi.",
    helperText: "Casual ve günlük moda kampanyaları için",
    previewImage:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty"],
    details: {
      whenToUse:
        "Günlük ve casual moda ürünlerini doğal yaşam ortamında sergilemek istediğinizde. Açık hava temalı ve yaz koleksiyonu kampanyaları için uygundur.",
      strengths: [
        "Doğal ve sıcak atmosfer",
        "Günlük yaşam bağlamında ürün görünürlüğü",
        "Casual ve lifestyle moda kampanyaları için ideal",
      ],
      avoid: "Lüks veya premium görsel dil gerektiren kampanyalar için uygun değil.",
    },
  },
  {
    id: "product-spotlight",
    label: "Ürün odak sahnesi",
    description: "Ürünü ön plana çıkaran sade ve temiz moda sunum sahnesi.",
    helperText: "Ürün detayını ön plana çıkaran kampanyalar için",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["fashion", "beauty", "jewelry"],
    details: {
      whenToUse:
        "Tekstil ve moda ürününü sade ve dikkat çekici şekilde sergilemek istediğinizde. Katalog ve retargeting kampanyalarında güçlü.",
      strengths: [
        "Ürün detayını net ve sade gösterir",
        "Tekstil ve moda için katalog ve retargeting kampanyalarında güçlü",
        "Dikkat dağıtmayan temiz kompozisyon",
      ],
      avoid: "Fiyat odaklı veya aciliyet içeren kampanyalarda yetersiz kalır.",
    },
  },
];
