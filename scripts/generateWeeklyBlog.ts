import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { BLOG_TITLES } from "../blog-titles";

const DEEPSEEK_API_KEY = process.env.DEEP_SEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.error("DEEP_SEEK_API_KEY is not set. Aborting.");
  process.exit(1);
}

const BLOG_DIR = path.resolve(process.cwd(), "content", "blog");
const STATE_FILE = path.resolve(process.cwd(), ".blog-state.json");

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const CITY_LINKS: string[] = [
  "/cabinet-refacing-phoenix-az",
  "/cabinet-refacing-scottsdale",
  "/cabinet-refacing-chandler",
  "/cabinet-refacing-mesa",
  "/cabinet-refacing-tempe",
  "/cabinet-refacing-glendale",
  "/cabinet-refacing-gilbert",
  "/cabinet-refacing-peoria",
  "/cabinet-refacing-surprise",
  "/cabinet-refacing-goodyear",
  "/cabinet-refacing-buckeye",
  "/cabinet-refacing-east-valley",
  "/cabinet-refacing-west-valley",
  "/cabinet-refacing-north-phoenix",
  "/cabinet-refacing-south-phoenix",
  "/cabinet-refacing-north-scottsdale",
];

function pickCityLink(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("phoenix")) return "/cabinet-refacing-phoenix-az";
  if (t.includes("east valley")) return "/cabinet-refacing-east-valley";
  if (t.includes("west valley")) return "/cabinet-refacing-west-valley";
  if (t.includes("scottsdale")) return "/cabinet-refacing-scottsdale";
  if (t.includes("north phoenix")) return "/cabinet-refacing-north-phoenix";
  if (t.includes("south phoenix")) return "/cabinet-refacing-south-phoenix";
  if (t.includes("goodyear")) return "/cabinet-refacing-goodyear";
  if (t.includes("peoria")) return "/cabinet-refacing-peoria";
  if (t.includes("surprise")) return "/cabinet-refacing-surprise";
  if (t.includes("buckeye")) return "/cabinet-refacing-buckeye";
  if (t.includes("glendale")) return "/cabinet-refacing-glendale";
  if (t.includes("gilbert")) return "/cabinet-refacing-gilbert";
  if (t.includes("chandler")) return "/cabinet-refacing-chandler";
  if (t.includes("mesa")) return "/cabinet-refacing-mesa";
  return "/cabinet-refacing-phoenix-az";
}

async function readState(): Promise<{ index: number }> {
  try {
    const raw = await fsp.readFile(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (typeof parsed.index === "number" && parsed.index >= 0) return { index: parsed.index };
    return { index: 0 };
  } catch {
    return { index: 0 };
  }
}

async function writeState(nextIndex: number) {
  const payload = JSON.stringify({ index: nextIndex }, null, 2);
  await fsp.writeFile(STATE_FILE, payload, "utf8");
}

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    await fsp.mkdir(dir, { recursive: true });
  }
}

async function generatePost(title: string, cityUrl: string): Promise<string> {
  const system = `You are an expert home improvement writer for Phoenix, AZ homeowners.
- Output VALID MARKDOWN ONLY (no YAML front matter).
- Neutral, professional homeowner tone. Arizona context. No emojis. No AI disclaimers.
- Use H2 sections throughout.
- Length 900–1200 words.
- Include EXACTLY ONE internal link to /get-quote with the anchor text "Get Free Quote" near the end.
- Include EXACTLY ONE internal link to the provided city URL.
- Do NOT change the title.`;

  const user = `Write a blog post with the EXACT title below. Begin with an H1 using the exact title.

Title: ${title}

City URL for the single internal city link (choose appropriate context in-body): ${cityUrl}

Rules reminder:
- 900–1200 words
- H2 sections throughout
- One internal link to ${cityUrl}
- One internal link to /get-quote with anchor "Get Free Quote" near the end
- Valid Markdown only`;

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: 2200,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as any;
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("No content returned from DeepSeek API");
  }
  return content.trim();
}

(async () => {
  await ensureDir(BLOG_DIR);
  const { index } = await readState();

  if (index >= BLOG_TITLES.length) {
    console.log("All titles have been used. Exiting cleanly.");
    process.exit(0);
  }

  const title = BLOG_TITLES[index];
  const slug = slugify(title);
  const outPath = path.join(BLOG_DIR, `${slug}.md`);

  // If the target file already exists, skip generating again but advance the index to avoid blocking the schedule.
  if (fs.existsSync(outPath)) {
    await writeState(index + 1);
    console.log(`Post already exists for index ${index}: ${outPath}. Advanced state.`);
    process.exit(0);
  }

  const cityUrl = pickCityLink(title);
  const markdown = await generatePost(title, cityUrl);

  // Write the post
  await fsp.writeFile(outPath, markdown, "utf8");

  // Update state
  await writeState(index + 1);

  console.log(`Generated: ${outPath}`);
})();
