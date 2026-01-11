// lib/visualizer/geminiService.ts
// Gemini 2.5 Flash-based cabinet refacing service

import { GoogleGenerativeAI } from "@google/generative-ai";

export type DoorStyleId = "shaker" | "shaker-slide" | "slab" | "fusion-shaker" | "fusion-slide";

export interface RefacingSelections {
  doorStyle: DoorStyleId;
  colorName: string;
  colorHex: string;
  isWoodGrain: boolean;
  hardwareStyle: string;
  hardwareFinish: string;
}

function getGeometrySpecs(doorStyle: DoorStyleId): string {
  switch (doorStyle) {
    case "shaker":
      return `
      IF DOOR_STYLE = SHAKER CLASSIC:
      - Outer frame thickness: 3/4"
      - Frame edges: sharp 90-degree square
      - Center panel: flat, recessed 1/4"
      - No bevels
      - No raised molding
      - Visible internal shadow where panel recess meets frame
      `;
    case "shaker-slide":
      return `
      IF DOOR_STYLE = SHAKER SLIDE:
      - Slim frame construction
      - Frame width ratio: 0.12
      - Flat center panel recessed 0.15 depth units
      - Inner edge: micro-bevel only
      - Modern minimalist geometry
      `;
    case "fusion-shaker":
      return `
      IF DOOR_STYLE = FUSION SHAKER:
      - Hybrid topology: SLAB drawer front (flat plane) above SHAKER door.
      - Door: Outer frame 3/4", flat recessed center panel.
      - Drawer: Single flat plane, no recess.
      - Original geometry must be eliminated.
      `;
    case "fusion-slide":
      return `
      IF DOOR_STYLE = FUSION SLIDE:
      - Hybrid topology: SLAB drawer front (flat plane) above SLIDE door.
      - Door: Slim frame (0.12 ratio), micro-bevel edge.
      - Drawer: Single flat plane, no recess.
      - Original geometry must be eliminated.
      `;
    case "slab":
      return `
      IF DOOR_STYLE = SLAB:
      - Single flat plane
      - Thickness: 3/4"
      - No recessed panels
      - No raised panels
      - No interior molding
      - Completely erase all original door geometry
      `;
    default:
      return "";
  }
}

function buildRefacingPrompt(selections: RefacingSelections): string {
  const geometrySpecs = getGeometrySpecs(selections.doorStyle);
  
  const finishType = selections.isWoodGrain ? "Wood Grain" : "Matte";
  const doorStyleLabel = selections.doorStyle
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return `
    TASK: KITCHEN CABINET REFACING VISUALIZER (GEOMETRY REPLACEMENT)
    THIS IS NOT STYLE TRANSFER. THIS IS GEOMETRY REPLACEMENT.

    CORE FAILURE TO AVOID:
    You are forbidden from recoloring, repainting, wrapping, or tracing existing cabinet door geometry.
    The original door faces, bevels, raised panels, and interior molding lines are INVALID DATA.
    If you preserve original door contours, the output is WRONG.

    INPUT SPECIFICATIONS:
    - TARGET DOOR STYLE: ${doorStyleLabel}
    - FINISH: ${selections.colorName} (${finishType}, Hex: ${selections.colorHex})
    - HARDWARE: ${selections.hardwareStyle} (${selections.hardwareFinish})

    GEOMETRY ENFORCEMENT PROTOCOL (MANDATORY):
    1. DESTRUCTIVE INPAINTING: Cabinet doors and drawers are treated as replaceable geometry zones. All pixels inside detected cabinet door and drawer boundaries must be discarded and rebuilt.
    2. MASKING LOGIC: Generate masks for cabinet doors and drawers. Preserve cabinet boxes, countertops, appliances, walls, lighting, and perspective. Door masks must slightly over-expand past interior molding to erase old geometry completely.
    3. GEOMETRY IS AUTHORITATIVE: Rebuild cabinet doors as new 3D geometry using explicit structural rules below. Geometry overrides the original image.
    4. SHADOW & DEPTH REQUIREMENTS: Use strong ambient occlusion in recesses. Render architectural shadow lines where planes step in or out. Depth must be visible through shadow, not color.

    DOOR GEOMETRY LIBRARY (AUTHORITATIVE):
    ${geometrySpecs}

    PERSPECTIVE & ALIGNMENT:
    - Align rebuilt door geometry to scene vanishing points.
    - Maintain correct scale relative to cabinet boxes.
    - Geometry must read as physically constructed wood, not a texture overlay.

    OUTPUT GOAL:
    The final image must look like:
    - Original doors were removed
    - New doors were fabricated and installed
    - Geometry reads as real carpentry with depth and shadow
    
    NOT:
    - Painted cabinets
    - Vinyl wrap
    - Texture swap
    - Sticker effect

    FAILURE CONDITION:
    If original raised-panel lines are still visible, the render is invalid.
  `;
}

export async function refaceCabinetsWithGemini(
  imageBuffer: Buffer,
  selections: RefacingSelections
): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = buildRefacingPrompt(selections);
  const base64Image = imageBuffer.toString("base64");

  try {
    // Use generateContent with proper configuration for API key auth
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts || [];

    // Look for inline image data in response
    for (const part of parts) {
      if ("inlineData" in part && part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || "image/png";
        return `data:${mimeType};base64,${imageData}`;
      }
    }

    throw new Error("Gemini did not return an image in the response");
  } catch (error) {
    console.error("Gemini AI Service Error:", error);
    throw error;
  }
}
