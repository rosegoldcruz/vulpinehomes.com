// app/api/vulpine-visualizer/route.ts

import { NextRequest, NextResponse } from "next/server";
import { runVisualizerPipeline } from "@/lib/visualizer/engine";
import { sendLeadTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs"; // we’re using Node features, not edge

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const userPrompt = (formData.get("prompt") as string) || "";
    const style = (formData.get("style") as string) || null;
    const color = (formData.get("color") as string) || null;
    const hardwareStyle = (formData.get("hardwareStyle") as string) || null;
    const hardwareColor = (formData.get("hardwareColor") as string) || null;
    const hardwareRaw = (formData.get("hardware") as string) || "";
    const hardware =
      hardwareRaw ||
      [hardwareStyle, hardwareColor].filter(Boolean).join(" ") ||
      null;
    const name = ((formData.get("name") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim();
    const sessionId = ((formData.get("sessionId") as string) || "").trim() || null;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required to run the visualizer" },
        { status: 400 },
      );
    }

    const result = await runVisualizerPipeline({
      file,
      userPrompt,
      style,
      color,
      hardware,
      hardwareStyle,
      hardwareColor,
      name,
      phone,
      email,
      sessionId,
    });

    // Check if we should skip Telegram (for batch processing)
    const skipTelegram = formData.get("skipTelegram") === "true";

    // Fire-and-forget Telegram lead notification with before/after images
    if (!skipTelegram) {
      try {
        await sendLeadTelegramMessage({
          name,
          phone,
          city: null,
          doors: null,
          drawers: null,
          hasIsland: false,
          photoCount: 1,
          originalUrls: [result.originalUrl],
          afterUrls: [result.finalUrl],
          style,
          color,
          hardware,
          source: "vulpine_visualizer_v1",
        });
      } catch (err) {
        console.error("⚠️ Telegram notification failed (non-critical):", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Visualizer error:", err);
    const message = err instanceof Error ? err.message : "Visualizer failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Vulpine / AEON Hybrid v1 visualizer API",
  });
}

