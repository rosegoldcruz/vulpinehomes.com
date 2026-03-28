import { MetadataRoute } from "next";
import { CITY_LANDING_DATA, FINAL_CITY_KEYS } from "./cabinet-refacing-city-data";

const BASE_URL = "https://vulpinehomes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityPages = FINAL_CITY_KEYS.map((key) => ({
    url: `${BASE_URL}${CITY_LANDING_DATA[key].route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/kitchen-cabinet-refacing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/areas-served`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/visualizer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/get-quote`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...cityPages,
  ];
}
