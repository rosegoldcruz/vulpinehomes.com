"""
AEON Visualizer Backend API - Python FastAPI Version
Complete backend for kitchen visualization with universal prompt generation

Run with: uvicorn api:app --reload --port 8000
"""

import os
import uuid
import httpx
import asyncio
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from prompt_generator import (
    build_kitchen_refacing_prompt,
    analyze_kitchen_image,
    DoorStyle,
    HardwareStyle,
    HardwareFinish,
    LightingType
)

app = FastAPI(
    title="AEON Visualizer API",
    description="Kitchen cabinet refacing visualization powered by AEON prompt generation",
    version="1.0.0"
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VisualizerRequest(BaseModel):
    image_url: str
    door_style: DoorStyle
    color_hex: str
    color_name: str
    hardware_style: HardwareStyle
    hardware_finish: HardwareFinish
    name: str
    phone: str
    skip_analysis: bool = False  # Skip BLIP-2 analysis for faster processing


class VisualizerResponse(BaseModel):
    success: bool
    original_url: str
    final_url: str
    prompt_used: str
    analysis: Optional[dict] = None


class PromptOnlyRequest(BaseModel):
    image_description: str
    door_style: DoorStyle
    color_hex: str
    color_name: str
    hardware_style: HardwareStyle
    hardware_finish: HardwareFinish
    drawers_missing: bool = False
    is_angled_photo: bool = False
    has_arched_doors: bool = False
    lighting: LightingType = "neutral"
    needs_cleanup: bool = False
    warped_perspective: bool = False


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "AEON Visualizer API v1.0",
        "endpoints": {
            "POST /visualize": "Full visualization pipeline",
            "POST /visualize/upload": "Upload image and visualize",
            "POST /prompt/generate": "Generate prompt only (no image processing)",
            "POST /analyze": "Analyze kitchen image only"
        }
    }


@app.post("/prompt/generate")
async def generate_prompt_only(request: PromptOnlyRequest):
    """
    Generate a Nano-Banana-compatible prompt without running visualization.
    Useful for testing or custom pipelines.
    """
    prompt = build_kitchen_refacing_prompt(
        image_description=request.image_description,
        door_style=request.door_style,
        color_hex=request.color_hex,
        color_name=request.color_name,
        hardware_style=request.hardware_style,
        hardware_finish=request.hardware_finish,
        drawers_missing=request.drawers_missing,
        is_angled_photo=request.is_angled_photo,
        has_arched_doors=request.has_arched_doors,
        lighting=request.lighting,
        needs_cleanup=request.needs_cleanup,
        warped_perspective=request.warped_perspective
    )
    
    return {"success": True, "prompt": prompt}


@app.post("/analyze")
async def analyze_image(image_url: str = Form(...)):
    """
    Analyze a kitchen image using BLIP-2 vision model.
    Returns structured analysis for prompt generation.
    """
    analysis = await analyze_kitchen_image(image_url)
    return {"success": True, "analysis": analysis}


@app.post("/visualize", response_model=VisualizerResponse)
async def visualize(request: VisualizerRequest):
    """
    Full visualization pipeline:
    1. Analyze image with BLIP-2 (optional)
    2. Generate AEON prompt
    3. Run Nano-Banana transformation
    4. Return results
    """
    replicate_token = os.environ.get("REPLICATE_API_TOKEN")
    if not replicate_token:
        raise HTTPException(status_code=500, detail="REPLICATE_API_TOKEN not configured")

    # Step 1: Analyze image (optional)
    if request.skip_analysis:
        analysis = {
            "image_description": "Kitchen with cabinets",
            "drawers_missing": False,
            "is_angled_photo": False,
            "has_arched_doors": False,
            "lighting": "neutral",
            "needs_cleanup": False,
            "warped_perspective": False
        }
    else:
        analysis = await analyze_kitchen_image(request.image_url)

    # Step 2: Generate AEON prompt
    prompt = build_kitchen_refacing_prompt(
        image_description=analysis["image_description"],
        door_style=request.door_style,
        color_hex=request.color_hex,
        color_name=request.color_name,
        hardware_style=request.hardware_style,
        hardware_finish=request.hardware_finish,
        drawers_missing=analysis["drawers_missing"],
        is_angled_photo=analysis["is_angled_photo"],
        has_arched_doors=analysis["has_arched_doors"],
        lighting=analysis["lighting"],
        needs_cleanup=analysis["needs_cleanup"],
        warped_perspective=analysis["warped_perspective"]
    )

    # Step 3: Run Nano-Banana
    final_url = await run_nano_banana(
        image_url=request.image_url,
        prompt=prompt,
        replicate_token=replicate_token
    )

    return VisualizerResponse(
        success=True,
        original_url=request.image_url,
        final_url=final_url,
        prompt_used=prompt,
        analysis=analysis
    )


@app.post("/visualize/upload")
async def visualize_upload(
    image: UploadFile = File(...),
    door_style: DoorStyle = Form(...),
    color_hex: str = Form(...),
    color_name: str = Form(...),
    hardware_style: HardwareStyle = Form(...),
    hardware_finish: HardwareFinish = Form(...),
    name: str = Form(...),
    phone: str = Form(...),
    skip_analysis: bool = Form(False)
):
    """
    Upload image directly and run full visualization pipeline.
    Image is uploaded to temporary storage first.
    """
    replicate_token = os.environ.get("REPLICATE_API_TOKEN")
    if not replicate_token:
        raise HTTPException(status_code=500, detail="REPLICATE_API_TOKEN not configured")

    # Read image bytes
    image_bytes = await image.read()
    
    # For production, upload to Supabase/S3/etc.
    # For now, we'll use a data URI or temporary upload
    # This is a placeholder - implement your storage solution
    image_url = await upload_to_temp_storage(image_bytes, image.content_type or "image/jpeg")

    # Run the visualization pipeline
    if skip_analysis:
        analysis = {
            "image_description": "Kitchen with cabinets",
            "drawers_missing": False,
            "is_angled_photo": False,
            "has_arched_doors": False,
            "lighting": "neutral",
            "needs_cleanup": False,
            "warped_perspective": False
        }
    else:
        analysis = await analyze_kitchen_image(image_url)

    prompt = build_kitchen_refacing_prompt(
        image_description=analysis["image_description"],
        door_style=door_style,
        color_hex=color_hex,
        color_name=color_name,
        hardware_style=hardware_style,
        hardware_finish=hardware_finish,
        drawers_missing=analysis["drawers_missing"],
        is_angled_photo=analysis["is_angled_photo"],
        has_arched_doors=analysis["has_arched_doors"],
        lighting=analysis["lighting"],
        needs_cleanup=analysis["needs_cleanup"],
        warped_perspective=analysis["warped_perspective"]
    )

    final_url = await run_nano_banana(
        image_url=image_url,
        prompt=prompt,
        replicate_token=replicate_token
    )

    return {
        "success": True,
        "original_url": image_url,
        "final_url": final_url,
        "prompt_used": prompt,
        "analysis": analysis,
        "lead": {"name": name, "phone": phone}
    }


async def run_nano_banana(image_url: str, prompt: str, replicate_token: str) -> str:
    """
    Run Google Nano-Banana image editing model on Replicate
    """
    async with httpx.AsyncClient() as client:
        # Create prediction
        response = await client.post(
            "https://api.replicate.com/v1/predictions",
            headers={
                "Authorization": f"Bearer {replicate_token}",
                "Content-Type": "application/json",
            },
            json={
                "model": "google/nano-banana",
                "input": {
                    "prompt": prompt,
                    "image_input": [image_url],
                    "output_format": "jpg"
                }
            },
            timeout=60.0
        )

        if response.status_code not in (200, 201):
            raise HTTPException(
                status_code=500,
                detail=f"Nano-Banana API error: {response.status_code} - {response.text}"
            )

        prediction = response.json()
        
        # Poll for result
        result = prediction
        max_attempts = 120  # 2 minutes max
        attempts = 0
        
        while result.get("status") in ("starting", "processing") and attempts < max_attempts:
            await asyncio.sleep(1)
            attempts += 1
            poll_response = await client.get(
                f"https://api.replicate.com/v1/predictions/{result['id']}",
                headers={"Authorization": f"Bearer {replicate_token}"},
                timeout=30.0
            )
            result = poll_response.json()

        if result.get("status") != "succeeded":
            raise HTTPException(
                status_code=500,
                detail=f"Nano-Banana prediction failed: {result.get('error', 'Unknown error')}"
            )

        output = result.get("output")
        if isinstance(output, list) and len(output) > 0:
            return output[0]
        elif isinstance(output, str):
            return output
        else:
            raise HTTPException(status_code=500, detail="Nano-Banana did not return an image")


async def upload_to_temp_storage(image_bytes: bytes, content_type: str) -> str:
    """
    Upload image to temporary storage and return URL.
    
    For production, implement one of:
    - Supabase Storage
    - AWS S3
    - Cloudflare R2
    - Google Cloud Storage
    
    This is a placeholder that uses Replicate's file upload.
    """
    replicate_token = os.environ.get("REPLICATE_API_TOKEN")
    
    async with httpx.AsyncClient() as client:
        # Use Replicate's file upload endpoint
        response = await client.post(
            "https://api.replicate.com/v1/files",
            headers={
                "Authorization": f"Bearer {replicate_token}",
            },
            files={"file": ("kitchen.jpg", image_bytes, content_type)},
            timeout=60.0
        )
        
        if response.status_code in (200, 201):
            data = response.json()
            return data.get("urls", {}).get("get", data.get("url", ""))
        
        # Fallback: base64 data URI (not recommended for production)
        import base64
        b64 = base64.b64encode(image_bytes).decode()
        return f"data:{content_type};base64,{b64}"


# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}
