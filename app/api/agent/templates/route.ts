import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { requestOrigin } from "@/lib/agent-http";
import { readAgentStore } from "@/lib/agent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = validateAgentAuth(request);

  if (!auth.ok) {
    return agentAuthErrorResponse(auth);
  }

  const store = await readAgentStore();

  return Response.json({
    ok: true,
    templates: store.templates.filter((template) => template.isActive).map((template) => ({
      ...template,
      demoUrl: `${requestOrigin(request)}/demo/${template.id}`,
    })),
  });
}
