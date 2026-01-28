// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\get-quote\page.tsx
import { redirect } from "next/navigation";

export default function GetQuoteRedirectPage() {
  // Preserve existing primary quote flow while standardizing CTAs on /get-quote
  redirect("/vulpine/kitchen-quote");
}
