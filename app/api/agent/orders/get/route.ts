import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { readJsonObject } from "@/lib/agent-http";
import { readAgentStore } from "@/lib/agent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = validateAgentAuth(request);

  if (!auth.ok) {
    return agentAuthErrorResponse(auth);
  }

  const body = await readJsonObject(request);

  if (!body.ok) {
    return body.response;
  }

  const orderId = stringValue(body.data.order_id) ?? stringValue(body.data.orderId);

  if (!orderId) {
    return Response.json({ ok: false, error: "order_id is required" }, { status: 400 });
  }

  const store = await readAgentStore();
  const order = store.orders.find((item) => item.id === orderId);

  if (!order) {
    return Response.json({ ok: false, error: "order not found" }, { status: 404 });
  }

  const invitation = store.invitations.find((item) => item.orderId === order.id);

  return Response.json({
    ok: true,
    order,
    invitation,
  });
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
