import { readAgentStoreSnapshot } from "@/lib/agent-store";
import { isSupabaseConfigured, SUPABASE_STORAGE_BUCKETS } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await readAgentStoreSnapshot();
  const { store } = snapshot;

  return Response.json({
    ok: true,
    service: "toi-agent-api",
    version: store.version,
    supabaseConfigured: isSupabaseConfigured(),
    storage: snapshot.storage,
    storage_error: snapshot.error,
    buckets: SUPABASE_STORAGE_BUCKETS,
    templates: store.templates.filter((template) => template.isActive).length,
    time: new Date().toISOString(),
  });
}
