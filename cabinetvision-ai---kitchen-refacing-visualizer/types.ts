
export enum DoorStyle {
  SHAKER_CLASSIC = 'Shaker Classic',
  SHAKER_SLIDE = 'Shaker Slide',
  FUSION_SHAKER = 'Fusion Shaker',
  FUSION_SLIDE = 'Fusion Slide',
  SLAB = 'Slab'
}

export enum DrawerFront {
  MATCHING = 'Matching Door Style',
  SLAB = 'Flat Slab'
}

export interface FinishOption {
  id: string;
  name: string;
  hex: string;
  texture: string; // URL to texture image
  type: 'Solid' | 'Wood' | 'Gloss' | 'Matte';
  description: string;
  availableFor: DoorStyle[];
}

export interface HardwareStyle {
  id: string;
  name: string;
  image: string; // URL to hardware image
  description: string;
  finishes: string[];
  sizes?: string[];
}

export interface UserSelections {
  doorStyle: DoorStyle;
  drawerFront: DrawerFront;
  finish: FinishOption;
  hardwareStyle: string;
  hardwareFinish: string;
}

export interface VisualizerState {
  originalImages: string[];
  modifiedImages: Record<number, string>; // Map index to modified image URL
  currentImageIndex: number;
  isLoading: boolean;
  error: string | null;
}
