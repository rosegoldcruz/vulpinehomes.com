import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("tempe");

export default function TempeCityPage() {
  return <CityLandingPage cityKey="tempe" />;
}
