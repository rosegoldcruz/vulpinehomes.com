import { GoogleGenAI } from "@google/genai";
import { UserSelections, DoorStyle } from "../types";

export const refaceCabinets = async (
  originalImageBase64: string,
  selections: UserSelections
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const cleanBase64 = originalImageBase64.split(',')[1] || originalImageBase64;

  let geometrySpecs = "";
  
  switch (selections.doorStyle) {
    case DoorStyle.SHAKER_CLASSIC:
      geometrySpecs = `
      IF DOOR_STYLE = SHAKER:
      - Outer frame thickness: 3/4"
      - Frame edges: sharp 90-degree square
      - Center panel: flat, recessed 1/4"
      - No bevels
      - No raised molding
      - Visible internal shadow where panel recess meets frame
      `;
      break;
    case DoorStyle.SHAKER_SLIDE:
      geometrySpecs = `
      IF DOOR_STYLE = SLIDE:
      - Slim frame construction
      - Frame width ratio: 0.12
      - Flat center panel recessed 0.15 depth units
      - Inner edge: micro-bevel only
      - Modern minimalist geometry
      `;
      break;
    case DoorStyle.FUSION_SHAKER:
      geometrySpecs = `
      IF DOOR_STYLE = FUSION (Shaker Variant):
      - Hybrid topology: SLAB drawer front (flat plane) above SHAKER door.
      - Door: Outer frame 3/4", flat recessed center panel.
      - Drawer: Single flat plane, no recess.
      - Original geometry must be eliminated.
      `;
      break;
    case DoorStyle.FUSION_SLIDE:
      geometrySpecs = `
      IF DOOR_STYLE = FUSION (Slide Variant):
      - Hybrid topology: SLAB drawer front (flat plane) above SLIDE door.
      - Door: Slim frame (0.12 ratio), micro-bevel edge.
      - Drawer: Single flat plane, no recess.
      - Original geometry must be eliminated.
      `;
      break;
    case DoorStyle.SLAB:
      geometrySpecs = `
      IF DOOR_STYLE = SLAB:
      - Single flat plane
      - Thickness: 3/4"
      - No recessed panels
      - No raised panels
      - No interior molding
      - Completely erase all original door geometry
      `;
      break;
  }

  const prompt = `
    TASK: KITCHEN CABINET REFACING VISUALIZER (GEOMETRY REPLACEMENT)
    THIS IS NOT STYLE TRANSFER. THIS IS GEOMETRY REPLACEMENT.

    CORE FAILURE TO AVOID:
    You are forbidden from recoloring, repainting, wrapping, or tracing existing cabinet door geometry.
    The original door faces, bevels, raised panels, and interior molding lines are INVALID DATA.
    If you preserve original door contours, the output is WRONG.

    INPUT SPECIFICATIONS:
    - TARGET DOOR STYLE: ${selections.doorStyle}
    - FINISH: ${selections.finish.name} (${selections.finish.type}, Hex: ${selections.finish.hex})
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
    });

    let imageUrl = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) throw new Error("Visualization failed.");
    return imageUrl;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};