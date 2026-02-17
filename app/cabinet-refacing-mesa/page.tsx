import { getCityMetadata } from "@/app/cabinet-refacing-city-data";
import CityLandingPage from "@/app/components/city/CityLandingPage";

export const metadata = getCityMetadata("mesa");
export const dynamic = "force-static";

export default function MesaCityPage() {
  return <CityLandingPage cityKey="mesa" />;
}
