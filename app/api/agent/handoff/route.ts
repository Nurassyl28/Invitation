import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { readJsonObject } from "@/lib/agent-http";
import { addActionLog, updateAgentStore } from "@/lib/agent-store";

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
  const reason = stringValue(body.data.reason) ?? "manual review required";

  if (!orderId) {
    return Response.json({ ok: false, error: "order_id is required" }, { status: 400 });
  }

  const result = await updateAgentStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);

    if (!order) {
      return {
        ok: false,
        status: 404,
        error: "order not found",
      };
    }

    order.status = "handoff";
    order.handoffReason = reason;
    order.updatedAt = new Date().toISOString();
    addActionLog(store, "handoff", order.id, body.data);

    return {
      ok: true,
      status: 200,
      order,
    };
  });

  return Response.json(result, { status: result.status });
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
