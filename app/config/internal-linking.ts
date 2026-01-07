// Internal Linking Architecture Configuration
// Four-layer hub-and-spoke model for SEO authority distribution

export interface LinkingNode {
  id: string;
  name: string;
  url: string;
  layer: 0 | 1 | 2 | 3; // Homepage, City Anchor, Cluster, Conversion
  type: 'homepage' | 'city' | 'cluster' | 'conversion';
  parent?: string; // For layer 2-3 nodes
  children?: string[]; // For layer 0-2 nodes
  siblings?: string[]; // Same-level connections
  anchorTextVariants: {
    exact: string[];
    partial: string[];
    branded: string[];
  };
  metadata: {
    priority: number; // 1-10, higher = more important
    zipCoverage?: string[];
    cities?: string[];
    description: string;
  };
}

export const LINKING_ARCHITECTURE: Record<string, LinkingNode> = {
  // Layer 0: Homepage (Central Power Source)
  homepage: {
    id: 'homepage',
    name: 'Vulpine Homes',
    url: '/',
    layer: 0,
    type: 'homepage',
    children: ['phoenix', 'mesa', 'gilbert'], // Primary hubs: Phoenix (main) + Mesa/Gilbert (secondary)
    anchorTextVariants: {
      exact: ['Vulpine Homes', 'Vulpine Homes Arizona'],
      partial: ['kitchen transformation specialists', 'cabinet refacing experts', 'Arizona kitchen remodel'],
      branded: ['Vulpine', 'Vulpine Homes', 'Vulpine LLC'],
    },
    metadata: {
      priority: 10,
      description: 'Central authority hub for all kitchen transformation services',
    },
  },

  // Layer 1: Primary City Anchors
  phoenix: {
    id: 'phoenix',
    name: 'Phoenix',
    url: '/cabinet-refacing-phoenix-az',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: ['north-phoenix', 'south-phoenix', 'west-valley'], // Phoenix clusters
    siblings: ['mesa', 'gilbert', 'scottsdale', 'chandler', 'tempe', 'glendale', 'globe', 'buckeye'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Phoenix', 'Phoenix Cabinet Refacing'],
      partial: ['Phoenix kitchen experts', 'cabinet solutions Phoenix', 'Phoenix kitchen remodel'],
      branded: ['Vulpine Phoenix', 'Vulpine Homes Phoenix'],
    },
    metadata: {
      priority: 10, // Main hub - highest priority
      cities: ['Phoenix'],
      description: 'Phoenix city anchor - main hub serving metropolitan area',
    },
  },

  scottsdale: {
    id: 'scottsdale',
    name: 'Scottsdale',
    url: '/cabinet-refacing-scottsdale',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: ['north-scottsdale'],
    siblings: ['phoenix', 'chandler', 'mesa', 'tempe', 'glendale', 'gilbert'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Scottsdale', 'Scottsdale Cabinet Refacing'],
      partial: ['Scottsdale kitchen experts', 'luxury cabinet solutions Scottsdale', 'Scottsdale kitchen remodel'],
      branded: ['Vulpine Scottsdale', 'Vulpine Homes Scottsdale'],
    },
    metadata: {
      priority: 8,
      cities: ['Scottsdale'],
      description: 'Scottsdale city anchor with luxury market focus',
    },
  },

  chandler: {
    id: 'chandler',
    name: 'Chandler',
    url: '/cabinet-refacing-chandler',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'scottsdale', 'mesa', 'tempe', 'glendale', 'gilbert'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Chandler', 'Chandler Cabinet Refacing'],
      partial: ['Chandler kitchen solutions', 'cabinet experts Chandler', 'Chandler kitchen remodel'],
      branded: ['Vulpine Chandler', 'Vulpine Homes Chandler'],
    },
    metadata: {
      priority: 7,
      cities: ['Chandler'],
      description: 'Chandler city anchor serving East Valley communities',
    },
  },

  mesa: {
    id: 'mesa',
    name: 'Mesa',
    url: '/cabinet-refacing-mesa',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [], // Secondary hub - can have clusters added later
    siblings: ['phoenix', 'gilbert', 'scottsdale', 'chandler', 'tempe', 'glendale', 'globe', 'buckeye'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Mesa', 'Mesa Cabinet Refacing'],
      partial: ['Mesa kitchen experts', 'cabinet solutions Mesa', 'Mesa kitchen remodel'],
      branded: ['Vulpine Mesa', 'Vulpine Homes Mesa'],
    },
    metadata: {
      priority: 9, // Secondary hub - high priority
      cities: ['Mesa'],
      description: 'Mesa city anchor - secondary hub serving East Valley',
    },
  },

  tempe: {
    id: 'tempe',
    name: 'Tempe',
    url: '/cabinet-refacing-tempe',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'scottsdale', 'chandler', 'mesa', 'glendale', 'gilbert'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Tempe', 'Tempe Cabinet Refacing'],
      partial: ['Tempe kitchen experts', 'cabinet solutions Tempe', 'Tempe kitchen remodel'],
      branded: ['Vulpine Tempe', 'Vulpine Homes Tempe'],
    },
    metadata: {
      priority: 6,
      cities: ['Tempe'],
      description: 'Tempe city anchor serving diverse residential communities',
    },
  },

  glendale: {
    id: 'glendale',
    name: 'Glendale',
    url: '/cabinet-refacing-glendale',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'scottsdale', 'chandler', 'mesa', 'tempe', 'gilbert'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Glendale', 'Glendale Cabinet Refacing'],
      partial: ['Glendale kitchen solutions', 'cabinet experts Glendale', 'Glendale kitchen remodel'],
      branded: ['Vulpine Glendale', 'Vulpine Homes Glendale'],
    },
    metadata: {
      priority: 6,
      cities: ['Glendale'],
      description: 'Glendale city anchor serving West Valley communities',
    },
  },

  goodyear: {
    id: 'goodyear',
    name: 'Goodyear',
    url: '/cabinet-refacing-goodyear',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'glendale', 'avondale', 'buckeye', 'peoria', 'surprise'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Goodyear', 'Goodyear Cabinet Refacing'],
      partial: ['Goodyear kitchen solutions', 'cabinet experts Goodyear', 'Goodyear kitchen remodel'],
      branded: ['Vulpine Goodyear', 'Vulpine Homes Goodyear'],
    },
    metadata: {
      priority: 6,
      cities: ['Goodyear'],
      description: 'Goodyear city anchor serving West Valley neighborhoods',
    },
  },

  peoria: {
    id: 'peoria',
    name: 'Peoria',
    url: '/cabinet-refacing-peoria',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'glendale', 'surprise', 'goodyear', 'avondale'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Peoria', 'Peoria Cabinet Refacing'],
      partial: ['Peoria kitchen solutions', 'cabinet experts Peoria', 'Peoria kitchen remodel'],
      branded: ['Vulpine Peoria', 'Vulpine Homes Peoria'],
    },
    metadata: {
      priority: 6,
      cities: ['Peoria'],
      description: 'Peoria city anchor with family community focus',
    },
  },

  buckeye: {
    id: 'buckeye',
    name: 'Buckeye',
    url: '/cabinet-refacing-buckeye',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'goodyear', 'avondale', 'surprise', 'glendale'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Buckeye', 'Buckeye Cabinet Refacing'],
      partial: ['Buckeye kitchen solutions', 'cabinet experts Buckeye', 'Buckeye kitchen remodel'],
      branded: ['Vulpine Buckeye', 'Vulpine Homes Buckeye'],
    },
    metadata: {
      priority: 6,
      cities: ['Buckeye'],
      description: 'Buckeye city anchor serving Verrado, Sundance, Tartesso and more',
    },
  },

  surprise: {
    id: 'surprise',
    name: 'Surprise',
    url: '/cabinet-refacing-surprise',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [],
    siblings: ['phoenix', 'glendale', 'peoria', 'goodyear', 'avondale'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Surprise', 'Surprise Cabinet Refacing'],
      partial: ['Surprise kitchen solutions', 'cabinet experts Surprise', 'Surprise kitchen remodel'],
      branded: ['Vulpine Surprise', 'Vulpine Homes Surprise'],
    },
    metadata: {
      priority: 6,
      cities: ['Surprise'],
      description: 'Surprise city anchor serving West Valley areas',
    },
  },

  gilbert: {
    id: 'gilbert',
    name: 'Gilbert',
    url: '/cabinet-refacing-gilbert',
    layer: 1,
    type: 'city',
    parent: 'homepage',
    children: [], // Secondary hub - can have clusters added later
    siblings: ['phoenix', 'mesa', 'scottsdale', 'chandler', 'tempe', 'glendale', 'globe', 'buckeye'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing Gilbert', 'Gilbert Cabinet Refacing'],
      partial: ['Gilbert kitchen experts', 'cabinet solutions Gilbert', 'Gilbert kitchen remodel'],
      branded: ['Vulpine Gilbert', 'Vulpine Homes Gilbert'],
    },
    metadata: {
      priority: 9, // Secondary hub - high priority
      cities: ['Gilbert'],
      description: 'Gilbert city anchor - secondary hub serving family communities',
    },
  },

  // Layer 2: Cluster Pages (Long-tail capture)
  'north-phoenix': {
    id: 'north-phoenix',
    name: 'North Phoenix',
    url: '/cabinet-refacing-north-phoenix',
    layer: 2,
    type: 'cluster',
    parent: 'phoenix',
    siblings: ['south-phoenix', 'east-valley', 'west-valley'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing North Phoenix AZ'],
      partial: ['North Phoenix kitchen solutions', 'cabinet experts North Phoenix', 'family kitchen transformations North Phoenix'],
      branded: ['Vulpine North Phoenix', 'Vulpine Homes North Phoenix'],
    },
    metadata: {
      priority: 7,
      zipCoverage: ['85051', '85053', '85083', '85085', '85086'],
      description: 'North Phoenix cluster serving family neighborhoods with ZIP-specific coverage',
    },
  },

  'south-phoenix': {
    id: 'south-phoenix',
    name: 'South Phoenix',
    url: '/cabinet-refacing-south-phoenix',
    layer: 2,
    type: 'cluster',
    parent: 'phoenix',
    siblings: ['north-phoenix', 'east-valley', 'west-valley'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing South Phoenix AZ'],
      partial: ['South Phoenix kitchen experts', 'affordable cabinet solutions South Phoenix', 'community kitchen transformations'],
      branded: ['Vulpine South Phoenix', 'Vulpine Homes South Phoenix'],
    },
    metadata: {
      priority: 6,
      description: 'South Phoenix cluster with community-focused affordable solutions',
    },
  },

  'east-valley': {
    id: 'east-valley',
    name: 'East Valley',
    url: '/cabinet-refacing-east-valley',
    layer: 2,
    type: 'cluster',
    parent: 'phoenix',
    siblings: ['north-phoenix', 'south-phoenix', 'west-valley'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing East Valley AZ'],
      partial: ['East Valley regional service', 'multi-city kitchen solutions East Valley', 'comprehensive East Valley coverage'],
      branded: ['Vulpine East Valley', 'Vulpine Homes East Valley'],
    },
    metadata: {
      priority: 7,
      cities: ['Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Queen Creek'],
      description: 'East Valley regional hub serving multiple cities with coordinated service',
    },
  },

  'west-valley': {
    id: 'west-valley',
    name: 'West Valley',
    url: '/cabinet-refacing-west-valley',
    layer: 2,
    type: 'cluster',
    parent: 'phoenix',
    siblings: ['north-phoenix', 'south-phoenix', 'east-valley'],
    anchorTextVariants: {
      exact: ['Cabinet Refacing West Valley AZ'],
      partial: ['West Valley affordable solutions', 'cabinet experts West Valley region', 'West Valley kitchen transformations'],
      branded: ['Vulpine West Valley', 'Vulpine Homes West Valley'],
    },
    metadata: {
      priority: 6,
      zipCoverage: ['85301', '85302', '85303', '85304', '85305', '85306', '85307', '85308', '85309', '85310'],
      description: 'West Valley cluster with affordable pricing focus and comprehensive ZIP coverage',
    },
  },

  'north-scottsdale': {
    id: 'north-scottsdale',
    name: 'North Scottsdale',
    url: '/cabinet-refacing-north-scottsdale',
    layer: 2,
    type: 'cluster',
    parent: 'scottsdale',
    siblings: [],
    anchorTextVariants: {
      exact: ['Cabinet Refacing North Scottsdale AZ'],
      partial: ['North Scottsdale luxury kitchens', 'premium cabinet solutions North Scottsdale', 'luxury kitchen transformations'],
      branded: ['Vulpine North Scottsdale', 'Vulpine Homes North Scottsdale'],
    },
    metadata: {
      priority: 7,
      description: 'North Scottsdale luxury cluster serving high-end communities',
    },
  },

  // Layer 3: Conversion Pages
  'kitchen-quote': {
    id: 'kitchen-quote',
    name: 'Kitchen Quote',
    url: '/vulpine/kitchen-quote',
    layer: 3,
    type: 'conversion',
    anchorTextVariants: {
      exact: ['Get Free Quote', 'Free Kitchen Quote'],
      partial: ['kitchen remodeling quote', 'cabinet refacing estimate', 'free consultation'],
      branded: ['Vulpine Quote', 'Vulpine Free Quote'],
    },
    metadata: {
      priority: 10,
      description: 'Primary conversion page for lead generation',
    },
  },
};

// Helper functions for anchor text selection with deterministic variation
export function selectAnchorText(
  nodeId: string,
  targetId: string,
  context: 'upward' | 'downward' | 'sideways' | 'conversion'
): string {
  const target = LINKING_ARCHITECTURE[targetId];
  if (!target) return targetId; // Return fallback when target doesn't exist

  // Create deterministic hash for consistent anchor selection
  const hash = hashCode(`${nodeId}-${targetId}-${context}`);
  const variants = target.anchorTextVariants;
  
  // Anchor text distribution based on context
  if (context === 'upward') {
    // 70% partial match, 20% branded, 10% exact match
    const rand = (hash % 100);
    if (rand < 70) return variants.partial[hash % variants.partial.length];
    if (rand < 90) return variants.branded[hash % variants.branded.length];
    return variants.exact[hash % variants.exact.length];
  } else if (context === 'downward') {
    // More exact matches for downward links
    const rand = (hash % 100);
    if (rand < 60) return variants.exact[hash % variants.exact.length];
    if (rand < 85) return variants.partial[hash % variants.partial.length];
    return variants.branded[hash % variants.branded.length];
  } else if (context === 'sideways') {
    // Balanced mix for sibling links
    const rand = (hash % 100);
    if (rand < 50) return variants.partial[hash % variants.partial.length];
    if (rand < 80) return variants.exact[hash % variants.exact.length];
    return variants.branded[hash % variants.branded.length];
  } else {
    // Conversion context - more action-oriented
    return variants.exact[hash % variants.exact.length];
  }
}

// Simple hash function for deterministic selection
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get linking relationships for a given node
export function getLinkingRelationships(nodeId: string): {
  upward: string[];
  downward: string[];
  sideways: string[];
  conversion: string[];
} {
  const node = LINKING_ARCHITECTURE[nodeId];
  if (!node) return { upward: [], downward: [], sideways: [], conversion: [] };

  const relationships = {
    upward: node.parent ? [node.parent] : [],
    downward: node.children || [],
    sideways: node.siblings || [],
    conversion: node.layer < 3 ? ['kitchen-quote'] : [],
  };

  return relationships;
}

// Get nodes by layer
export function getNodesByLayer(layer: number): LinkingNode[] {
  return Object.values(LINKING_ARCHITECTURE).filter(node => node.layer === layer);
}

// Get high-priority nodes for strategic linking
export function getHighPriorityNodes(minPriority: number = 7): LinkingNode[] {
  return Object.values(LINKING_ARCHITECTURE).filter(node => node.metadata.priority >= minPriority);
}
