import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import Replicate from "replicate";
import sharp from "sharp";

export const runtime = "nodejs";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// Color definitions
const VULPINE_COLORS: Record<string, { hex: string; name: string }> = {
  "flour": { hex: "#f5f5f0", name: "Flour" },
  "storm": { hex: "#5a6670", name: "Storm" },
  "graphite": { hex: "#3d3d3d", name: "Graphite" },
  "espresso-walnut": { hex: "#3c2415", name: "Espresso Walnut" },
  "slate": { hex: "#708090", name: "Slate" },
  "mist": { hex: "#c8c8c8", name: "Mist" },
  "latte-walnut": { hex: "#a67b5b", name: "Latte Walnut" },
  "nimbus-oak": { hex: "#9e8b7d", name: "Nimbus Oak" },
  "sable-oak": { hex: "#5c4033", name: "Sable Oak" },
  "urban-teak": { hex: "#8b7355", name: "Urban Teak" },
  "platinum-teak": { hex: "#b8a88a", name: "Platinum Teak" },
  "snow-gloss": { hex: "#fffafa", name: "Snow Gloss" },
  "wheat-oak": { hex: "#d4a574", name: "Wheat Oak" },
};

async function normalizeImageOrientation(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const normalized = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF
    .jpeg({ quality: 92 })
    .toBuffer();
  return normalized;
}

async function uploadToSupabase(bucket: string, path: string, data: Buffer, contentType: string) {
  const { error } = await supabaseServer.storage
    .from(bucket)
    .upload(path, data, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabaseServer.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

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

    const name = ((formData.get("name") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim();
    const style = (formData.get("style") as string) || "shaker";
    const color = (formData.get("color") as string) || "flour";
    const hardwareStyle = (formData.get("hardwareStyle") as string) || "loft";
    const hardwareColor = (formData.get("hardwareColor") as string) || "satinnickel";
    const userPrompt = (formData.get("prompt") as string) || "";

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    console.log("🔄 Normalizing image orientation...");
    const normalizedBuffer = await normalizeImageOrientation(file);

    // Upload original to Supabase
    const imageId = crypto.randomUUID();
    const originalPath = `${imageId}/original.jpg`;
    const originalUrl = await uploadToSupabase(
      "visualizations",
      originalPath,
      normalizedBuffer,
      "image/jpeg"
    );

    console.log("✅ Original uploaded:", originalUrl);

    // Convert to base64 for Replicate
    const base64 = normalizedBuffer.toString("base64");
    const dataUri = `data:image/jpeg;base64,${base64}`;

    // Build prompt
    const colorInfo = VULPINE_COLORS[color] || VULPINE_COLORS["flour"];
    const prompt = `Transform these kitchen cabinets to ${style} style in ${colorInfo.name} color with ${hardwareStyle} ${hardwareColor} hardware. Keep everything else unchanged - same walls, floors, countertops, appliances. Only change the cabinet doors and hardware. Photorealistic, high quality, professional interior design.`;

    console.log("🎨 Running Replicate...");

    // Use Replicate model from env or default to stable-diffusion
    const replicateModel = process.env.REPLICATE_MODEL || "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
    
    console.log("📝 Model:", replicateModel);
    console.log("📝 Prompt:", prompt);

    const output = await replicate.run(replicateModel as any, {
      input: {
        image: dataUri,
        prompt: prompt,
        negative_prompt: "blurry, distorted, low quality, cartoon, painting, sketch, unrealistic, deformed",
        num_inference_steps: Number(process.env.REPLICATE_STEPS) || 30,
        guidance_scale: Number(process.env.REPLICATE_GUIDANCE) || 7.5,
      },
    });

    console.log("📤 Replicate output type:", typeof output);
    console.log("📤 Replicate output:", output);

    const replicateUrl = Array.isArray(output) ? output[0] : output;
    console.log("✅ Replicate result URL:", replicateUrl);

    if (!replicateUrl || typeof replicateUrl !== "string") {
      throw new Error("Replicate returned invalid output format");
    }

    // Download and upload to Supabase
    const imageResponse = await fetch(replicateUrl as string);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const finalPath = `${imageId}/final.jpg`;
    const finalUrl = await uploadToSupabase(
      "visualizations",
      finalPath,
      imageBuffer,
      "image/jpeg"
    );

    console.log("✅ Final image uploaded:", finalUrl);

    if (!finalUrl || !originalUrl) {
      throw new Error("Failed to generate image URLs");
    }

    console.log("📦 Preparing response with originalUrl and finalUrl");

    // Save to database
    const { data: lead, error: leadError } = await supabaseServer
      .from("kitchen_leads")
      .insert([
        {
          full_name: name,
          phone,
          email,
          city: null,
          room_type: "kitchen",
          selected_style: style,
          selected_color: color,
          design_count: 1,
          custom_instructions: userPrompt,
          original_images: [originalUrl],
          design_images: [finalUrl],
          source: "vulpine_visualizer_replicate",
        },
      ])
      .select("id")
      .single();

    if (leadError) {
      console.error("⚠️ Lead save failed:", leadError);
    } else {
      console.log("✅ Lead saved:", lead.id);
    }

    return NextResponse.json(
      {
        success: true,
        result: {
          originalUrl,
          finalUrl,
          promptUsed: prompt,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Visualizer error:", err);
    const message = err instanceof Error ? err.message : "Visualization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Replicate-based kitchen visualizer",
  });
}
