// src/lib/categories.ts
export type SubCat = { slug: string; label: string };

export type CatCfg = {
  slug: string;
  label: string;
  heroImage: string;
  sub: SubCat[];
};

export const CATEGORIES: Record<string, CatCfg> = {
  furniture: {
    slug: "furniture",
    label: "Furniture",
    heroImage:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop",
    sub: [
      { slug: "chairs", label: "Chairs" },
      { slug: "sofas", label: "Sofas" },
      { slug: "tables", label: "Tables" },
    ],
  },

  cooking: {
    slug: "cooking",
    label: "Cooking",
    heroImage:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600&auto=format&fit=crop",
    sub: [
      { slug: "cookware", label: "Cookware" },
      { slug: "mixers", label: "Mixers" },
    ],
  },

  fashion: {
    slug: "fashion",
    label: "Fashion",
    heroImage:
      "https://images.unsplash.com/photo-1520975867597-0f8775895a4e?q=80&w=1600&auto=format&fit=crop",
    sub: [
      { slug: "women", label: "Women" },
      { slug: "men", label: "Men" },
    ],
  },

  accessories: {
    slug: "accessories",
    label: "Accessories",
    heroImage:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
    sub: [
      { slug: "home-decor", label: "Home décor" },
      { slug: "vases", label: "Vases" },
    ],
  },

  clocks: {
    slug: "clocks",
    label: "Clocks",
    heroImage:
      "https://images.unsplash.com/photo-1511735643442-503bb3bd3483?q=80&w=1600&auto=format&fit=crop",
    sub: [{ slug: "wall-clocks", label: "Wall clocks" }],
  },

  lighting: {
    slug: "lighting",
    label: "Lighting",
    heroImage:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop",
    sub: [
      { slug: "floor-lamps", label: "Floor lamps" },
      { slug: "ceiling", label: "Ceiling" },
    ],
  },

  toys: {
    slug: "toys",
    label: "Toys",
    heroImage:
      "https://images.unsplash.com/photo-1601758064130-76f8a1f5d9c2?q=80&w=1600&auto=format&fit=crop",
    sub: [
      { slug: "car-toys", label: "Car toys" },
      { slug: "plush", label: "Plush" },
    ],
  },
};

// (optional) if other parts of your app use this
export const ALL_CATS = Object.values(CATEGORIES).map((c) => ({
  key: c.slug,
  label: c.label,
}));