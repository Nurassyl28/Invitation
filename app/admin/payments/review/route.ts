import { NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import {
  addActionLog,
  createOrUpdateDraftInvitation,
  updateAgentStore,
  ValidationError,
} from "@/lib/agent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = stringValue(formData.get("token"));

  if (!validateAdminRequest(request, token)) {
    return Response.json({ ok: false, error: "Invalid admin token" }, { status: 401 });
  }

  const paymentId = stringValue(formData.get("payment_id")) ?? stringValue(formData.get("paymentId"));
  const decision = stringValue(formData.get("decision"));
  const reviewerNote = stringValue(formData.get("reviewer_note")) ?? stringValue(formData.get("reviewerNote"));

  if (!paymentId || (decision !== "approve" && decision !== "reject")) {
    return Response.json({ ok: false, error: "payment_id and valid decision are required" }, { status: 400 });
  }

  try {
    await updateAgentStore((store) => {
      const payment = store.payments.find((item) => item.id === paymentId);

      if (!payment) {
        throw new ValidationError("payment not found", 404);
      }

      const order = payment.orderId ? store.orders.find((item) => item.id === payment.orderId) : undefined;
      const now = new Date().toISOString();

      payment.updatedAt = now;
      payment.reviewerNote = reviewerNote;

      if (decision === "approve") {
        payment.status = "paid";

        if (order) {
          const invitation = store.invitations.find((item) => item.orderId === order.id) ?? createOrUpdateDraftInvitation(store, order.id, order.templateId);
          invitation.status = "published";
          invitation.publishedAt = invitation.publishedAt ?? now;
          invitation.updatedAt = now;
          order.status = "published";
          order.updatedAt = now;

          const conversation = store.conversations.find((item) => item.currentOrderId === order.id);
          if (conversation) {
            conversation.state = "completed";
            conversation.updatedAt = now;
            conversation.lastMessageAt = now;
          }
        }
      } else {
        payment.status = "rejected";

        if (order) {
          order.status = "waiting_payment";
          order.updatedAt = now;

          const conversation = store.conversations.find((item) => item.currentOrderId === order.id);
          if (conversation) {
            conversation.state = "waiting_payment";
            conversation.updatedAt = now;
            conversation.lastMessageAt = now;
          }
        }
      }

      addActionLog(store, `admin_payment_${decision}`, order?.id, {
        payment_id: payment.id,
        reviewer_note: reviewerNote,
      });
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ ok: false, error: error.message }, { status: error.status });
    }

    throw error;
  }

  return NextResponse.redirect(new URL(token ? `/admin?token=${encodeURIComponent(token)}` : "/admin", request.url), 303);
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
