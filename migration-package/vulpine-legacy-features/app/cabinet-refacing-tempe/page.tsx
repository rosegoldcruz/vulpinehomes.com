import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("tempe");
export const dynamic = "force-static";

export default function TempeCityPage() {
  return <CityLandingPage cityKey="tempe" />;
}
