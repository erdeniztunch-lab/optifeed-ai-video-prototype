export interface TaxonomyOption {
  value: string;
  label: string;
}

export const SECTORS: TaxonomyOption[] = [
  { value: "tekstil", label: "Moda & Giyim" },
  { value: "electronics", label: "Elektronik" },
  { value: "home", label: "Ev & Yaşam" },
  { value: "beauty", label: "Güzellik & Kişisel Bakım" },
  { value: "sports", label: "Spor & Outdoor" },
  { value: "food", label: "Gıda & İçecek" },
  { value: "jewelry", label: "Takı & Aksesuar" },
  { value: "other", label: "Diğer" },
];

export const THEMES: TaxonomyOption[] = [
  { value: "lifestyle", label: "Yaşam Tarzı" },
  { value: "minimalist", label: "Minimalist" },
  { value: "vibrant", label: "Canlı & Renkli" },
  { value: "elegant", label: "Zarif & Lüks" },
  { value: "outdoor", label: "Outdoor & Doğa" },
  { value: "urban", label: "Kentsel & Modern" },
  { value: "seasonal", label: "Sezonluk" },
  { value: "other", label: "Diğer" },
];

export const PRODUCT_TYPES: TaxonomyOption[] = [
  { value: "apparel", label: "Kıyafet" },
  { value: "footwear", label: "Ayakkabı" },
  { value: "bags", label: "Çanta & Aksesuar" },
  { value: "home-decor", label: "Ev Dekor" },
  { value: "electronics", label: "Elektronik" },
  { value: "beauty", label: "Güzellik" },
  { value: "food", label: "Gıda" },
  { value: "sports", label: "Spor Ekipmanı" },
  { value: "other", label: "Diğer" },
];
