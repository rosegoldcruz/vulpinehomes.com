// app/api/vulpine-kitchen-quote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendLeadTelegramMessage } from "@/lib/telegram";
import { normalizePhone, isValidEmail } from "@/lib/phoneNormalizer";

export const runtime = "nodejs";

// Storage bucket - use same bucket as visualizer for consistency
const STORAGE_BUCKET = "visualizations";
const FALLBACK_BUCKETS = ["visualizations", "kitchen-photos", "visualizer-inputs"];

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
    const formData = await req.formData();

    // --------------------------------------------
    // Extract text fields
    // --------------------------------------------
    const payload: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) return;
      payload[key] = value;
    });

    console.log("📝 Form data:", payload);

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
      notes: payload.notes || null,
      status: "new",
      source: "web",
    };

    // --------------------------------------------
    // Extract photo Files
    // --------------------------------------------
    const photoFiles: File[] = [];
    formData.forEach((value, key) => {
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
    // 3️⃣ SEND TELEGRAM NOTIFICATION (non-blocking)
    // --------------------------------------------
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const fullPhotoUrls = uploadedPhotos.map(({ path, bucket }) => 
      `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
    );

    // Fire-and-forget - don't let Telegram failure break the submission
    sendLeadTelegramMessage({
      name: parsed.full_name,
      phone: parsed.phone,
      city: parsed.city,
      doors: parsed.num_doors,
      drawers: parsed.num_drawers,
      hasIsland: false,
      photoCount: uploadedPhotos.length,
      photoUrls: fullPhotoUrls, // Already full URLs now
      source: "kitchen_quote_landing",
    })
      .then(() => console.log("✅ Telegram lead notification sent"))
      .catch((err) => console.error("⚠️ Telegram notification failed (non-critical):", err));

    // --------------------------------------------
    // 4️⃣ RETURN SUCCESS
    // --------------------------------------------
    console.log("✅ Kitchen quote submission complete");

    return NextResponse.json({
      success: true,
      id: lead.id,
      photosUploaded: uploadedPhotos.length,
    });

  } catch (err) {
    console.error("❌ Kitchen quote submission error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err)
      },
      { status: 500 }
    );
  }
}
