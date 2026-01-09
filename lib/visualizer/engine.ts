import { supabaseServer } from "../supabaseServer";
import { refaceCabinetsWithGemini, type DoorStyleId as GeminiDoorStyleId } from "./geminiService";
import sharp from "sharp";

export type DoorStyleId = "slab" | "shaker" | "shaker-slide" | "fusion-shaker" | "fusion-slide";
export type HardwareStyleId = "loft" | "bar" | "arch" | "artisan" | "cottage" | "square";
export type HardwareFinishId = "rose_gold" | "chrome" | "black" | "nickel" | "satinnickel" | "gold" | "bronze";

// Normalize image orientation based on EXIF data to prevent rotation issues
async function normalizeImageOrientation(file: File): Promise<{ buffer: Buffer; contentType: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // sharp.rotate() with no arguments auto-rotates based on EXIF orientation
  // and strips the EXIF orientation tag so the image displays correctly
  const normalized = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF
    .jpeg({ quality: 92 })
    .toBuffer();
  
  return { buffer: normalized, contentType: "image/jpeg" };
}

export type VisualizerInput = {
  file: File;
  userPrompt: string;
  style: string | null;
  color: string | null;
  hardware: string | null;
  hardwareStyle?: string | null;
  hardwareColor?: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  sessionId?: string | null; // Optional: reuse existing session for batch uploads
};

export type VisualizerOutput = {
  originalUrl: string;
  finalUrl: string;
  sessionId: string; // Return session ID for batch processing
  leadId: string; // Return lead ID for reference
};

function humanizeSelection(value: string | null | undefined, fallback: string): string {
  const token = (value || "").trim();
  if (!token) return fallback;
  return token
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Vulpine color definitions with hex and wood grain info
type VulpineColor = { hex: string; name: string; isWoodGrain: boolean };

const VULPINE_COLORS: Record<string, VulpineColor> = {
  "flour": { hex: "#f5f5f0", name: "Flour", isWoodGrain: false },
  "storm": { hex: "#5a6670", name: "Storm", isWoodGrain: false },
  "graphite": { hex: "#3d3d3d", name: "Graphite", isWoodGrain: false },
  "espresso-walnut": { hex: "#3c2415", name: "Espresso Walnut", isWoodGrain: true },
  "slate": { hex: "#708090", name: "Slate", isWoodGrain: false },
  "mist": { hex: "#c8c8c8", name: "Mist", isWoodGrain: false },
  "latte-walnut": { hex: "#a67b5b", name: "Latte Walnut", isWoodGrain: true },
  "nimbus-oak": { hex: "#9e8b7d", name: "Nimbus Oak", isWoodGrain: true },
  "sable-oak": { hex: "#5c4033", name: "Sable Oak", isWoodGrain: true },
  "urban-teak": { hex: "#8b7355", name: "Urban Teak", isWoodGrain: true },
  "platinum-teak": { hex: "#b8a88a", name: "Platinum Teak", isWoodGrain: true },
  "snow-gloss": { hex: "#fffafa", name: "Snow Gloss", isWoodGrain: false },
  "wheat-oak": { hex: "#d4a574", name: "Wheat Oak", isWoodGrain: true },
};

// Get color info from Vulpine color map
function getColorInfo(colorId: string): VulpineColor {
  return VULPINE_COLORS[colorId] || { hex: "#FFFFFF", name: "Flour", isWoodGrain: false };
}

// Legacy function for backward compatibility
function getColorHex(colorId: string): string {
  return getColorInfo(colorId).hex;
}

async function uploadToSupabaseBucket(params: {
  bucket: string;
  path: string;
  data: ArrayBuffer | Buffer;
  contentType: string;
}) {
  const { bucket, path, data, contentType } = params;

  const uploadData = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const { error } = await supabaseServer.storage
    .from(bucket)
    .upload(path, uploadData, {
      contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabaseServer.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

// Gemini-based cabinet refacing using geometry replacement
async function runGeminiRefacing(params: {
  imageBuffer: Buffer;
  style: string | null;
  color: string | null;
  hardwareStyle: string | null;
  hardwareColor: string | null;
}): Promise<string> {
  const { imageBuffer, style, color, hardwareStyle, hardwareColor } = params;
  
  // Map style to Gemini door style ID
  const doorStyleMap: Record<string, GeminiDoorStyleId> = {
    "shaker": "shaker",
    "shaker-slide": "shaker-slide",
    "slab": "slab",
    "fusion-shaker": "fusion-shaker",
    "fusion-slide": "fusion-slide",
  };
  
  const doorStyle = doorStyleMap[style || "shaker"] || "shaker";
  const colorInfo = getColorInfo(color || "flour");
  
  const base64Result = await refaceCabinetsWithGemini(imageBuffer, {
    doorStyle,
    colorName: colorInfo.name,
    colorHex: colorInfo.hex,
    isWoodGrain: colorInfo.isWoodGrain,
    hardwareStyle: hardwareStyle || "Arch",
    hardwareFinish: hardwareColor || "Satin Nickel",
  });
  
  return base64Result;
}

export async function runVisualizerPipeline(
  input: VisualizerInput
): Promise<VisualizerOutput> {
  const {
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
  } = input;

  // Validate required fields
  if (!email || email.trim() === '') {
    throw new Error('Email is required');
  }

  // 1) Normalize image orientation (fix EXIF rotation) and upload to Supabase
  console.log("🔄 Normalizing image orientation...");
  const { buffer: normalizedBuffer, contentType } = await normalizeImageOrientation(file);
  
  const imageId = crypto.randomUUID();
  const originalPath = `${imageId}/original.jpg`;

  const originalUrl = await uploadToSupabaseBucket({
    bucket: "visualizations",
    path: originalPath,
    data: normalizedBuffer,
    contentType,
  });

  // 2) Generate prompt description for record-keeping
  // We use the new AEON Universal Prompt Generator logic to create a descriptive string
  // even though Gemini handles the actual generation logic internally.
  const doorStyleId: DoorStyleId = (style as DoorStyleId) || "shaker";
  const hwStyleId: HardwareStyleId = (hardwareStyle as HardwareStyleId) || "loft";
  const hwFinishId: HardwareFinishId = (hardwareColor?.toLowerCase().replace(/\s+/g, "") as HardwareFinishId) || "satinnickel";
  
  const colorText = humanizeSelection(color, "Classic White");
  const colorHex = getColorHex(color || "classic-white");
  
  // Simple prompt construction for DB record
  const enhanced_prompt = `Reface kitchen cabinets with ${doorStyleId} style in ${colorText} (${colorHex}). Hardware: ${hwStyleId} in ${hwFinishId}. ${userPrompt || ""}`;

  // 3) Single-stage edit with Gemini (geometry replacement)
  console.log("🧠 Running Gemini cabinet refacing...");
  const geminiResultBase64 = await runGeminiRefacing({
    imageBuffer: normalizedBuffer,
    style,
    color,
    hardwareStyle: hardwareStyle || null,
    hardwareColor: hardwareColor || null,
  });
  
  // Upload Gemini result to Supabase
  const geminiBuffer = Buffer.from(
    geminiResultBase64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const finalPath = `${imageId}/final.jpg`;
  const finalUrl = await uploadToSupabaseBucket({
    bucket: "visualizations",
    path: finalPath,
    data: geminiBuffer,
    contentType: "image/jpeg",
  });

  // 4) Database operations: ONE lead per submission
  let leadId: string;
  let currentSessionId: string;

  if (sessionId) {
    // Reusing existing session (batch upload)
    console.log(`♻️ Reusing existing session: ${sessionId}`);
    currentSessionId = sessionId;
    
    // Get lead_id from session
    const { data: session, error: sessionError } = await supabaseServer
      .from("visualizer_sessions")
      .select("lead_id")
      .eq("id", sessionId)
      .single();
    
    if (sessionError || !session) {
      throw new Error("Invalid session ID");
    }
    
    leadId = session.lead_id;
  } else {
    // Create NEW lead (first image in submission)
    console.log("🆕 Creating new lead and session");
    
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
          design_count: 0, // Will be incremented as images are added
          intervention_strength: null,
          custom_instructions: userPrompt,
          original_images: [],
          design_images: [],
          source: "vulpine_visualizer_v1",
        },
      ])
      .select("id")
      .single();

    if (leadError || !lead) {
      console.error("❌ Lead creation failed:", leadError);
      throw new Error("Failed to create lead");
    }

    leadId = lead.id;
    console.log(`✅ Lead created: ${leadId}`);

    // Create session linked to lead
    const { data: session, error: sessionError } = await supabaseServer
      .from("visualizer_sessions")
      .insert([
        {
          lead_id: leadId,
          session_status: "active",
        },
      ])
      .select("id")
      .single();

    if (sessionError || !session) {
      console.error("❌ Session creation failed:", sessionError);
      throw new Error("Failed to create session");
    }

    currentSessionId = session.id;
    console.log(`✅ Session created: ${currentSessionId}`);
  }

  // 5) Insert image into visualizer_images
  const { error: imageError } = await supabaseServer
    .from("visualizer_images")
    .insert([
      {
        session_id: currentSessionId,
        original_url: originalUrl,
        final_url: finalUrl,
        prompt_used: enhanced_prompt,
      },
    ]);

  if (imageError) {
    console.error("❌ Image insert failed:", imageError);
    throw new Error("Failed to save image");
  }

  console.log("✅ Image saved to visualizer_images");

  // 6) Update lead's design_count
  const { error: updateError } = await supabaseServer.rpc(
    'increment_design_count',
    { lead_id: leadId }
  );

  // If RPC doesn't exist, do it manually
  if (updateError) {
    const { data: currentLead } = await supabaseServer
      .from("kitchen_leads")
      .select("design_count")
      .eq("id", leadId)
      .single();
    
    const newCount = (currentLead?.design_count || 0) + 1;
    
    await supabaseServer
      .from("kitchen_leads")
      .update({ design_count: newCount })
      .eq("id", leadId);
  }

  return {
    originalUrl,
    finalUrl,
    sessionId: currentSessionId,
    leadId,
  };
}

