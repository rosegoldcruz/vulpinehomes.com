import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate with your API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// Cabinet style configurations
const STYLE_PROMPTS: Record<string, string> = {
  shaker: "classic shaker style cabinet doors with recessed center panel, clean lines",
  fusion: "modern fusion cabinet doors with slab drawer fronts and 5-piece door fronts",
  slab: "minimalist flat slab cabinet doors with no raised panels, contemporary style",
  slide: "enhanced shaker style cabinet doors with decorative molding details",
};

// Color configurations
const COLOR_PROMPTS: Record<string, string> = {
  graphite: "dark graphite gray cabinets, matte finish",
  slate: "medium slate blue-gray cabinets",
  storm: "storm gray cabinets with subtle blue undertones",
  mist: "light misty gray cabinets, almost white",
  "espresso-walnut": "rich espresso walnut wood grain cabinets",
  flour: "off-white flour colored cabinets",
  "nimbus-oak": "nimbus oak wood grain cabinets with natural texture",
  "paint-ready": "primed white cabinets ready for painting",
  "latte-walnut": "warm latte walnut wood cabinets",
  "urban-teak": "urban teak wood cabinets with modern finish",
  "platinum-teak": "platinum teak cabinets with gray wood grain",
};

// Normalize Replicate output to a URL/string when possible
function normalizeReplicateOutput(o: any): string {
  if (!o) return "";
  if (typeof o === "string") return o;
  if (Array.isArray(o) && o.length) return normalizeReplicateOutput(o[0]);
  if (typeof o === "object") {
    const maybe = (o as any);
    if (typeof maybe.url === "function") return maybe.url();
    if (typeof maybe.url === "string") return maybe.url;
    if ("output" in maybe) return normalizeReplicateOutput(maybe.output);
  }
  return "";
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const style = formData.get("style") as string;
    const color = formData.get("color") as string;
    const styleText = STYLE_PROMPTS[style] ?? STYLE_PROMPTS["shaker"];
    const colorText = COLOR_PROMPTS[color] ?? COLOR_PROMPTS["paint-ready"] ?? "white cabinets";

    // Collect all uploaded images
    const images: string[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("image_") && typeof value === "string") {
        images.push(value);
      }
    });

    if (images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    // Process each image through AI



    const visualizations = await Promise.all(
      images.map(async (imageBase64) => {
        try {
          // Use RoomDream or ControlNet for interior redesign
          const output = await replicate.run(
            "adirik/roomdream:77dcbd891cf77b1c1d69e01761242a9400797a7fdc95bf258cf925550f0e0e36",
            {
              input: {
                image: imageBase64,
                design_style: "modern",
                room_type: "kitchen",
                prompt: `Kitchen with ${styleText} in ${colorText}, professional cabinet refacing, maintain exact room layout and structure, only change cabinet doors and colors, keep same countertops and appliances, photorealistic rendering`
              }
            }
          );

          const outputUrl = normalizeReplicateOutput(output as any);


          // Fallback to interior-gpt if roomdream fails
          if (!outputUrl) {
            const fallbackRaw = await replicate.run(
              "zsxkib/interior-ai-design:47905d96b6e7a44ad734cc10c7669ed8f44e4ad731ac96f3e264bfb4c510b1f7",
              {
                input: {
                  image: imageBase64,
                  prompt: `Reface kitchen cabinets with ${styleText} doors in ${colorText} color`,
                  guidance_scale: 7,
                  num_inference_steps: 50
                }
              }
            );
            const fallbackUrl = normalizeReplicateOutput(fallbackRaw as any);
            return {
              original: imageBase64,
              transformed: fallbackUrl || imageBase64,
              styleApplied: style,
              colorApplied: color
            };
          }

          return {
            original: imageBase64,
            transformed: outputUrl || imageBase64,
            styleApplied: style,
            colorApplied: color
          };
        } catch (error) {
          console.error("Error processing individual image:", error);
          // Return original if processing fails
          return {
            original: imageBase64,
            transformed: imageBase64,
            styleApplied: style,
            colorApplied: color,
            error: true
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      visualizations,
      style,
      color
    });

  } catch (error) {
    console.error("Visualization API error:", error);
    return NextResponse.json(
      { error: "Failed to process visualization" },
      { status: 500 }
    );
  }
}

// Alternative implementation using OpenAI DALL-E for visualization
export async function generateWithDallE(req: NextRequest) {
  try {
    const formData = await req.formData();
    const style = formData.get("style") as string;
    const color = formData.get("color") as string;

    const styleText = STYLE_PROMPTS[style] ?? STYLE_PROMPTS["shaker"];
    const colorText = COLOR_PROMPTS[color] ?? COLOR_PROMPTS["paint-ready"] ?? "white cabinets";
    // For DALL-E, we would need to describe the kitchen and generate new images
    const prompt = `Professional kitchen interior with ${styleText} cabinet doors in ${colorText} color, modern appliances, granite countertops, pendant lighting, photorealistic, interior design photography`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024",
        quality: "hd",
        style: "natural"
      })
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      image: data.data[0].url
    });

  } catch (error) {
    console.error("DALL-E generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate visualization" },
      { status: 500 }
    );
  }
}