import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("glendale");

export default function GlendaleCityPage() {
  return <CityLandingPage cityKey="glendale" />;
}
