import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("buckeye");

export default function BuckeyeCityPage() {
  return <CityLandingPage cityKey="buckeye" />;
}
