// src/lib/home.ts
export type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  cta?: { label: string; href: string };
};

export const HOME_SLIDES: Slide[] = [
  {
    id: "s1",
    title: "Bright Ideas",
    subtitle: "Lighting that elevates every room",
    image:
      "https://files.catbox.moe/c0g5ms.jpeg",
    cta: { label: "Shop Lighting", href: "/category/lighting" },
  },
  {
    id: "s2",
    title: "Simple — Rock Chair",
    subtitle: "Serene forms, solid comfort",
    image:
      "https://files.catbox.moe/dfux91.jpeg",
    cta: { label: "Shop Furniture", href: "/category/furniture" },
  },
  {
    id: "s3",
    title: "Cook, Create, Enjoy",
    subtitle: "Tools & cookware you’ll love",
    image:
      "https://files.catbox.moe/6th468.jpeg",
    cta: { label: "Shop Cooking", href: "/category/cooking" },
  },
];