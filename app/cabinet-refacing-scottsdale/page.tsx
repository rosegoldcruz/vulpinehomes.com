import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("scottsdale");
export const dynamic = "force-static";

export default function ScottsdaleCityPage() {
  return <CityLandingPage cityKey="scottsdale" />;
}
