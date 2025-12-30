// src/lib/megaCategories.ts

export type FeaturedProduct = {
  title: string;
  image: string;
  price: string;
};

export type MegaCategory = {
  sections: Record<string, string[]>;
  featured?: FeaturedProduct[];
};

export const MEGA_CATEGORIES: Record<string, MegaCategory> = {
  furniture: {
    sections: {
      Furniture: [
        "Chairs",
        "Tables",
        "Sofas",
        "Beds",
        "Wardrobes",
      ],
      Office: [
        "Office Chairs",
        "Desks",
        "Book Shelves",
      ],
      Outdoor: [
        "Garden Chairs",
        "Outdoor Tables",
      ],
    },
    featured: [
      {
        title: "Classic Wooden Chair",
        image: "https://files.catbox.moe/dfux91.jpeg",
        price: "$129.00",
      },
      {
        title: "Modern Coffee Table",
        image: "https://files.catbox.moe/7wmool.jpeg",
        price: "$199.00",
      },
    ],
  },

  cooking: {
    sections: {
      Kitchen: [
        "Cookware",
        "Bakeware",
        "Utensils",
        "Knives",
      ],
      Appliances: [
        "Mixers",
        "Blenders",
        "Coffee Makers",
      ],
    },
    featured: [
      {
        title: "Premium Cooking Set",
        image: "https://files.catbox.moe/c0g5ms.jpeg",
        price: "$89.00",
      },
    ],
  },

  accessories: {
    sections: {
      Decor: [
        "Wall Art",
        "Vases",
        "Clocks",
      ],
      Storage: [
        "Shelves",
        "Boxes",
        "Baskets",
      ],
    },
  },

  fashion: {
    sections: {
      Men: [
        "Shirts",
        "Jackets",
        "Shoes",
      ],
      Women: [
        "Dresses",
        "Handbags",
        "Accessories",
      ],
    },
    featured: [
      {
        title: "Elegant Floral Dress",
        image: "https://files.catbox.moe/zw24zm.jpeg",
        price: "$59.00",
      },
    ],
  },

  lighting: {
    sections: {
      Indoor: [
        "Ceiling Lights",
        "Table Lamps",
        "Wall Lights",
      ],
      Outdoor: [
        "Garden Lights",
        "Pathway Lights",
      ],
    },
  },

  clocks: {
    sections: {
      Styles: [
        "Wall Clocks",
        "Table Clocks",
        "Digital Clocks",
      ],
    },
  },

  toys: {
    sections: {
      Kids: [
        "Educational Toys",
        "Soft Toys",
        "Remote Cars",
      ],
    },
  },
};