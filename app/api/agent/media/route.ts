import { randomUUID } from "node:crypto";
import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import {
  isSupabaseConfigured,
  SUPABASE_STORAGE_BUCKETS,
  uploadSupabaseObject,
} from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedBuckets = new Set<string>(Object.values(SUPABASE_STORAGE_BUCKETS));

export async function POST(request: Request) {
  const auth = validateAgentAuth(request);

  if (!auth.ok) {
    return agentAuthErrorResponse(auth);
  }

  if (!isSupabaseConfigured()) {
    return Response.json(
      {
        ok: false,
        error: "supabase_not_configured",
        message: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to upload media.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "file is required" }, { status: 400 });
  }

  const bucket = resolveBucket(stringValue(formData.get("kind")) ?? stringValue(formData.get("bucket")));
  const orderId = sanitizePathPart(stringValue(formData.get("order_id")) ?? stringValue(formData.get("orderId")) ?? "unassigned");
  const fileName = sanitizeFileName(file.name || "upload");
  const objectPath = `${orderId}/${Date.now()}-${randomUUID()}-${fileName}`;
  let uploaded: Awaited<ReturnType<typeof uploadSupabaseObject>>;

  try {
    uploaded = await uploadSupabaseObject({
      bucket,
      objectPath,
      body: file,
      contentType: file.type || "application/octet-stream",
    });
  } catch (error) {
    console.error("Agent media upload failed", error);

    return Response.json(
      {
        ok: false,
        error: "media_upload_failed",
        message: error instanceof Error ? error.message : "Media upload failed",
      },
      { status: 502 },
    );
  }

  return Response.json({
    ok: true,
    bucket: uploaded.bucket,
    path: uploaded.path,
    url: uploaded.publicUrl,
  });
}

function resolveBucket(value: string | undefined) {
  if (value && allowedBuckets.has(value)) {
    return value;
  }

  if (value === "music" || value === "audio") {
    return SUPABASE_STORAGE_BUCKETS.customerMusic;
  }

  if (value === "receipt" || value === "payment" || value === "check") {
    return SUPABASE_STORAGE_BUCKETS.paymentReceipts;
  }

  return SUPABASE_STORAGE_BUCKETS.customerPhotos;
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function sanitizePathPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "unassigned";
}

function sanitizeFileName(value: string) {
  const safe = value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return safe || "upload";
}
