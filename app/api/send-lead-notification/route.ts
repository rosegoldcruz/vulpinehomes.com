// app/api/send-lead-notification/route.ts
// Endpoint to send a single Telegram notification with all images from a batch

import { NextRequest, NextResponse } from "next/server";
import { sendLeadTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      name,
      phone,
      style,
      color,
      hardware,
      originalUrls,
      afterUrls,
      source = "vulpine_visualizer_batch",
    } = body;

    // Input validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Valid name is required" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedPhone = phone.trim().slice(0, 20);

    await sendLeadTelegramMessage({
      name: sanitizedName,
      phone: sanitizedPhone,
      city: null,
      doors: null,
      drawers: null,
      hasIsland: false,
      photoCount: afterUrls?.length || originalUrls?.length || 0,
      originalUrls,
      afterUrls,
      style,
      color,
      hardware,
      source,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send lead notification:", err);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
