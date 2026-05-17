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
    label: "Bahçe buluşması",
    description: "Doğal açık hava ortamında samimi ürün kullanımı ve sosyal sahne.",
    helperText: "Ev, bahçe ve outdoor ürünleri için",
    previewImage:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: ["home", "food", "sports"],
    details: {
      whenToUse:
        "Ev, bahçe, outdoor ve sosyal kullanımı ön plana çıkarmak istediğinizde. Yaz ve doğa temalı kampanyalar.",
      strengths: [
        "Sıcak ve samimi atmosfer",
        "Grup kullanımı ve sosyal bağlamı güçlü gösterir",
        "Ev ve yaşam kategorisi için ideal",
      ],
      avoid: "Teknoloji veya iş dünyasına yönelik ürünlerde bağlam uyumsuz kalır.",
    },
  },
  {
    id: "product-spotlight",
    label: "Product spotlight",
    description: "Ürün odaklı, performans kampanyaları için temiz format.",
    helperText: "İndirim olmadığında en iyi tercih",
    previewImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&h=600&q=80",
    templateNote: "",
    recommendedSectors: [],
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
];
