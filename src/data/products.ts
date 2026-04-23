export type ProductStatus = "no-video" | "ready";
export type ProductTag = "no-video" | "best-seller" | "recent";

export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  status: ProductStatus;
  tags: ProductTag[];
}

// Unsplash placeholder images (no API key required)
const img = (q: string, n: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&h=600&q=80&v=${n}`;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Cloudrunner Sneakers",
    brand: "Northwave",
    image: img("photo-1542291026-7eec264c27ff", 1),
    status: "no-video",
    tags: ["no-video", "best-seller"],
  },
  {
    id: "p2",
    name: "Everyday Leather Tote",
    brand: "Atelier Mira",
    image: img("photo-1584917865442-de89df76afd3", 2),
    status: "no-video",
    tags: ["no-video", "recent"],
  },
  {
    id: "p3",
    name: "Aurora Linen Shirt",
    brand: "Kinfolk",
    image: img("photo-1620799140408-edc6dcb6d633", 3),
    status: "ready",
    tags: ["best-seller"],
  },
  {
    id: "p4",
    name: "Minimalist Wool Coat",
    brand: "Northwave",
    image: img("photo-1591047139829-d91aecb6caea", 4),
    status: "no-video",
    tags: ["no-video"],
  },
  {
    id: "p5",
    name: "Studio Ceramic Mug",
    brand: "Hearth & Form",
    image: img("photo-1514228742587-6b1558fcca3d", 5),
    status: "no-video",
    tags: ["no-video", "recent"],
  },
  {
    id: "p6",
    name: "Pebble Wireless Lamp",
    brand: "Lumen Co",
    image: img("photo-1507473885765-e6ed057f782c", 6),
    status: "no-video",
    tags: ["no-video", "best-seller"],
  },
  {
    id: "p7",
    name: "Trail 24 Backpack",
    brand: "Roam Goods",
    image: img("photo-1553062407-98eeb64c6a62", 7),
    status: "ready",
    tags: ["recent"],
  },
  {
    id: "p8",
    name: "Cedar Wood Watch",
    brand: "Halden",
    image: img("photo-1524805444758-089113d48a6d", 8),
    status: "no-video",
    tags: ["no-video"],
  },
  {
    id: "p9",
    name: "Glass Pour Over Set",
    brand: "Hearth & Form",
    image: img("photo-1495474472287-4d71bcdd2085", 9),
    status: "no-video",
    tags: ["no-video", "recent"],
  },
  {
    id: "p10",
    name: "Soft Knit Beanie",
    brand: "Kinfolk",
    image: img("photo-1576871337632-b9aef4c17ab9", 10),
    status: "ready",
    tags: ["best-seller"],
  },
  {
    id: "p11",
    name: "Linen Throw Blanket",
    brand: "Hearth & Form",
    image: img("photo-1584100936595-c0654b55a2e2", 11),
    status: "no-video",
    tags: ["no-video"],
  },
  {
    id: "p12",
    name: "Leather Card Wallet",
    brand: "Atelier Mira",
    image: img("photo-1627123424574-724758594e93", 12),
    status: "no-video",
    tags: ["no-video", "best-seller"],
  },
];
