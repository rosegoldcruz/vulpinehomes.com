import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("chandler");

export default function ChandlerCityPage() {
  return <CityLandingPage cityKey="chandler" />;
}
