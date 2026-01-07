"""
AEON Universal Prompt Generator - Python Version
Dynamically builds Nano-Banana-compatible prompts based on kitchen analysis

Usage:
    from prompt_generator import build_kitchen_refacing_prompt, analyze_kitchen_image
    
    # Analyze the uploaded image
    analysis = await analyze_kitchen_image(image_url)
    
    # Generate the prompt
    prompt = build_kitchen_refacing_prompt(
        image_description=analysis["image_description"],
        door_style="shaker",
        color_hex="#FFFFFF",
        color_name="Classic White",
        hardware_style="loft",
        hardware_finish="satinnickel",
        drawers_missing=analysis["drawers_missing"],
        is_angled_photo=analysis["is_angled_photo"],
        has_arched_doors=analysis["has_arched_doors"],
        lighting=analysis["lighting"],
        needs_cleanup=analysis["needs_cleanup"],
        warped_perspective=analysis["warped_perspective"]
    )
"""

import os
import httpx
import asyncio
from typing import Literal, TypedDict, Optional

# Type definitions
DoorStyle = Literal["slab", "shaker", "shaker-slide", "fusion-shaker", "fusion-slide"]
HardwareStyle = Literal["loft", "bar", "arch", "artisan", "cottage", "square"]
HardwareFinish = Literal["rose_gold", "chrome", "black", "nickel", "satinnickel", "gold", "bronze"]
LightingType = Literal["warm", "cool", "neutral"]


class KitchenAnalysis(TypedDict):
    image_description: str
    drawers_missing: bool
    is_angled_photo: bool
    has_arched_doors: bool
    lighting: LightingType
    needs_cleanup: bool
    warped_perspective: bool


# Door geometry instructions - what Nano-Banana understands
DOOR_GEOMETRY = {
    "slab": "Remove all interior lines and make each door and drawer a completely flat smooth rectangle with no panels, grooves, or decorative elements.",
    "shaker": "Erase all existing lines and draw a new recessed rectangular center panel with even borders on each door. Add a shorter horizontal recessed panel on each drawer.",
    "shaker-slide": "Erase all existing lines and draw a recessed center panel with clean horizontal lines. Add matching recessed drawer geometry with subtle horizontal banding.",
    "fusion-shaker": "Erase all existing lines and draw a recessed center panel with a thin modern frame around it. Add matching recessed geometry to all drawers with crisp edges.",
    "fusion-slide": "Erase existing panel lines. Draw a clean rectangular recessed center panel with crisp edges. Add matching modern recessed drawer geometry with a subtle horizontal band."
}

# Hardware geometry instructions
HARDWARE_GEOMETRY = {
    "loft": "Add a straight bar pull with squared posts, placed vertically on doors and horizontally on drawers.",
    "bar": "Add a cylindrical bar handle with rounded posts, positioned vertically on doors and horizontally on drawers.",
    "arch": "Add a soft curved arch handle with small circular posts.",
    "artisan": "Add an artisan-style handle with decorative detailing and curved profile.",
    "cottage": "Add a cottage-style knob or pull with classic rounded design.",
    "square": "Add a square modern pull with clean geometric lines."
}

# Hardware finish instructions
HARDWARE_FINISH = {
    "rose_gold": "Apply a warm rose gold metallic finish with subtle pink undertones.",
    "chrome": "Apply a polished chrome reflective metallic finish.",
    "black": "Apply a matte black non-reflective finish.",
    "nickel": "Apply a satin nickel brushed finish.",
    "satinnickel": "Apply a satin nickel brushed finish with soft sheen.",
    "gold": "Apply a polished gold metallic finish.",
    "bronze": "Apply an oil-rubbed bronze finish with warm undertones."
}


def build_kitchen_refacing_prompt(
    image_description: str,
    door_style: DoorStyle,
    color_hex: str,
    color_name: str,
    hardware_style: HardwareStyle,
    hardware_finish: HardwareFinish,
    drawers_missing: bool = False,
    is_angled_photo: bool = False,
    has_arched_doors: bool = False,
    lighting: LightingType = "neutral",
    needs_cleanup: bool = False,
    warped_perspective: bool = False
) -> str:
    """
    AEON Universal Prompt Generator
    Builds a complete chain-of-command prompt for Nano-Banana
    """
    
    door_geometry = DOOR_GEOMETRY.get(door_style, DOOR_GEOMETRY["shaker"])
    hardware_geometry = HARDWARE_GEOMETRY.get(hardware_style, HARDWARE_GEOMETRY["bar"])
    hardware_color = HARDWARE_FINISH.get(hardware_finish, HARDWARE_FINISH["nickel"])

    # Section 2: Missing parts
    missing_parts_section = (
        "Some drawers are missing. Draw new drawer fronts as flat rectangles that match the size, shape, and alignment of surrounding drawers."
        if drawers_missing else
        "All drawers appear present; keep their size and outer boundaries unchanged."
    )

    # Section 3: Erase old styles
    erase_section = (
        "Remove all arched or raised panel shapes. Flatten them completely before drawing the new style."
        if has_arched_doors else
        "Remove all existing panel lines, bevels, grooves, and decorative shapes to prepare for the new style."
    )

    # Section 7: Angle handling
    angle_section = (
        "Match the angle and perspective of the original photo when drawing all new rectangles and hardware. Maintain consistent vanishing points."
        if is_angled_photo else
        "Keep all geometry perfectly parallel since the photo is taken straight-on."
    )

    warp_section = (
        "Straighten any warped or distorted cabinet faces before applying the new geometry. Correct vertical and horizontal alignment."
        if warped_perspective else ""
    )

    # Section 8: Lighting
    lighting_map = {
        "warm": "Adjust reflections and highlights to match warm indoor lighting.",
        "cool": "Use cooler, softer highlights consistent with cool lighting.",
        "neutral": "Use neutral white lighting reflections."
    }
    lighting_section = lighting_map.get(lighting, lighting_map["neutral"])

    # Section 9: Cleanup
    cleanup_section = (
        "Remove noise, smudges, debris, and painter's tape before generating final output."
        if needs_cleanup else
        "Keep image clarity but do not over-smooth the rest of the kitchen."
    )

    prompt = f"""LOOK AT THE IMAGE AND FOLLOW THESE ACTIONS EXACTLY:

1. ANALYZE STRUCTURE
- Identify all cabinets, doors, drawers, openings, and hardware in the image.
- Preserve countertops, walls, appliances, windows, lighting, and flooring.
- Do NOT modify anything except cabinets, drawers, and hardware.

2. RECONSTRUCT MISSING PARTS
{missing_parts_section}

3. ERASE OLD STYLES
{erase_section}

4. DRAW NEW DOOR STYLE
{door_geometry}

5. APPLY NEW COLOR
Recolor all cabinet surfaces to {color_name} ({color_hex}) with a smooth satin finish.
Do not change shadows or reflections on surrounding objects.

6. REMOVE OLD HARDWARE AND ADD NEW
Erase all existing handles and knobs completely.
{hardware_geometry}
{hardware_color}
Place handles centered and aligned with standard orientation.

7. ANGLE / PERSPECTIVE HANDLING
{angle_section}
{warp_section}

8. LIGHTING CONDITIONS
{lighting_section}

9. CLEANUP
{cleanup_section}

10. FINAL DIRECTIVE
Generate the updated kitchen with the new cabinet style, color, and hardware while keeping all other room elements unchanged.
Maintain photorealism and match the original shadows, angle, and lighting.

IMAGE REFERENCE:
{image_description}"""

    return prompt.strip()


async def analyze_kitchen_image(image_url: str) -> KitchenAnalysis:
    """
    Analyze kitchen image using Replicate's BLIP-2 vision model
    Returns structured analysis for prompt generation
    """
    replicate_token = os.environ.get("REPLICATE_API_TOKEN")
    
    if not replicate_token:
        print("⚠️ REPLICATE_API_TOKEN not set, using default analysis")
        return get_default_analysis()

    try:
        async with httpx.AsyncClient() as client:
            # Use Salesforce BLIP-2 for image captioning
            response = await client.post(
                "https://api.replicate.com/v1/predictions",
                headers={
                    "Authorization": f"Bearer {replicate_token}",
                    "Content-Type": "application/json",
                },
                json={
                    "version": "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
                    "input": {
                        "image": image_url,
                        "question": "Describe this kitchen in detail including: cabinet style (arched, raised panel, flat, shaker), lighting (warm, cool, neutral), camera angle (straight-on or angled), any missing drawer fronts, and overall condition."
                    }
                },
                timeout=60.0
            )

            if response.status_code != 201:
                raise Exception(f"BLIP-2 API error: {response.status_code}")

            prediction = response.json()
            
            # Poll for result
            result = prediction
            while result.get("status") in ("starting", "processing"):
                await asyncio.sleep(1)
                poll_response = await client.get(
                    f"https://api.replicate.com/v1/predictions/{result['id']}",
                    headers={"Authorization": f"Bearer {replicate_token}"},
                    timeout=30.0
                )
                result = poll_response.json()

            if result.get("status") != "succeeded" or not result.get("output"):
                raise Exception("BLIP-2 prediction failed")

            output = result["output"]
            description = output if isinstance(output, str) else " ".join(output)
            
            return parse_image_description(description)
            
    except Exception as err:
        print(f"⚠️ Kitchen analysis failed: {err}")
        return get_default_analysis()


def parse_image_description(description: str) -> KitchenAnalysis:
    """Parse the BLIP-2 description for key features"""
    lower_desc = description.lower()
    
    return {
        "image_description": description,
        "drawers_missing": any(word in lower_desc for word in ["missing", "no drawer", "empty"]),
        "is_angled_photo": any(word in lower_desc for word in ["angle", "corner", "perspective"]),
        "has_arched_doors": any(word in lower_desc for word in ["arch", "raised panel", "cathedral"]),
        "lighting": "warm" if "warm" in lower_desc else ("cool" if "cool" in lower_desc else "neutral"),
        "needs_cleanup": any(word in lower_desc for word in ["dirty", "tape", "debris", "mess"]),
        "warped_perspective": any(word in lower_desc for word in ["distort", "warp", "fisheye"])
    }


def get_default_analysis() -> KitchenAnalysis:
    """Default analysis when vision model is unavailable"""
    return {
        "image_description": "Kitchen with cabinets, countertops, and appliances",
        "drawers_missing": False,
        "is_angled_photo": False,
        "has_arched_doors": False,
        "lighting": "neutral",
        "needs_cleanup": False,
        "warped_perspective": False
    }


# ============ EXAMPLE USAGE ============
if __name__ == "__main__":
    # Example: Generate a prompt without image analysis
    prompt = build_kitchen_refacing_prompt(
        image_description="L-shaped kitchen with oak cabinets, granite countertops, stainless appliances",
        door_style="shaker",
        color_hex="#FFFFFF",
        color_name="Classic White",
        hardware_style="loft",
        hardware_finish="satinnickel",
        drawers_missing=False,
        is_angled_photo=True,
        has_arched_doors=True,
        lighting="warm",
        needs_cleanup=False,
        warped_perspective=False
    )
    
    print("=" * 60)
    print("GENERATED PROMPT:")
    print("=" * 60)
    print(prompt)
