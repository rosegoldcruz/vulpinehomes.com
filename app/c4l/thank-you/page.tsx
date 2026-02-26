import { headers } from "next/headers";
import { notFound } from "next/navigation";
import C4LThankYouClient from "./C4LThankYouClient";

const C4L_HOSTS = new Set([
  "cabinets4less.vulpinehomes.com",
  "www.cabinets4less.vulpinehomes.com",
]);

export const runtime = "edge";

export default function C4LThankYouPage() {
  const host = (headers().get("host") || "").toLowerCase().split(":")[0];

  if (!C4L_HOSTS.has(host)) notFound();

  return <C4LThankYouClient />;
}
