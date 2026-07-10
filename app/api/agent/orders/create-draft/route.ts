import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { readJsonObject, requestOrigin } from "@/lib/agent-http";
import { createOrUpdateDraftInvitation, getPublicInviteData, missingRequiredFields, updateAgentStore, ValidationError } from "@/lib/agent-store";

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

  try {
    const result = await updateAgentStore((store) => {
      const invitation = createOrUpdateDraftInvitation(
        store,
        orderId,
        stringValue(body.data.template_id) ?? stringValue(body.data.templateId),
        stringValue(body.data.custom_slug) ?? stringValue(body.data.customSlug),
      );
      const order = store.orders.find((item) => item.id === orderId);
      const publicData = getPublicInviteData(invitation);

      return {
        ok: true,
        order,
        invitation,
        public_preview: publicData,
        missing_fields: missingRequiredFields(invitation),
        draft_url: `${requestOrigin(request)}/invite/${invitation.slug}`,
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

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
