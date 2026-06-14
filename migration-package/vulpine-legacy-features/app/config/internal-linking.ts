// Internal Linking Architecture Configuration
// Simplified to final approved city set for Phase 1

export interface LinkingNode {
  id: string;
  name: string;
  url: string;
  layer: 0 | 1 | 2 | 3;
  type: "homepage" | "city" | "cluster" | "conversion";
  parent?: string;
  children?: string[];
  siblings?: string[];
  anchorTextVariants: {
    exact: string[];
    partial: string[];
    branded: string[];
  };
  metadata: {
    priority: number;
    zipCoverage?: string[];
    cities?: string[];
    description: string;
  };
}

type CitySeed = {
  id: string;
  name: string;
  url: string;
  priority: number;
  description: string;
};

const FINAL_CITIES: CitySeed[] = [
  {
    id: "phoenix",
    name: "Phoenix",
    url: "/cabinet-refacing-phoenix-az",
    priority: 10,
    description: "Phoenix city hub for cabinet refacing",
  },
  {
    id: "scottsdale",
    name: "Scottsdale",
    url: "/cabinet-refacing-scottsdale",
    priority: 9,
    description: "Scottsdale luxury cabinet refacing coverage",
  },
  {
    id: "tempe",
    name: "Tempe",
    url: "/cabinet-refacing-tempe",
    priority: 8,
    description: "Tempe fast-turnaround cabinet refacing",
  },
  {
    id: "mesa",
    name: "Mesa",
    url: "/cabinet-refacing-mesa",
    priority: 9,
    description: "Mesa family-focused cabinet refacing",
  },
  {
    id: "chandler",
    name: "Chandler",
    url: "/cabinet-refacing-chandler",
    priority: 8,
    description: "Chandler builder-grade modernization",
  },
  {
    id: "gilbert",
    name: "Gilbert",
    url: "/cabinet-refacing-gilbert",
    priority: 8,
    description: "Gilbert ROI-driven cabinet refacing",
  },
  {
    id: "glendale",
    name: "Glendale",
    url: "/cabinet-refacing-glendale",
    priority: 8,
    description: "Glendale value-first cabinet refacing",
  },
  {
    id: "peoria",
    name: "Peoria",
    url: "/cabinet-refacing-peoria",
    priority: 8,
    description: "Peoria long-term value kitchen upgrades",
  },
  {
    id: "surprise",
    name: "Surprise",
    url: "/cabinet-refacing-surprise",
    priority: 8,
    description: "Surprise builder-grade cabinet upgrades",
  },
  {
    id: "goodyear",
    name: "Goodyear",
    url: "/cabinet-refacing-goodyear",
    priority: 8,
    description: "Goodyear low-disruption cabinet refacing",
  },
  {
    id: "buckeye",
    name: "Buckeye",
    url: "/cabinet-refacing-buckeye",
    priority: 8,
    description: "Buckeye personalization for new-build kitchens",
  },
  {
    id: "anthem",
    name: "Anthem",
    url: "/cabinet-refacing-anthem",
    priority: 8,
    description: "Anthem disciplined, HOA-aware cabinet refacing",
  },
];

const cityIds = FINAL_CITIES.map((city) => city.id);

const cityNodes: Record<string, LinkingNode> = FINAL_CITIES.reduce((acc, city) => {
  acc[city.id] = {
    id: city.id,
    name: city.name,
    url: city.url,
    layer: 1,
    type: "city",
    parent: "homepage",
    children: [],
    siblings: cityIds.filter((id) => id !== city.id),
    anchorTextVariants: {
      exact: [`Cabinet Refacing ${city.name}`, `${city.name} Cabinet Refacing`],
      partial: [`${city.name} kitchen upgrade experts`, `cabinet refacing in ${city.name}`],
      branded: [`Vulpine Homes ${city.name}`, `Vulpine ${city.name}`],
    },
    metadata: {
      priority: city.priority,
      cities: [city.name],
      description: city.description,
    },
  };
  return acc;
}, {} as Record<string, LinkingNode>);

export const LINKING_ARCHITECTURE: Record<string, LinkingNode> = {
  homepage: {
    id: "homepage",
    name: "Vulpine Homes",
    url: "/",
    layer: 0,
    type: "homepage",
    children: cityIds,
    anchorTextVariants: {
      exact: ["Vulpine Homes", "Vulpine Homes Arizona"],
      partial: ["cabinet refacing experts", "Arizona kitchen transformation team"],
      branded: ["Vulpine", "Vulpine Homes", "Vulpine LLC"],
    },
    metadata: {
      priority: 10,
      description: "Homepage authority hub for cabinet refacing and kitchen upgrades",
    },
  },
  ...cityNodes,
  "kitchen-quote": {
    id: "kitchen-quote",
    name: "Kitchen Quote",
    url: "/get-quote",
    layer: 3,
    type: "conversion",
    anchorTextVariants: {
      exact: ["Get Free Quote", "Free Kitchen Quote"],
      partial: ["cabinet refacing quote", "kitchen estimate"],
      branded: ["Vulpine Quote", "Vulpine Homes Quote"],
    },
    metadata: {
      priority: 10,
      description: "Primary conversion page for free quote requests",
    },
  },
};

export function selectAnchorText(
  nodeId: string,
  targetId: string,
  context: "upward" | "downward" | "sideways" | "conversion"
): string {
  const target = LINKING_ARCHITECTURE[targetId];
  if (!target) return targetId;

  const hash = hashCode(`${nodeId}-${targetId}-${context}`);
  const variants = target.anchorTextVariants;

  if (context === "upward") {
    const rand = hash % 100;
    if (rand < 70) return variants.partial[hash % variants.partial.length];
    if (rand < 90) return variants.branded[hash % variants.branded.length];
    return variants.exact[hash % variants.exact.length];
  }

  if (context === "downward") {
    const rand = hash % 100;
    if (rand < 60) return variants.exact[hash % variants.exact.length];
    if (rand < 85) return variants.partial[hash % variants.partial.length];
    return variants.branded[hash % variants.branded.length];
  }

  if (context === "sideways") {
    const rand = hash % 100;
    if (rand < 50) return variants.partial[hash % variants.partial.length];
    if (rand < 80) return variants.exact[hash % variants.exact.length];
    return variants.branded[hash % variants.branded.length];
  }

  return variants.exact[hash % variants.exact.length];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return Math.abs(hash);
}

export function getLinkingRelationships(nodeId: string): {
  upward: string[];
  downward: string[];
  sideways: string[];
  conversion: string[];
} {
  const node = LINKING_ARCHITECTURE[nodeId];
  if (!node) {
    return { upward: [], downward: [], sideways: [], conversion: [] };
  }

  return {
    upward: node.parent ? [node.parent] : [],
    downward: node.children || [],
    sideways: node.siblings || [],
    conversion: node.layer < 3 ? ["kitchen-quote"] : [],
  };
}

export function getNodesByLayer(layer: number): LinkingNode[] {
  return Object.values(LINKING_ARCHITECTURE).filter((node) => node.layer === layer);
}

export function getHighPriorityNodes(minPriority = 7): LinkingNode[] {
  return Object.values(LINKING_ARCHITECTURE).filter((node) => node.metadata.priority >= minPriority);
}
