export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingMinutes: number;
  tags: string[];
  content: string[]; // paragraph blocks (no placeholders)
};

export const posts: BlogPost[] = [
  {
    slug: "cabinet-refacing-vs-replacement",
    title: "Cabinet Refacing vs Full Replacement",
    excerpt:
      "Understand the cost, timeline, and outcome differences between refacing existing cabinets and replacing them entirely.",
    date: "2025-12-01",
    readingMinutes: 6,
    tags: ["refacing", "budget", "planning"],
    content: [
      "Cabinet refacing keeps your cabinet boxes in place and replaces the visible components—doors, drawer fronts, veneer, and hardware. This preserves a good layout, cuts demolition costs, and shortens timelines.",
      "Full replacement is best when boxes are damaged or the layout must change. It opens the door for redesign but requires higher budgets and longer schedules.",
      "As a rule of thumb in Phoenix, quality refacing often saves 40–60% compared to new custom cabinets while delivering a like‑new look in under a week.",
    ],
  },
  {
    slug: "best-kitchen-upgrades-on-a-budget",
    title: "Best Kitchen Upgrades on a Budget",
    excerpt:
      "Five upgrades that deliver visible impact without a full renovation, prioritized by value per dollar.",
    date: "2025-12-08",
    readingMinutes: 5,
    tags: ["budget", "design", "value"],
    content: [
      "Start with cabinet refacing to change the style and color while reusing solid boxes. Pair with modern hardware for an instant refresh.",
      "Add under‑cabinet lighting for task visibility and ambience. LED strips are efficient, dimmable, and easy to retrofit.",
      "Consider a single accent wall or panel system to anchor the space visually without reworking the entire room.",
    ],
  },
  {
    slug: "how-to-choose-cabinet-door-styles",
    title: "How to Choose Cabinet Door Styles",
    excerpt:
      "Shaker, Slab, and Fusion: how to pick the right profile for your kitchen’s architecture and lighting.",
    date: "2025-12-15",
    readingMinutes: 7,
    tags: ["design", "doors", "styles"],
    content: [
      "Shaker is timeless and pairs with a wide range of counters and backsplashes. It balances traditional lines with clean geometry.",
      "Slab doors emphasize minimalism. They excel in small spaces where uninterrupted planes make rooms feel larger.",
      "Fusion styles mix slab drawers with Shaker doors—great when you want subtle variation and easy operation at the same time.",
    ],
  },
  {
    slug: "cabinet-finishes-built-for-arizona",
    title: "Cabinet Finishes Built for Arizona",
    excerpt:
      "What to look for in durable finishes that handle heat, sun, and dry air common to Phoenix homes.",
    date: "2025-12-22",
    readingMinutes: 6,
    tags: ["materials", "durability", "arizona"],
    content: [
      "Prioritize finishes with UV resistance and stable cores. Consistent temperature swings and sunlight can stress inferior laminates.",
      "Ask about cleanability. Matte textures hide fingerprints; harder top‑coats resist abrasion in high‑traffic kitchens.",
      "Match finish tone to natural light exposure—warmer neutrals often read best in bright desert light.",
    ],
  },
  {
    slug: "preparing-for-your-in-home-consultation",
    title: "Preparing for Your In‑Home Consultation",
    excerpt:
      "Four steps to get the most out of your visit—photos, door counts, priorities, and timeline.",
    date: "2025-12-29",
    readingMinutes: 4,
    tags: ["planning", "consultation", "process"],
    content: [
      "Have a rough door and drawer count ready; an estimate helps set expectations before exact measurements.",
      "Take clear photos of the entire kitchen from multiple angles. Good photos speed up quoting and materials planning.",
      "List your must‑haves and nice‑to‑haves. A short priority list keeps design choices aligned with your goals.",
    ],
  },
];
