// lib/visualizer/engine.ts

import { supabaseServer } from "../supabaseServer";
import { replicate } from "../replicateClient";
import { enhanceCabinetPrompt } from "../promptEnhancer";
import { 
  buildKitchenRefacingPrompt, 
  analyzeKitchenImage,
  type DoorStyleId,
  type HardwareStyleId,
  type HardwareFinishId
} from "./promptGenerator";
import { refaceCabinetsWithGemini, type DoorStyleId as GeminiDoorStyleId } from "./geminiService";
import sharp from "sharp";

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
  maskUrl?: string;
  fluxResultUrl?: string;
  styleResultUrl?: string;
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

// Grounded-SAM segmentation: get cabinet mask
async function runSegmentation(imageUrl: string) {
  const model = process.env.REPLICATE_GROUNDED_SAM_MODEL;
  if (!model) {
    console.warn("⚠️ REPLICATE_GROUNDED_SAM_MODEL not set, skipping segmentation");
    return null;
  }

  try {
    const res = (await replicate.run(
      model as `${string}/${string}` | `${string}/${string}:${string}`,
      {
        input: {
          image: imageUrl,
          text_prompt: "kitchen cabinets",
          box_threshold: 0.3,
          text_threshold: 0.25,
        },
      },
    )) as any;

    const maskUrl: string | undefined = res?.masks?.[0] ?? res?.output?.[0];
    if (!maskUrl) {
      console.warn("⚠️ Grounded-SAM did not return a mask, skipping segmentation");
      return null;
    }
    return maskUrl;
  } catch (err) {
    console.error("⚠️ Segmentation failed, continuing without mask:", err);
    return null;
  }
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

// Legacy nano-banana function kept for fallback
async function runNanoBananaEdit(params: { originalUrl: string; positive: string }) {
  const { originalUrl, positive } = params;

  // We consolidate on a single high-quality image editing model
  const model = "google/nano-banana";

  const input = {
    prompt: positive,
    image_input: [originalUrl],
    output_format: "jpg",
  };

  const output = (await replicate.run(
    model as `${string}/${string}` | `${string}/${string}:${string}`,
    { input },
  )) as any;

  let outUrl: string | undefined;

  if (typeof output === "string") {
    outUrl = output;
  } else if (Array.isArray(output)) {
    const first = output[0];
    if (typeof first === "string") {
      outUrl = first;
    } else if (first && typeof first.url === "function") {
      outUrl = first.url();
    }
  } else if (output && typeof output.url === "function") {
    outUrl = output.url();
  } else if (typeof output?.uri === "string") {
    outUrl = output.uri;
  }

  if (!outUrl) {
    throw new Error("google/nano-banana did not return an image URL");
  }

  return outUrl;
}

// Flux img2img on cabinet mask (or full image if no mask)
async function runFluxCabinetRedesign(params: {
  imageUrl: string;
  maskUrl: string | null;
  positive: string;
  negative: string;
}) {
  const fluxModel = process.env.REPLICATE_FLUX_FILL_MODEL;
  const { imageUrl, maskUrl, positive, negative } = params;

  // Fallback to SDXL if Flux model not set
  const model = fluxModel || "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
  
  try {
    const input: any = {
      image: imageUrl,
      prompt: positive,
      negative_prompt: negative,
      guidance_scale: 7.5,
      num_inference_steps: 30,
      strength: 0.75,
    };

    // Only add mask if we have one
    if (maskUrl) {
      input.mask = maskUrl;
    }

    const res = (await replicate.run(
      model as `${string}/${string}` | `${string}/${string}:${string}`,
      { input },
    )) as any;

    const outUrl: string | undefined = Array.isArray(res) ? res[0] : res?.output?.[0] ?? res;
    if (!outUrl) throw new Error("Image generation did not return a URL");
    return outUrl;
  } catch (err) {
    console.error("⚠️ Flux/SDXL generation failed:", err);
    throw err;
  }
}

// Optional ControlNet style enforcement
async function runControlNetStylePass(params: {
  imageUrl: string;
  positive: string;
  negative: string;
  style: string | null;
}) {
  const model = process.env.REPLICATE_SDXL_CONTROLNET_MODEL;
  if (!model) {
    console.warn("⚠️ REPLICATE_SDXL_CONTROLNET_MODEL not set, skipping ControlNet");
    return params.imageUrl;
  }
  const { imageUrl, positive, negative, style } = params;

  try {
    const loraMap: Record<string, string> = {
      shaker: "Shaker-Cabinets-LoRA",
      modern: "Modern-Kitchen-LoRA",
      coastal: "Coastal-Interior-LoRA",
      traditional: "Traditional-Kitchen-LoRA",
    };

    const styleKey = style?.toLowerCase() ?? "";
    const loraName =
      loraMap[styleKey] ??
      "Shaker-Cabinets-LoRA"; // default to shaker-style if unknown

    const res = (await replicate.run(
      model as `${string}/${string}` | `${string}/${string}:${string}`,
      {
        input: {
          image: imageUrl,
          prompt: positive + `, interior design style: ${style ?? "modern shaker"}`,
          negative_prompt: negative,
          lora: loraName,
          control_mode: "balanced",
          steps: 20,
        },
      },
    )) as any;

    const outUrl: string | undefined = Array.isArray(res) ? res[0] : res?.output?.[0];
    if (!outUrl) {
      console.warn("⚠️ ControlNet did not return an image, using input");
      return imageUrl;
    }
    return outUrl;
  } catch (err) {
    console.error("⚠️ ControlNet failed, using input image:", err);
    return imageUrl;
  }
}

// Optional Instant-ID hook (kept minimal)
async function maybeRunInstantId(params: {
  baseImageUrl: string;
}) {
  const model = process.env.REPLICATE_INSTANT_ID_MODEL;
  if (!model) return params.baseImageUrl;

  const res = (await replicate.run(
    model as `${string}/${string}` | `${string}/${string}:${string}`,
    {
      input: {
        image: params.baseImageUrl,
      },
    },
  )) as any;

  const outUrl: string | undefined = Array.isArray(res) ? res[0] : res?.output?.[0];
  return outUrl ?? params.baseImageUrl;
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

  // 2) AEON Universal Prompt Generator
  // Analyze the kitchen image for intelligent prompt generation
  const useAeonPromptGenerator = process.env.USE_AEON_PROMPT_GENERATOR !== "false";
  
  let enhanced_prompt: string;
  
  if (useAeonPromptGenerator) {
    // Use the new AEON Universal Prompt Generator
    const analysis = await analyzeKitchenImage(originalUrl);
    
    // Map style strings to DoorStyleId
    const doorStyleId: DoorStyleId = (style as DoorStyleId) || "shaker";
    const hwStyleId: HardwareStyleId = (hardwareStyle as HardwareStyleId) || "loft";
    const hwFinishId: HardwareFinishId = (hardwareColor?.toLowerCase().replace(/\s+/g, "") as HardwareFinishId) || "satinnickel";
    
    // Get color info
    const colorText = humanizeSelection(color, "Classic White");
    const colorHex = getColorHex(color || "classic-white");
    
    enhanced_prompt = buildKitchenRefacingPrompt({
      imageDescription: analysis.imageDescription,
      doorStyle: doorStyleId,
      colorHex,
      colorName: colorText,
      hardwareStyle: hwStyleId,
      hardwareFinish: hwFinishId,
      drawersMissing: analysis.drawersMissing,
      isAngledPhoto: analysis.isAngledPhoto,
      hasArchedDoors: analysis.hasArchedDoors,
      lighting: analysis.lighting,
      needsCleanup: analysis.needsCleanup,
      warpedPerspective: analysis.warpedPerspective,
    });
    
    console.log("🦊 AEON Prompt Generated with analysis:", {
      drawersMissing: analysis.drawersMissing,
      isAngledPhoto: analysis.isAngledPhoto,
      hasArchedDoors: analysis.hasArchedDoors,
      lighting: analysis.lighting,
    });
  } else {
    // Fallback to legacy prompt enhancement
    const doorStyleMap: Record<string, string> = {
      "shaker": "Shaker Classic cabinet doors",
      "shaker-slide": "Shaker Slide cabinet doors",
      "slab": "Slab flat-panel cabinet doors",
      "fusion-shaker": "Fusion Shaker cabinet doors",
      "fusion-slide": "Fusion Slide cabinet doors",
    };

    const styleText =
      (style && doorStyleMap[style]) ||
      humanizeSelection(style, "Shaker Classic cabinet doors");
    const colorText = humanizeSelection(color, "Classic White");
    const hardwareSelectionRaw =
      (hardware && hardware.trim()) ||
      [hardwareColor, hardwareStyle].filter(Boolean).join(" ");
    const hardwareText = humanizeSelection(
      hardwareSelectionRaw || null,
      "Satin Nickel",
    );

    const basePrompt =
      `Replace all existing kitchen cabinet doors and drawer fronts with new ${colorText} ${styleText}, and install ${hardwareText} knobs and pulls on every door and drawer. ` +
      "Keep the cabinet boxes, countertops, appliances, backsplash, flooring, walls, windows, lighting, and layout unchanged.";

    const mergedUserPrompt =
      userPrompt && userPrompt.trim().length > 0
        ? `${basePrompt} ${userPrompt.trim()}`
        : basePrompt;

    const result = await enhanceCabinetPrompt({
      userPrompt: mergedUserPrompt,
      style: styleText,
      color: colorText,
      hardware: hardwareText,
    });
    enhanced_prompt = result.enhanced_prompt;
  }

  // 3) Single-stage edit with Gemini (geometry replacement)
  console.log("🧠 Running Gemini cabinet refacing...");
  const geminiResultBase64 = await runGeminiRefacing({
    imageBuffer: normalizedBuffer,
    style,
    color,
    hardwareStyle,
    hardwareColor,
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

