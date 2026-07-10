import { readAgentStore } from "@/lib/agent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readAgentStore();

  return Response.json({
    ok: true,
    service: "toi-agent-api",
    version: store.version,
    templates: store.templates.filter((template) => template.isActive).length,
    time: new Date().toISOString(),
  });
}
