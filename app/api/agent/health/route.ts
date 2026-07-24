import { readAgentStore } from "@/lib/agent-store";
import { isSupabaseConfigured, SUPABASE_STORAGE_BUCKETS } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readAgentStore();

  return Response.json({
    ok: true,
    service: "toi-agent-api",
    version: store.version,
    storage: isSupabaseConfigured() ? "supabase" : "dev-json",
    buckets: SUPABASE_STORAGE_BUCKETS,
    templates: store.templates.filter((template) => template.isActive).length,
    time: new Date().toISOString(),
  });
}
