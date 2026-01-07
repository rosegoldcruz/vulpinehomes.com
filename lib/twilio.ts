// lib/twilio.ts
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;
const toPhone = process.env.TWILIO_TO_PHONE_NUMBER; // Your business phone

if (!accountSid || !authToken || !fromPhone || !toPhone) {
  console.warn("Twilio environment variables not configured");
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface KitchenSMSParams {
  name: string | null;
  phone: string | null;
  city: string | null;
  doors: number | null;
  drawers: number | null;
  hasIsland: boolean;
  photoCount: number;
  photoUrls?: string[];
  style?: string | null;
  color?: string | null;
  hardware?: string | null;
  source?: string | null;
}

export async function sendKitchenSMS(params: KitchenSMSParams) {
  if (!client || !fromPhone || !toPhone) {
    console.log("Twilio not configured, skipping SMS");
    return;
  }

  const { name, phone, city, doors, drawers, hasIsland, photoCount, photoUrls, style, color, hardware, source } = params;

  // Build photo URLs (support both Supabase relative paths and absolute URLs)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const photoLinks = photoUrls && photoUrls.length > 0
    ? photoUrls.map((p) => {
        const isAbsolute = /^https?:\/\//i.test(p);
        if (isAbsolute) return p;
        if (supabaseUrl) return `${supabaseUrl}/storage/v1/object/public/kitchen-photos/${p}`;
        return p;
      }).join('\n')
    : null;

  const message = `
🏠 NEW KITCHEN LEAD

Source: ${source || "N/A"}

Name: ${name || "N/A"}
Phone: ${phone || "N/A"}
City: ${city || "N/A"}

Style: ${style || "N/A"}
Color: ${color || "N/A"}
Hardware: ${hardware || "N/A"}

Doors: ${doors ?? "N/A"}
Drawers: ${drawers ?? "N/A"}
Island: ${hasIsland ? "Yes" : "No"}
Photos: ${photoCount}

${photoLinks ? `📸 Photos:\n${photoLinks}\n` : ''}
Reply to follow up!
  `.trim();

  try {
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
    });
    console.log("SMS sent successfully");
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
}



interface VisualizerCustomerSMSParams {
  name: string | null;
  phone: string | null;
  style: string | null;
  color: string | null;
  hardware?: string | null;
}

export async function sendVisualizerCustomerSMS(params: VisualizerCustomerSMSParams) {
  if (!client || !fromPhone) {
    console.log("Twilio not configured, skipping customer visualizer SMS");
    return;
  }

  const { name, phone, style, color, hardware } = params;
  if (!phone) {
    console.log("No customer phone provided, skipping visualizer SMS");
    return;
  }

  const firstName = (name || "").split(" ")[0] || "there";
  const hardwareText = hardware ? ` with ${hardware} hardware` : "";

  const message = `Hi ${firstName}! Thanks for trying the Vulpine AI Kitchen Visualizer.

We generated new cabinet designs for you in the style "${style || "custom"}" with color "${color || "your selection"}"${hardwareText}.

A real person from our team will reach out shortly to walk through options and schedule your in-home visit. If you have questions now, you can reply directly to this text.`;

  try {
    await client.messages.create({
      body: message,
      from: fromPhone,
      to: phone,
    });
    console.log("Customer visualizer SMS sent");
  } catch (error) {
    console.error("Failed to send customer visualizer SMS:", error);
  }
}
