// lib/visualizer/geminiService.ts
// Vertex AI-based cabinet parameter extraction service
// Uses service account authentication (ADC) - NO API KEYS

import { VertexAI } from '@google-cloud/vertexai';
import path from 'path';
import fs from 'fs';

export type DoorStyleId = "shaker" | "shaker-slide" | "slab" | "fusion-shaker" | "fusion-slide";

export interface RefacingSelections {
  doorStyle: DoorStyleId;
  colorName: string;
  colorHex: string;
  isWoodGrain: boolean;
  hardwareStyle: string;
  hardwareFinish: string;
}

export interface CabinetParameters {
  door_style: "shaker" | "slab" | "fusion" | "slide";
  panel_depth_mm: number;
  rail_width_mm: number;
  stile_width_mm: number;
  overlay_type: "full" | "partial" | "inset";
  drawer_stack: boolean;
  confidence: number;
}

// Initialize Vertex AI client with service account authentication
function initializeVertexAI(): VertexAI {
  const project = process.env.GOOGLE_CLOUD_PROJECT || 'vulpine-homes';
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

  // Handle service account authentication
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    // For Vercel/production: write base64-encoded service account to /tmp
    const serviceAccountJson = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64,
      'base64'
    ).toString('utf-8');
    
    const credPath = '/tmp/google-credentials.json';
    fs.writeFileSync(credPath, serviceAccountJson);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
  }

  // GOOGLE_APPLICATION_CREDENTIALS should now be set
  // either from env var or from the file we just wrote
  return new VertexAI({ project, location });
}

function buildParameterExtractionPrompt(selections: RefacingSelections): string {
  return `TASK: EXTRACT CABINET DOOR PARAMETERS FROM USER SELECTION

You are a cabinet design parameter extraction system.
Your ONLY job is to return structured JSON parameters.

USER SELECTED:
- Door Style: ${selections.doorStyle}
- Color: ${selections.colorName} (${selections.colorHex})
- Is Wood Grain: ${selections.isWoodGrain}
- Hardware: ${selections.hardwareStyle} ${selections.hardwareFinish}

OUTPUT FORMAT (JSON ONLY - NO MARKDOWN, NO TEXT):
{
  "door_style": "shaker" | "slab" | "fusion" | "slide",
  "panel_depth_mm": number (3-12),
  "rail_width_mm": number (40-120),
  "stile_width_mm": number (40-120),
  "overlay_type": "full" | "partial" | "inset",
  "drawer_stack": boolean,
  "confidence": number (0-1)
}

MAPPING RULES:
- "shaker" → door_style: "shaker", panel_depth_mm: 6.35, rail/stile: 76.2mm
- "shaker-slide" → door_style: "slide", panel_depth_mm: 4, rail/stile: 60mm
- "slab" → door_style: "slab", panel_depth_mm: 0, rail/stile: 0
- "fusion-shaker" → door_style: "fusion", panel_depth_mm: 6.35, drawer_stack: true
- "fusion-slide" → door_style: "fusion", panel_depth_mm: 4, drawer_stack: true

Return ONLY the JSON object. No explanation. No markdown.`;
}

export async function extractCabinetParameters(
  selections: RefacingSelections
): Promise<CabinetParameters> {
  const vertexAI = initializeVertexAI();
  
  const model = vertexAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
  });

  const prompt = buildParameterExtractionPrompt(selections);

  try {
    const request = {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 256,
        responseMimeType: 'application/json', // FORCE JSON OUTPUT
      },
    };

    const result = await model.generateContent(request);
    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Parse JSON response
    const parameters: CabinetParameters = JSON.parse(text);
    
    // Validate required fields
    if (!parameters.door_style || typeof parameters.panel_depth_mm !== 'number') {
      throw new Error('Invalid parameter structure from Gemini');
    }

    return parameters;
  } catch (error) {
    console.error('Vertex AI Parameter Extraction Error:', error);
    
    // Fallback: return deterministic parameters based on door style
    return getDeterministicParameters(selections.doorStyle);
  }
}

// Deterministic fallback if Gemini fails
function getDeterministicParameters(doorStyle: DoorStyleId): CabinetParameters {
  const parameterMap: Record<DoorStyleId, CabinetParameters> = {
    "shaker": {
      door_style: "shaker",
      panel_depth_mm: 6.35,
      rail_width_mm: 76.2,
      stile_width_mm: 76.2,
      overlay_type: "full",
      drawer_stack: false,
      confidence: 1.0
    },
    "shaker-slide": {
      door_style: "slide",
      panel_depth_mm: 3.8,
      rail_width_mm: 60,
      stile_width_mm: 60,
      overlay_type: "full",
      drawer_stack: false,
      confidence: 1.0
    },
    "slab": {
      door_style: "slab",
      panel_depth_mm: 0,
      rail_width_mm: 0,
      stile_width_mm: 0,
      overlay_type: "full",
      drawer_stack: false,
      confidence: 1.0
    },
    "fusion-shaker": {
      door_style: "fusion",
      panel_depth_mm: 6.35,
      rail_width_mm: 76.2,
      stile_width_mm: 76.2,
      overlay_type: "full",
      drawer_stack: true,
      confidence: 1.0
    },
    "fusion-slide": {
      door_style: "fusion",
      panel_depth_mm: 3.8,
      rail_width_mm: 60,
      stile_width_mm: 60,
      overlay_type: "full",
      drawer_stack: true,
      confidence: 1.0
    }
  };

  return parameterMap[doorStyle] || parameterMap["shaker"];
}
