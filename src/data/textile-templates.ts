import { type TemplateId } from "@/types/video-flow";

export interface TextileTemplateDefinition {
  id: TemplateId;
  previewVideo: string;
  recommendedSectors: string[];
}

export const TEXTILE_TEMPLATES: TextileTemplateDefinition[] = [
  {
    id: "sokakta-yuruyen-kiz",
    previewVideo: "/templates/A_stylish_young_woman_walking.mp4",
    recommendedSectors: ["tekstil"],
  },
  {
    id: "magaza-yazan-kiz",
    previewVideo: "/templates/A_fashionable_young_woman_stan.mp4",
    recommendedSectors: ["tekstil"],
  },
  {
    id: "plajda-yuruyen-kiz",
    previewVideo: "/templates/A_young_woman_walking_barefoot.mp4",
    recommendedSectors: ["tekstil"],
  },
  {
    id: "ziplayanKiz",
    previewVideo: "/templates/A_young_energetic_woman_captur.mp4",
    recommendedSectors: ["tekstil"],
  },
];
