import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { readdir } from "node:fs/promises";
import path from "node:path";
import C4LLandingClient from "./C4LLandingClient";

const C4L_HOST = "cabinets4less.vulpinehomes.com";
const IMAGE_DIRS = ["c4l", "c4l-social-proof", "cabinets4less"];
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export const dynamic = "force-dynamic";

async function getSocialProofImages(): Promise<string[]> {
  const publicRoot = path.join(process.cwd(), "public");
  const results: string[] = [];

  for (const dir of IMAGE_DIRS) {
    const fullDir = path.join(publicRoot, dir);

    try {
      const entries = await readdir(fullDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;

        results.push(`/${dir}/${entry.name}`);
      }
    } catch {
      // Missing directory is expected in environments without social proof assets yet.
    }
  }

  return results.slice(0, 6);
}

export default async function C4LPage() {
  const host = (headers().get("host") || "").toLowerCase().split(":")[0];

  if (!host.startsWith(C4L_HOST)) {
    notFound();
  }

  const socialProofImages = await getSocialProofImages();

  return <C4LLandingClient socialProofImages={socialProofImages} />;
}

