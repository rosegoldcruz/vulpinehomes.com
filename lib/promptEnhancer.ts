// lib/promptEnhancer.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

interface EnhanceCabinetPromptArgs {
  userPrompt: string;
  style: string;
  color: string;
  hardware: string;
}

export async function enhanceCabinetPrompt({
  userPrompt,
  style,
  color,
  hardware,
}: EnhanceCabinetPromptArgs): Promise<{ enhanced_prompt: string }> {
  const fallbackPrompt = (userPrompt || "").trim();
  const system = `
You are the AEON Cabinet Refacing Prompt Engine.

Your ONLY task is to convert the cabinet selections + optional user text into a strict, image-editing command optimized for Google Nano-Banana.

RULES:
- Always treat the selected door style, cabinet color, and hardware finish as NON-NEGOTIABLE requirements.
- Even if the user request is empty or vague, you must still produce a complete command using those selections.
- Output must be short, direct, and command-style.
- No explanations or extra text.
- No personality.
- Only output the final enhanced prompt.

FORMAT MUST BE:
CHANGE → MATCH → PRESERVE → RULES → REALISM

WHERE:
CHANGE = modify only cabinet doors, drawer fronts, and hardware
MATCH = restate and match the selected door style, cabinet color, and hardware finish
PRESERVE = do not change countertops, appliances, backsplash, flooring, island, walls, windows, lighting, shadows, reflections, or camera angle
RULES = all cabinets must have hardware, no missing handles, no new objects, no removed objects, no changes to hinges or molding
REALISM = enforce photographic consistency and same-room lighting

If user text conflicts with the selections, ignore the conflict and follow the selections.

Output ONLY the final enhanced prompt, nothing else.
`;

  const user = `
Selections:
- Door style: ${style}
- Cabinet color: ${color}
- Hardware finish: ${hardware}

User free-text request (may be empty): "${userPrompt}"

Using the selections as the primary truth, generate the final strict command-style prompt now.
`;

  // 1) Prefer DeepSeek if a DEEPSEEK_API_KEY is configured.
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekKey) {
    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekKey}`,
        },
        body: JSON.stringify({
          model: process.env.DEEPSEEK_PROMPT_MODEL || "deepseek-chat",
          temperature: 0.1,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("⚠️ DeepSeek prompt enhancement HTTP error:", response.status, text);
      } else {
        const json: any = await response.json();
        const content: string | undefined =
          json?.choices?.[0]?.message?.content?.trim?.() ||
          json?.choices?.[0]?.message?.content ||
          undefined;
        if (content && content.length > 0) {
          return { enhanced_prompt: content };
        }
      }
    } catch (err) {
      console.error("⚠️ DeepSeek prompt enhancement failed, will fall back:", err);
    }
  }

  // 2) Fallback to OpenAI if configured.
  if (process.env.OPENAI_API_KEY) {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_PROMPT_MODEL || "gpt-4o-mini",
        temperature: 0.1,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      });

      return {
        enhanced_prompt: completion.choices[0].message.content?.trim() || fallbackPrompt,
      };
    } catch (err) {
      console.error("⚠️ OpenAI prompt enhancement failed, falling back to raw prompt:", err);
    }
  }

  // 3) Final fallback: just use the merged base prompt from the engine.
  console.warn("⚠️ No prompt enhancement provider available, using raw prompt.");
  return { enhanced_prompt: fallbackPrompt };
}
