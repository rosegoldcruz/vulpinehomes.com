import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

// GoHighLevel webhook endpoint
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL!;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract form data
    const leadData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || null,
      city: formData.get("city") as string,
      doors: formData.get("doors") as string || null,
      drawers: formData.get("drawers") as string || null,
      notes: formData.get("notes") as string || null,
      selectedStyle: formData.get("selectedStyle") as string || null,
      selectedColor: formData.get("selectedColor") as string || null,
      source: "vulpine_visualizer",
      created_at: new Date().toISOString()
    };

    // Collect visualization images
    const visualizations: string[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("visualization_") && typeof value === "string") {
        visualizations.push(value);
      }
    });

    // 1. Save to Supabase
    const { data: lead, error: dbError } = await supabase
      .from("kitchen_leads")
      .insert([leadData])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // 2. Save visualization images to Supabase Storage
    if (lead && visualizations.length > 0) {
      for (let i = 0; i < visualizations.length; i++) {
        const base64Data = visualizations[i].split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        
        const { error: uploadError } = await supabase.storage
          .from("visualizations")
          .upload(`${lead.id}/visualization_${i}.png`, buffer, {
            contentType: "image/png",
            upsert: true
          });

        if (uploadError) {
          console.error("Image upload error:", uploadError);
        }
      }
    }

    // 3. Send to GoHighLevel CRM
    try {
      const ghlPayload = {
        first_name: leadData.name.split(" ")[0],
        last_name: leadData.name.split(" ").slice(1).join(" ") || "",
        phone: leadData.phone,
        email: leadData.email,
        city: leadData.city,
        customFields: {
          doors_count: leadData.doors,
          drawers_count: leadData.drawers,
          cabinet_style: leadData.selectedStyle,
          cabinet_color: leadData.selectedColor,
          notes: leadData.notes,
          lead_source: "AI Kitchen Visualizer"
        },
        tags: ["visualizer_lead", "hot_lead", leadData.city.toLowerCase()]
      };

      const ghlResponse = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload)
      });

      if (!ghlResponse.ok) {
        console.error("GoHighLevel webhook failed");
      }
    } catch (ghlError) {
      console.error("GHL integration error:", ghlError);
    }

    // 4. Send SMS notification to sales team
    try {
      const message = await twilioClient.messages.create({
        body: `🔥 NEW HOT LEAD from AI Visualizer!\n\n${leadData.name}\n📱 ${leadData.phone}\n📍 ${leadData.city}\n🚪 ${leadData.doors || "?"} doors, ${leadData.drawers || "?"} drawers\nStyle: ${leadData.selectedStyle}\nColor: ${leadData.selectedColor}\n\nNotes: ${leadData.notes || "None"}\n\nCALL NOW - They just saw their dream kitchen!`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.SALES_TEAM_PHONE!
      });

      console.log("SMS sent:", message.sid);
    } catch (smsError) {
      console.error("SMS notification error:", smsError);
    }

    // 5. Send automated SMS to customer
    try {
      const customerMessage = await twilioClient.messages.create({
        body: `Hi ${leadData.name.split(" ")[0]}! 🦊 Thanks for using our AI Kitchen Visualizer! I'm Daniel from Vulpine/RefaceKit. I saw your beautiful kitchen transformation - those ${leadData.selectedStyle} doors in ${leadData.selectedColor} look amazing!\n\nI'll call you within 24 hours to discuss your free quote and schedule an in-home consultation.\n\nMeanwhile, save 10% by mentioning code "VISUALIZER10" when we speak!\n\nQuestions? Text me back anytime.\n\n- Daniel, RefaceKit`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: leadData.phone
      });

      console.log("Customer SMS sent:", customerMessage.sid);
    } catch (customerSmsError) {
      console.error("Customer SMS error:", customerSmsError);
    }

    // 6. Send email notification (optional)
    if (leadData.email) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Vulpine Kitchen <quotes@vulpinehomes.com>",
            to: leadData.email,
            subject: "Your Kitchen Transformation Looks Amazing! 🦊",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #10b981;">Your Dream Kitchen Awaits!</h1>
                <p>Hi ${leadData.name.split(" ")[0]},</p>
                <p>Thank you for using our AI Kitchen Visualizer! We're excited about transforming your kitchen with our ${leadData.selectedStyle} style doors in ${leadData.selectedColor}.</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #1f2937;">What Happens Next?</h2>
                  <ol style="color: #4b5563;">
                    <li>We'll call you within 24 hours to discuss your project</li>
                    <li>Schedule a free in-home consultation at your convenience</li>
                    <li>Show you real door samples and finalize measurements</li>
                    <li>Provide a detailed quote with no obligation</li>
                  </ol>
                </div>
                
                <p><strong>Special Offer:</strong> Mention code "VISUALIZER10" for 10% off your project!</p>
                
                <div style="background: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <p style="margin: 0; font-size: 18px;"><strong>Call Now for Faster Service</strong></p>
                  <p style="margin: 10px 0 0 0; font-size: 24px;">📞 (480) 555-0123</p>
                </div>
                
                <p>Best regards,<br>
                Daniel Cruz<br>
                RefaceKit / Vulpine Homes<br>
                <a href="https://vulpinehomes.com">vulpinehomes.com</a></p>
              </div>
            `
          })
        });

        if (!emailResponse.ok) {
          console.error("Email send failed");
        }
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
      leadId: lead?.id
    });

  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { error: "Failed to process lead" },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "Vulpine Lead Capture API",
    version: "1.0.0",
    endpoints: {
      POST: "Submit lead data with visualizations"
    }
  });
}