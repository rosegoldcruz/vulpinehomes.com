import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type EnhancedPrompt = {
  positive: string;
  negative: string;
};

export async function buildEnhancedPrompt(params: {
  userPrompt: string;
  style: string | null;
  color: string | null;
  hardware: string | null;
}) {
  const { userPrompt, style, color, hardware } = params;

  const system = `
You are an AI interior designer specializing in KITCHEN CABINET REFACING ONLY.
Your job is to convert rough homeowner text into:

1) A highly detailed POSITIVE prompt for image-to-image refacing
2) A strict NEGATIVE prompt to prevent hallucinations.

Rules:
- Preserve layout, walls, ceiling, appliances, flooring, countertops.
- Only change CABINETS + CABINET HARDWARE.
- Respect requested style, color, and hardware finish.
- No structural changes, no new windows, no extra furniture.
- Photorealistic, professional interior photography.
`;

  const user = `
User raw prompt:
"${userPrompt}"

Structured selections:
- Style: ${style ?? "not specified"}
- Color: ${color ?? "not specified"}
- Hardware: ${hardware ?? "not specified"}

Return STRICT JSON with fields: "positive" and "negative".
Example:
{
  "positive": "...",
  "negative": "..."
}
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_PROMPT_MODEL || "gpt-4o-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system.trim() },
      { role: "user", content: user.trim() },
    ],
  });

  const raw = completion.choices[0].message.content;
  if (!raw) {
    throw new Error("OpenAI returned empty prompt");
  }

  const parsed = JSON.parse(raw) as EnhancedPrompt;

  if (!parsed.positive || !parsed.negative) {
    throw new Error("OpenAI prompt enhancer did not return expected fields");
  }

  return parsed;
}
