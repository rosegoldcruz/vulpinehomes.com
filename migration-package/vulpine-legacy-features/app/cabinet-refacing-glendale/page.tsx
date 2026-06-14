import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("glendale");
export const dynamic = "force-static";

export default function GlendaleCityPage() {
  return <CityLandingPage cityKey="glendale" />;
}
