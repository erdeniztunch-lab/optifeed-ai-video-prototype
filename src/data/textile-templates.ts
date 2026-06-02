import { type TemplateId } from "@/types/video-flow";

export interface TextileTemplateDefinition {
  id: TemplateId;
  label: string;
  sceneContext: string;
  sceneType: string;
  previewVideo: string;
  recommendedSectors: string[];
  details: {
    scenarioFlow: string;
    suitableProducts: string[];
    accessories: string;
  };
}

export const TEXTILE_TEMPLATES: TextileTemplateDefinition[] = [
  {
    id: "sokakta-yuruyen-kiz",
    label: "Sokakta Yürüyen Kız",
    sceneContext: "Alışveriş sokağında yürüyüş, vitrin duraklama anı",
    sceneType: "Sokak",
    previewVideo: "/templates/A_stylish_young_woman_walking.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken alışveriş sokağının ucundan yürüyüşe başlar ve kameraya doğru ilerler. Bir vitrin önünde 1-2 saniye durarak kıyafeti ön ve arka açıdan gösterir. Kameraya dönerek bitiş karesini tamamlar.",
      suitableProducts: ["Elbise", "Üst Giyim", "Dış Giyim", "Takım"],
      accessories: "Opsiyonel: marka çantası, gözlük",
    },
  },
  {
    id: "magaza-yazan-kiz",
    label: "Mağaza Yazan Kız",
    sceneContext: "Mağaza cephesi önü, marka detay odağı",
    sceneType: "Mağaza",
    previewVideo: "/templates/A_fashionable_young_woman_stan.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken marka yazılı bir mağaza cephesi önünden yavaşça geçer. Elindeki küçük çanta kadraja belirginleşir ve kıyafet detayları öne çıkar. Durarak kameraya bakar.",
      suitableProducts: ["Elbise", "Kombin Set", "Üst Giyim"],
      accessories: "Marka çantası (zorunlu senaryo unsuru), gözlük",
    },
  },
  {
    id: "plajda-yuruyen-kiz",
    label: "Plajda Yürüyen Kız",
    sceneContext: "Sahil ortamı, kumaş hareketi ve doğal ışık",
    sceneType: "Plaj",
    previewVideo: "/templates/A_young_woman_walking_barefoot.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken sahil şeridinde yürür; hafif esinti kumaşı hareket ettirir. Durarak güneşe döner ve kıyafetin akışı ile rengi doğal ışıkta belirginleşir.",
      suitableProducts: ["Yazlık Elbise", "Pareo", "Plaj Giyim", "Hafif Kumaşlar"],
      accessories: "Opsiyonel: gözlük, şapka",
    },
  },
  {
    id: "ziplayanKiz",
    label: "Zıplayan Kız",
    sceneContext: "Dinamik hareket, kumaş dokusu ve enerji",
    sceneType: "Dinamik",
    previewVideo: "/templates/A_young_energetic_woman_captur.mp4",
    recommendedSectors: ["tekstil"],
    details: {
      scenarioFlow:
        "Manken kameraya doğru koşup zıplar; kumaşın hareketi ve dokusu bu karede belirginleşir. Yere inerek gülümser ve kameraya bakar.",
      suitableProducts: ["Casual", "Activewear", "Günlük Giyim", "Spor"],
      accessories: "Minimal aksesuar önerilir",
    },
  },
];
