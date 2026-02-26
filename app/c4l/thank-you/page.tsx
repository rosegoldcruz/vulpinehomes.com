import { headers } from "next/headers";
import { notFound } from "next/navigation";
import C4LThankYouClient from "./C4LThankYouClient";

const C4L_HOST = "cabinets4less.vulpinehomes.com";

export const dynamic = "force-dynamic";

export default function C4LThankYouPage() {
  const host = (headers().get("host") || "").toLowerCase().split(":")[0];

  if (!host.startsWith(C4L_HOST)) {
    notFound();
  }

  return <C4LThankYouClient />;
}

