import type { Metadata } from "next";
import cityContent from "./city-landing-content.json";

export const FINAL_CITY_KEYS = [
  "phoenix",
  "scottsdale",
  "tempe",
  "mesa",
  "chandler",
  "gilbert",
  "glendale",
  "peoria",
  "surprise",
  "goodyear",
  "buckeye",
  "anthem",
] as const;

export type CityKey = (typeof FINAL_CITY_KEYS)[number];
export type PrimaryHook =
  | "speed"
  | "luxury"
  | "savings"
  | "resale/ROI"
  | "family/low disruption"
  | "modernize builder-grade";

export interface CityFaq {
  question: string;
  answer: string;
}

export interface CityProject {
  title: string;
  neighborhood: string;
  beforeImage: string;
  afterImage: string;
}

export interface CityLandingData {
  city: string;
  route: string;
  heroKicker: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryHook: PrimaryHook;
  uniqueStory: string;
  localProof: string[];
  neighborhoods: string[];
  projects: CityProject[];
  faqs: CityFaq[];
  metaDescription: string;
}

export const CITY_LANDING_DATA = cityContent as Record<CityKey, CityLandingData>;

export function getCityMetadata(cityKey: CityKey): Metadata {
  const city = CITY_LANDING_DATA[cityKey];

  return {
    title: `Cabinet Refacing in ${city.city}, AZ | Vulpine Homes`,
    description: city.metaDescription,
    alternates: {
      canonical: city.route,
    },
    openGraph: {
      title: `Cabinet Refacing in ${city.city}, AZ | Vulpine Homes`,
      description: city.metaDescription,
      url: city.route,
    },
  };
}

export const FINAL_CITY_ROUTES = FINAL_CITY_KEYS.map((key) => CITY_LANDING_DATA[key].route);
