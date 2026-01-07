// lib/visualizer/promptGenerator.ts
// AEON Universal Prompt Generator - TypeScript Version
// Dynamically builds Nano-Banana-compatible prompts based on kitchen analysis

export type DoorStyleId = "slab" | "shaker" | "shaker-slide" | "fusion-shaker" | "fusion-slide";
export type HardwareStyleId = "loft" | "bar" | "arch" | "artisan" | "cottage" | "square";
export type HardwareFinishId = "rose_gold" | "chrome" | "black" | "nickel" | "satinnickel" | "gold" | "bronze";
export type LightingType = "warm" | "cool" | "neutral";

export interface KitchenAnalysis {
  imageDescription: string;       // From vision/caption model
  drawersMissing: boolean;        // Detected missing drawer fronts
  isAngledPhoto: boolean;         // Camera angle detection
  hasArchedDoors: boolean;        // Arched/raised panel detection
  lighting: LightingType;         // Lighting warmth
  needsCleanup: boolean;          // Noise/debris detection
  warpedPerspective: boolean;     // Lens distortion detection
}

export interface PromptGeneratorOptions {
  // From kitchen analysis
  imageDescription: string;
  drawersMissing?: boolean;
  isAngledPhoto?: boolean;
  hasArchedDoors?: boolean;
  lighting?: LightingType;
  needsCleanup?: boolean;
  warpedPerspective?: boolean;
  
  // User selections
  doorStyle: DoorStyleId;
  colorHex: string;
  colorName: string;
  hardwareStyle: HardwareStyleId;
  hardwareFinish: HardwareFinishId;
}

// Door geometry instructions - what Nano-Banana understands
// IMPORTANT: Shaker Classic and Shaker Slide have PATTERNED drawer fronts (recessed panels)
// All other styles (Slab, Fusion Shaker, Fusion Slide) have FLAT/SMOOTH drawer fronts
const DOOR_GEOMETRY: Record<DoorStyleId, string> = {
  "slab": "Remove all interior lines and make each door AND drawer front a completely flat smooth rectangle with no panels, grooves, or decorative elements. Drawers must be completely flat with no pattern.",
  "shaker": "Erase all existing lines. On each DOOR draw a recessed rectangular center panel with even borders. On each DRAWER FRONT draw a matching shorter horizontal recessed panel pattern. Both doors AND drawers must have the recessed shaker pattern.",
  "shaker-slide": "Erase all existing lines. On each DOOR draw a recessed center panel with clean horizontal lines. On each DRAWER FRONT draw a matching recessed panel with subtle horizontal banding. Both doors AND drawers must have the recessed pattern.",
  "fusion-shaker": "Erase all existing lines. On each DOOR draw a recessed center panel with a thin modern frame. On each DRAWER FRONT make it completely flat and smooth with NO pattern - just a clean rectangle.",
  "fusion-slide": "Erase existing panel lines. On each DOOR draw a clean rectangular recessed center panel with crisp edges. On each DRAWER FRONT make it completely flat and smooth with NO pattern - just a clean rectangle."
};

// Hardware geometry instructions - MUST specify both doors AND drawers
const HARDWARE_GEOMETRY: Record<HardwareStyleId, string> = {
  "loft": "Add a straight bar pull with squared posts. Place vertically on ALL doors and horizontally centered on ALL drawers.",
  "bar": "Add a cylindrical bar handle with rounded posts. Place vertically on ALL doors and horizontally centered on ALL drawers.",
  "arch": "Add a soft curved arch handle with small circular posts. Place on ALL doors and horizontally centered on ALL drawers.",
  "artisan": "Add an artisan-style handle with decorative detailing. Place on ALL doors and horizontally centered on ALL drawers.",
  "cottage": "Add a cottage-style knob or pull with classic rounded design. Place on ALL doors and horizontally centered on ALL drawers.",
  "square": "Add a square modern pull with clean geometric lines. Place on ALL doors and horizontally centered on ALL drawers."
};

// Hardware finish instructions
const HARDWARE_FINISH: Record<HardwareFinishId, string> = {
  "rose_gold": "Apply a warm rose gold metallic finish with subtle pink undertones.",
  "chrome": "Apply a polished chrome reflective metallic finish.",
  "black": "Apply a matte black non-reflective finish.",
  "nickel": "Apply a satin nickel brushed finish.",
  "satinnickel": "Apply a satin nickel brushed finish with soft sheen.",
  "gold": "Apply a polished gold metallic finish.",
  "bronze": "Apply an oil-rubbed bronze finish with warm undertones."
};

/**
 * AEON Universal Prompt Generator
 * Builds a complete chain-of-command prompt for Nano-Banana
 */
export function buildKitchenRefacingPrompt(options: PromptGeneratorOptions): string {
  const {
    imageDescription,
    doorStyle,
    colorHex,
    colorName,
    hardwareStyle,
    hardwareFinish,
    drawersMissing = false,
    isAngledPhoto = false,
    hasArchedDoors = false,
    lighting = "neutral",
    needsCleanup = false,
    warpedPerspective = false
  } = options;

  const doorGeometry = DOOR_GEOMETRY[doorStyle] || DOOR_GEOMETRY["shaker"];
  const hardwareGeometry = HARDWARE_GEOMETRY[hardwareStyle] || HARDWARE_GEOMETRY["bar"];
  const hardwareColor = HARDWARE_FINISH[hardwareFinish] || HARDWARE_FINISH["nickel"];

  // Build the mega-instruction prompt
  const prompt = `
LOOK AT THE IMAGE AND FOLLOW THESE ACTIONS EXACTLY:

1. ANALYZE STRUCTURE
- Identify all cabinets, doors, drawers, openings, and hardware in the image.
- Preserve countertops, walls, appliances, windows, lighting, and flooring.
- Do NOT modify anything except cabinets, drawers, and hardware.

2. RECONSTRUCT MISSING DRAWER FRONTS
- CRITICAL: If ANY drawer openings are visible without fronts, you MUST add new drawer fronts.
- Draw new drawer fronts as solid rectangles that completely cover any open drawer cavities.
- Match the size, shape, and alignment of surrounding cabinet elements.
${drawersMissing 
  ? "DETECTED: Missing drawer fronts in this image. Add complete drawer fronts to all open drawer spaces."
  : "Verify all drawers have fronts. If any are missing, add them."}

3. ERASE OLD STYLES
${hasArchedDoors
  ? "Remove all arched or raised panel shapes. Flatten them completely before drawing the new style."
  : "Remove all existing panel lines, bevels, grooves, and decorative shapes to prepare for the new style."}

4. DRAW NEW DOOR STYLE
${doorGeometry}

5. APPLY NEW COLOR
Recolor all cabinet surfaces to ${colorName} (${colorHex}) with a smooth satin finish.
Do not change shadows or reflections on surrounding objects.

6. REMOVE OLD HARDWARE AND ADD NEW
- CRITICAL: EVERY cabinet door and EVERY drawer MUST have hardware. No exceptions.
- Erase all existing handles and knobs completely.
${hardwareGeometry}
${hardwareColor}
- Place one handle on EACH door (vertically oriented on upper cabinets, horizontally on lower).
- Place one handle on EACH drawer (horizontally centered).
- Do NOT leave any door or drawer without a handle.

7. ANGLE / PERSPECTIVE HANDLING
${isAngledPhoto
  ? "Match the angle and perspective of the original photo when drawing all new rectangles and hardware. Maintain consistent vanishing points."
  : "Keep all geometry perfectly parallel since the photo is taken straight-on."}

${warpedPerspective
  ? "Straighten any warped or distorted cabinet faces before applying the new geometry. Correct vertical and horizontal alignment."
  : ""}

8. LIGHTING CONDITIONS
${lighting === "warm" ? "Adjust reflections and highlights to match warm indoor lighting." : ""}
${lighting === "cool" ? "Use cooler, softer highlights consistent with cool lighting." : ""}
${lighting === "neutral" ? "Use neutral white lighting reflections." : ""}

9. CLEANUP
${needsCleanup
  ? "Remove noise, smudges, debris, and painter's tape before generating final output."
  : "Keep image clarity but do not over-smooth the rest of the kitchen."}

10. FINAL DIRECTIVE
Generate the updated kitchen with the new cabinet style, color, and hardware while keeping all other room elements unchanged.
Maintain photorealism and match the original shadows, angle, and lighting.

IMAGE REFERENCE:
${imageDescription}
`.trim();

  return prompt;
}

/**
 * Analyze kitchen image using vision model
 * Returns structured analysis for prompt generation
 */
export async function analyzeKitchenImage(imageUrl: string): Promise<KitchenAnalysis> {
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  
  if (!replicateToken) {
    console.warn("⚠️ REPLICATE_API_TOKEN not set, using default analysis");
    return getDefaultAnalysis();
  }

  try {
    // Use Salesforce BLIP-2 for image captioning
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${replicateToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
        input: {
          image: imageUrl,
          question: "Describe this kitchen in detail including: cabinet style (arched, raised panel, flat, shaker), lighting (warm, cool, neutral), camera angle (straight-on or angled), any missing drawer fronts, and overall condition."
        }
      })
    });

    if (!response.ok) {
      throw new Error(`BLIP-2 API error: ${response.status}`);
    }

    const prediction = await response.json();
    
    // Poll for result
    let result = prediction;
    while (result.status === "starting" || result.status === "processing") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { "Authorization": `Bearer ${replicateToken}` }
      });
      result = await pollResponse.json();
    }

    if (result.status !== "succeeded" || !result.output) {
      throw new Error("BLIP-2 prediction failed");
    }

    const description = typeof result.output === "string" ? result.output : result.output.join(" ");
    
    // Parse the description for key features
    return parseImageDescription(description);
    
  } catch (err) {
    console.error("⚠️ Kitchen analysis failed:", err);
    return getDefaultAnalysis();
  }
}

function parseImageDescription(description: string): KitchenAnalysis {
  const lowerDesc = description.toLowerCase();
  
  return {
    imageDescription: description,
    drawersMissing: lowerDesc.includes("missing") || lowerDesc.includes("no drawer") || lowerDesc.includes("empty"),
    isAngledPhoto: lowerDesc.includes("angle") || lowerDesc.includes("corner") || lowerDesc.includes("perspective"),
    hasArchedDoors: lowerDesc.includes("arch") || lowerDesc.includes("raised panel") || lowerDesc.includes("cathedral"),
    lighting: lowerDesc.includes("warm") ? "warm" : lowerDesc.includes("cool") ? "cool" : "neutral",
    needsCleanup: lowerDesc.includes("dirty") || lowerDesc.includes("tape") || lowerDesc.includes("debris") || lowerDesc.includes("mess"),
    warpedPerspective: lowerDesc.includes("distort") || lowerDesc.includes("warp") || lowerDesc.includes("fisheye")
  };
}

function getDefaultAnalysis(): KitchenAnalysis {
  return {
    imageDescription: "Kitchen with cabinets, countertops, and appliances",
    drawersMissing: false,
    isAngledPhoto: false,
    hasArchedDoors: false,
    lighting: "neutral",
    needsCleanup: false,
    warpedPerspective: false
  };
}
