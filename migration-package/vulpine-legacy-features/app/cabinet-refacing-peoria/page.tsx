import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("peoria");
export const dynamic = "force-static";

export default function PeoriaCityPage() {
  return <CityLandingPage cityKey="peoria" />;
}
