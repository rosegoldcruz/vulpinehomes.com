import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("goodyear");
export const dynamic = "force-static";

export default function GoodyearCityPage() {
  return <CityLandingPage cityKey="goodyear" />;
}
