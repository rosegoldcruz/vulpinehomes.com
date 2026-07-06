// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\api\vulpine-kitchen-quote\route.ts
// app/api/vulpine-kitchen-quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendLeadTelegramMessage } from "@/lib/telegram";
import { normalizePhone, isValidEmail } from "@/lib/phoneNormalizer";
import { normalizeReferralCode } from "@/lib/referralProgram";

export const runtime = "nodejs";

// Storage bucket - use same bucket as visualizer for consistency
const STORAGE_BUCKET = "visualizations";
const FALLBACK_BUCKETS = ["visualizations", "kitchen-photos", "visualizer-inputs"];
const LEAD_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

function sanitizeText(value: unknown, max = 120): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

async function resolveActiveReferralCode(rawCode: string | null): Promise<string | null> {
  const normalized = normalizeReferralCode(rawCode);
  if (!normalized) return null;

  const { data } = await supabaseServer
    .from("referral_codes")
    .select("code")
    .eq("code", normalized)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  return data?.code || null;
}

async function hasRecentMirroredLead(phone: string): Promise<boolean> {
  const cutoffIso = new Date(Date.now() - LEAD_DEDUPE_WINDOW_MS).toISOString();
  const { data, error } = await supabaseServer
    .from("leads")
    .select("id")
    .eq("phone", phone)
    .eq("source", "kitchen_quote")
    .gte("created_at", cutoffIso)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("⚠️ Lead dedupe lookup failed:", error);
    return false;
  }

  return !!data?.id;
}

// Helper: Try uploading to multiple buckets with fallback
async function uploadWithFallback(
  buffer: Buffer,
  filepath: string,
  contentType: string
): Promise<{ path: string; bucket: string } | null> {
  for (const bucket of FALLBACK_BUCKETS) {
    try {
      const { data, error } = await supabaseServer.storage
        .from(bucket)
        .upload(filepath, buffer, {
          contentType,
          cacheControl: "3600",
          upsert: true, // Allow overwrite to avoid conflicts
        });

      if (!error && data) {
        console.log(`✅ Uploaded to ${bucket}: ${filepath}`);
        return { path: filepath, bucket };
      }
      console.warn(`⚠️ Failed ${bucket}:`, error?.message);
    } catch (err) {
      console.warn(`⚠️ Exception on ${bucket}:`, err);
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  console.log("📥 Kitchen quote submission started");

  try {
    const rawForm = await req.formData();
    const requestId = crypto.randomUUID().slice(0, 12);

    // --------------------------------------------
    // Extract text fields
    // --------------------------------------------
    const payload: Record<string, any> = {};
    rawForm.forEach((value, key) => {
      if (value instanceof File) return;
      payload[key] = value;
    });

    console.log("📝 Form data:", payload);

    const explicitReferralCode = sanitizeText(payload.referralCode, 40) || null;
    const cookieReferralCode = req.cookies.get("vh_referral_code")?.value || null;
    const referralCode = await resolveActiveReferralCode(explicitReferralCode || cookieReferralCode);

    if (explicitReferralCode && !referralCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Referral code is invalid or inactive",
        },
        { status: 400 }
      );
    }

    // Validate email (REQUIRED)
    const email = payload.email?.trim() || null;
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid email is required",
        },
        { status: 400 }
      );
    }

    // Validate phone (REQUIRED)
    const phoneRaw = payload.phone?.trim() || null;
    if (!phoneRaw) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number is required",
        },
        { status: 400 }
      );
    }
    const phoneNormalized = normalizePhone(phoneRaw);

    // Normalize types
    const parsedNotes = payload.notes || null;
    const notesWithReferral = referralCode
      ? `${parsedNotes ? `${parsedNotes}\n` : ""}Referral Code: ${referralCode}`
      : parsedNotes;

    const parsed = {
      full_name: payload.name || null,
      phone: phoneNormalized,
      email,
      address: payload.address || null,
      city: payload.city || null,
      state: payload.state || null,
      zipcode: payload.zipcode || null,
      cabinet_style: payload.cabinetStyle || null,
      cabinet_color: payload.cabinetColor || null,
      countertop: payload.countertop || null,
      num_doors: payload.doors ? Number(payload.doors) : null,
      num_drawers: payload.drawers ? Number(payload.drawers) : null,
      notes: notesWithReferral,
      status: "new",
      source: referralCode ? "web_referral" : "web",
    };

    // --------------------------------------------
    // Extract photo Files
    // --------------------------------------------
    const photoFiles: File[] = [];
    rawForm.forEach((value, key) => {
      if (value instanceof File && key.startsWith("photos_")) {
        if (value.size > 0) {
          console.log(`📸 Found photo: ${value.name} (${value.size} bytes)`);
          photoFiles.push(value);
        }
      }
    });

    console.log(`📸 Total photos: ${photoFiles.length}`);

    // --------------------------------------------
    // 1️⃣ INSERT LEAD INTO kitchen_quotes
    // --------------------------------------------
    console.log("💾 Inserting into kitchen_quotes...");

    const { data: lead, error: leadError } = await supabaseServer
      .from("kitchen_quotes")
      .insert(parsed)
      .select("*")
      .single();

    if (leadError) {
      console.error("❌ Lead insert error:", leadError);
      return NextResponse.json(
        {
          success: false,
          error: "Database insert failed",
          details: leadError.message
        },
        { status: 500 }
      );
    }

    if (!lead) {
      console.error("❌ No lead returned after insert");
      return NextResponse.json(
        { success: false, error: "No lead created" },
        { status: 500 }
      );
    }

    console.log(`✅ Lead created with ID: ${lead.id}`);

    const duplicateLead = parsed.phone ? await hasRecentMirroredLead(parsed.phone) : false;
    if (duplicateLead) {
      console.log("ℹ️ Duplicate quote lead detected in dedupe window; mirror insert skipped");
    } else {
      const { error: canonicalLeadError } = await supabaseServer.from("leads").insert({
        name: parsed.full_name || "Website Kitchen Quote",
        phone: parsed.phone,
        email: parsed.email,
        city: parsed.city,
        notes: `${parsed.notes || ""}${parsed.notes ? "\n" : ""}Kitchen Quote ID: ${lead.id}`,
        source: "kitchen_quote",
        referral_code: referralCode,
        status: "new",
      });

      if (canonicalLeadError) {
        console.warn("⚠️ Failed to mirror quote lead into leads table:", canonicalLeadError);
      } else {
        console.log("✅ Lead mirrored into leads table");
      }
    }

    // --------------------------------------------
    // 2️⃣ UPLOAD PHOTOS (if any) - with graceful fallback
    // --------------------------------------------
    const uploadedPhotos: { path: string; bucket: string }[] = [];

    if (photoFiles.length > 0) {
      console.log(`📤 Uploading ${photoFiles.length} photos with auto-fallback...`);

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];

        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
          const filepath = `quotes/${lead.id}/${Date.now()}-${i}-${cleanName}`;

          console.log(`📤 Attempting upload: ${filepath}`);

          const result = await uploadWithFallback(
            buffer,
            filepath,
            file.type || "image/jpeg"
          );

          if (result) {
            uploadedPhotos.push(result);
          } else {
            console.warn(`⚠️ All buckets failed for ${file.name}, continuing without this photo`);
          }
        } catch (uploadErr) {
          console.error(`❌ Exception uploading ${file.name}:`, uploadErr);
          // Continue with other photos - don't fail the whole submission
        }
      }

      // Update the lead with photo URLs (store full public URLs)
      if (uploadedPhotos.length > 0) {
        console.log(`💾 Updating lead with ${uploadedPhotos.length} photo URLs...`);

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const photoUrls = uploadedPhotos.map(({ path, bucket }) => 
          `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
        );

        const { error: updateError } = await supabaseServer
          .from("kitchen_quotes")
          .update({ photo_urls: photoUrls })
          .eq("id", lead.id);

        if (updateError) {
          console.error("❌ Error updating photo_urls:", updateError);
        } else {
          console.log("✅ Photo URLs updated");
        }
      }
    }

    // --------------------------------------------
    // 3️⃣ SEND TELEGRAM NOTIFICATION
    // --------------------------------------------
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const fullPhotoUrls = uploadedPhotos.map(({ path, bucket }) => 
      `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
    );

    const telegramResult = await sendLeadTelegramMessage({
      name: parsed.full_name,
      phone: parsed.phone,
      city: parsed.city,
      doors: parsed.num_doors,
      drawers: parsed.num_drawers,
      hasIsland: false,
      photoCount: uploadedPhotos.length,
      photoUrls: fullPhotoUrls, // Already full URLs now
      source: "kitchen_quote_landing",
    });

    // --------------------------------------------
    // 4️⃣ RETURN SUCCESS
    // --------------------------------------------
    console.log("✅ Kitchen quote submission complete");

    const response = NextResponse.json(
      {
        success: true,
        id: lead.id,
        photosUploaded: uploadedPhotos.length,
      },
      { status: 200 }
    );
    
    response.headers.set("x-vh-rid", requestId);
    response.headers.set("x-vh-intake", "ok");
    response.headers.set("x-vh-reason", "ok");
    response.headers.set("x-vh-form-type", "kitchen_quote");
    response.headers.set("x-vh-telegram", telegramResult.status);
    response.headers.set("x-vh-telegram-reason", telegramResult.reason);

    console.info("[vh:intake]", {
      rid: requestId,
      endpoint: "/api/vulpine-kitchen-quote",
      intake: "ok",
      reason: "ok",
      telegram: telegramResult.status,
      telegramReason: telegramResult.reason
    });

    return response;

  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    const message = errorObj.message || "Database insert failed";
    const details = errorObj.stack || "";
    console.error("❌ Lead insert error:", { message, details, ...((err as any) || {}) });

    const response = NextResponse.json(
      {
        success: false,
        error: message,
        details: details,
      },
      { status: 500 }
    );

    const requestId = crypto.randomUUID().slice(0, 12);
    response.headers.set("x-vh-rid", requestId);
    response.headers.set("x-vh-intake", "fail");
    response.headers.set("x-vh-reason", "supabase_insert_failed");
    response.headers.set("x-vh-form-type", "kitchen_quote");
    response.headers.set("x-vh-telegram", "skipped");
    response.headers.set("x-vh-telegram-reason", "unknown");

    console.info("[vh:intake]", {
      rid: requestId,
      endpoint: "/api/vulpine-kitchen-quote",
      intake: "fail",
      reason: "supabase_insert_failed",
      telegram: "skipped",
      telegramReason: "unknown"
    });

    return response;
  }
}
