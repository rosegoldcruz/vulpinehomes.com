import { redirect } from "next/navigation";

export default function GetQuoteRedirectPage() {
  // Preserve existing primary quote flow while standardizing CTAs on /get-quote
  redirect("/vulpine/kitchen-quote");
}
