
import { DoorStyle, FinishOption, HardwareStyle } from './types';

export const DOOR_STYLES = [
  { 
    id: DoorStyle.SHAKER_CLASSIC, 
    name: 'Shaker', 
    desc: 'The timeless 5-piece door style with clean, classic lines.',
    image: '/everything-visualized/shaker-door.png' 
  },
  { 
    id: DoorStyle.SHAKER_SLIDE, 
    name: 'Slide', 
    desc: 'A modern streamlined profile with horizontal emphasis.',
    image: '/everything-visualized/slide-door.png' 
  },
  { 
    id: DoorStyle.FUSION_SHAKER, 
    name: 'Shaker Fusion', 
    desc: 'Combines Shaker doors with slab drawer fronts for a transitional look.',
    image: '/everything-visualized/shaker-fusion-door.png' 
  },
  { 
    id: DoorStyle.SLAB, 
    name: 'Slab', 
    desc: 'Minimalist flat doors for contemporary design.',
    image: '/everything-visualized/slab-door.png' 
  },
  { 
    id: DoorStyle.FUSION_SLIDE, 
    name: 'Slide Fusion', 
    desc: 'Slide profile doors mixed with modern slab drawers.',
    image: '/everything-visualized/slide-fusion-door.png' 
  }
];

export const FINISH_OPTIONS: FinishOption[] = [
  // Core 4 (Available on ALL styles)
  { 
    id: 'snow-white', 
    name: 'Snow White', 
    hex: '#FFFFFF', 
    texture: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=300',
    type: 'Matte', 
    description: 'Crisp, clean white', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.SHAKER_SLIDE, DoorStyle.FUSION_SHAKER, DoorStyle.FUSION_SLIDE, DoorStyle.SLAB] 
  },
  { 
    id: 'slate-blue', 
    name: 'Slate Blue', 
    hex: '#64748b', 
    texture: 'https://images.unsplash.com/photo-1550920452-9b0445d34200?auto=format&fit=crop&q=80&w=300',
    type: 'Matte', 
    description: 'Cool grey-blue', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.SHAKER_SLIDE, DoorStyle.FUSION_SHAKER, DoorStyle.FUSION_SLIDE, DoorStyle.SLAB] 
  },
  { 
    id: 'graphite', 
    name: 'Graphite', 
    hex: '#374151', 
    texture: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=300',
    type: 'Matte', 
    description: 'Deep charcoal', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.SHAKER_SLIDE, DoorStyle.FUSION_SHAKER, DoorStyle.FUSION_SLIDE, DoorStyle.SLAB] 
  },
  { 
    id: 'espresso', 
    name: 'Espresso', 
    hex: '#3f2e26', 
    texture: 'https://images.unsplash.com/photo-1543446051-5183dbd842b5?auto=format&fit=crop&q=80&w=300',
    type: 'Wood', 
    description: 'Dark roast wood', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.SHAKER_SLIDE, DoorStyle.FUSION_SHAKER, DoorStyle.FUSION_SLIDE, DoorStyle.SLAB] 
  },

  // Expanded Palette (Classic Shaker, Fusion Shaker, Slab)
  { 
    id: 'mist-grey', 
    name: 'Mist Grey', 
    hex: '#cbd5e1', 
    texture: 'https://images.unsplash.com/photo-1595856417769-e78cee668647?auto=format&fit=crop&q=80&w=300',
    type: 'Matte', 
    description: 'Soft light grey', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.FUSION_SHAKER, DoorStyle.SLAB] 
  },
  { 
    id: 'biscuit', 
    name: 'Biscuit', 
    hex: '#e2d5c3', 
    texture: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=300',
    type: 'Matte', 
    description: 'Warm beige', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.FUSION_SHAKER, DoorStyle.SLAB] 
  },
  { 
    id: 'driftwood', 
    name: 'Driftwood', 
    hex: '#a89f91', 
    texture: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300',
    type: 'Wood', 
    description: 'Weathered oak', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.FUSION_SHAKER, DoorStyle.SLAB] 
  },
  { 
    id: 'chestnut', 
    name: 'Chestnut', 
    hex: '#8b5e3c', 
    texture: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=300',
    type: 'Wood', 
    description: 'Medium warm wood', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.FUSION_SHAKER, DoorStyle.SLAB] 
  },
  { 
    id: 'oatmeal', 
    name: 'Oatmeal', 
    hex: '#d6cebf', 
    texture: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?auto=format&fit=crop&q=80&w=300',
    type: 'Wood', 
    description: 'Light natural wood', 
    availableFor: [DoorStyle.SHAKER_CLASSIC, DoorStyle.FUSION_SHAKER, DoorStyle.SLAB] 
  },

  // Slab Exclusives
  { 
    id: 'gloss-white', 
    name: 'High Gloss White', 
    hex: '#fafafa', 
    texture: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=300',
    type: 'Gloss', 
    description: 'Mirror-finish white', 
    availableFor: [DoorStyle.SLAB] 
  },
  { 
    id: 'golden-oak', 
    name: 'Golden Oak', 
    hex: '#d4b06a', 
    texture: 'https://images.unsplash.com/photo-1610313813988-a6217dfa74e5?auto=format&fit=crop&q=80&w=300',
    type: 'Wood', 
    description: 'Rich honey tones', 
    availableFor: [DoorStyle.SLAB] 
  },
  { 
    id: 'blonde-maple', 
    name: 'Blonde Maple', 
    hex: '#f3e5ab', 
    texture: 'https://images.unsplash.com/photo-1581345638209-7d885fb07843?auto=format&fit=crop&q=80&w=300',
    type: 'Wood', 
    description: 'Pale scandinavian wood', 
    availableFor: [DoorStyle.SLAB] 
  },
];

export const HARDWARE_CATALOG: HardwareStyle[] = [
  { 
    id: 'arch', 
    name: 'Arch', 
    image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=300',
    description: 'Elegant curved handles', 
    finishes: ['Satin Nickel', 'Chrome', 'Matte Black', 'Rose Gold'] 
  },
  { 
    id: 'artisan', 
    name: 'Artisan', 
    image: 'https://images.unsplash.com/photo-1631889993859-a57a2405a2d6?auto=format&fit=crop&q=80&w=300',
    description: 'Modern industrial pulls', 
    finishes: ['Satin Nickel', 'Chrome', 'Matte Black', 'Rose Gold'] 
  },
  { 
    id: 'cottage', 
    name: 'Cottage', 
    image: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=300',
    description: 'Classic traditional curves', 
    finishes: ['Satin Nickel', 'Chrome', 'Matte Black', 'Rose Gold'] 
  },
  { 
    id: 'bar-pull', 
    name: 'Bar Pull', 
    image: 'https://images.unsplash.com/photo-1615302302821-4f11b682b13e?auto=format&fit=crop&q=80&w=300',
    description: 'Minimalist T-bar style', 
    finishes: ['Satin Nickel', 'Matte Black'] 
  },
  { 
    id: 'loft', 
    name: 'Loft', 
    image: 'https://images.unsplash.com/photo-1584620836301-814d6f125a8e?auto=format&fit=crop&q=80&w=300',
    description: 'Sleek angular handles', 
    finishes: ['Satin Nickel', 'Chrome', 'Matte Black', 'Rose Gold'] 
  },
  { 
    id: 'square', 
    name: 'Square', 
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=300',
    description: 'Bold geometric design', 
    finishes: ['Satin Nickel', 'Chrome', 'Matte Black', 'Rose Gold'] 
  },
];
