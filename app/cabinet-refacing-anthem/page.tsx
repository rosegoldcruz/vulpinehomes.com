import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("anthem");

export default function AnthemCityPage() {
  return <CityLandingPage cityKey="anthem" />;
}
