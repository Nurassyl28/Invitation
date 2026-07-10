import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { readJsonObject } from "@/lib/agent-http";
import { addActionLog, createOrderFromPayload, missingRequiredFields, updateAgentStore, ValidationError } from "@/lib/agent-store";

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

  try {
    const result = await updateAgentStore((store) => {
      const order = createOrderFromPayload(body.data);
      store.orders.unshift(order);
      addActionLog(store, "create_order", order.id, body.data);

      return {
        ok: true,
        order,
        missing_fields: missingRequiredFields(order.fields),
      };
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ ok: false, error: error.message }, { status: error.status });
    }

    throw error;
  }
}
