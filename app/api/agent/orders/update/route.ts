import { agentAuthErrorResponse, validateAgentAuth } from "@/lib/agent-auth";
import { readJsonObject } from "@/lib/agent-http";
import {
  addActionLog,
  getTariffPrice,
  mergeInvitationFields,
  missingRequiredFields,
  normalizeInvitationFields,
  normalizeLanguage,
  normalizeOrderStatus,
  normalizeTariff,
  updateAgentStore,
} from "@/lib/agent-store";

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

  const result = await updateAgentStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);

    if (!order) {
      return {
        ok: false,
        status: 404,
        error: "order not found",
      };
    }

    const fieldUpdate = singleFieldUpdate(body.data);
    const fieldsSource = objectValue(body.data.fields);
    const normalizedFields = normalizeInvitationFields({
      ...body.data,
      ...fieldsSource,
      ...fieldUpdate,
    });

    order.fields = mergeInvitationFields(order.fields, normalizedFields);

    const status = normalizeOrderStatus(body.data.status);

    if (status) {
      order.status = status;
    }

    if (body.data.language) {
      order.language = normalizeLanguage(body.data.language);
    }

    if (body.data.tariff) {
      const tariff = normalizeTariff(body.data.tariff);
      order.tariff = tariff;
      order.price = getTariffPrice(tariff);
    }

    const templateId = stringValue(body.data.template_id) ?? stringValue(body.data.templateId);

    if (templateId) {
      order.templateId = templateId;
    }

    order.updatedAt = new Date().toISOString();
    addActionLog(store, "update_order", order.id, body.data);

    return {
      ok: true,
      status: 200,
      order,
      missing_fields: missingRequiredFields(order.fields),
    };
  });

  return Response.json(result, { status: result.status });
}

function singleFieldUpdate(input: Record<string, unknown>) {
  const field = stringValue(input.field);

  if (!field || !("value" in input)) {
    return {};
  }

  return {
    [field]: input.value,
  };
}

function objectValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
