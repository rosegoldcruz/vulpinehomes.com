import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("gilbert");

export default function GilbertCityPage() {
  return <CityLandingPage cityKey="gilbert" />;
}
