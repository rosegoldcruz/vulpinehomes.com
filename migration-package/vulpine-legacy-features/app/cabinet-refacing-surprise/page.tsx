import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("surprise");
export const dynamic = "force-static";

export default function SurpriseCityPage() {
  return <CityLandingPage cityKey="surprise" />;
}
