import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("gilbert");
export const dynamic = "force-static";

export default function GilbertCityPage() {
  return <CityLandingPage cityKey="gilbert" />;
}
