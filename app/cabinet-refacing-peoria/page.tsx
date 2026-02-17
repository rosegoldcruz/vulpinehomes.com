import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("peoria");

export default function PeoriaCityPage() {
  return <CityLandingPage cityKey="peoria" />;
}
