import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  addActionLog,
  createOrderFromPayload,
  getTariffPrice,
  updateAgentStore,
} from "@/lib/agent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderStartRouteContext = {
  params: Promise<{ templateId: string }>;
};

export async function POST(request: Request, context: OrderStartRouteContext) {
  const { templateId } = await context.params;
  const result = await updateAgentStore((store) => {
    const template = store.templates.find((item) => item.id === templateId && item.isActive);

    if (!template) {
      return { ok: false as const };
    }

    const order = createOrderFromPayload({
      phone: `lead_${randomUUID()}`,
      toi_type: template.toiType,
      template_id: template.id,
      language: "kz_ru",
      tariff: "fixed",
    });

    order.source = "whatsapp";
    order.templateId = template.id;
    order.price = getTariffPrice("fixed");
    order.fields.rsvpEnabled = true;
    order.fields.wishesEnabled = true;
    store.orders.unshift(order);
    addActionLog(store, "demo_order_cta_clicked", order.id, {
      template_id: template.id,
      demo_url: `${publicBaseUrl(request)}/demo/${template.id}`,
    });

    return {
      ok: true as const,
      orderId: order.id,
      templateName: template.name,
      templateId: template.id,
      demoUrl: `${publicBaseUrl(request)}/demo/${template.id}`,
    };
  });

  if (!result.ok) {
    return NextResponse.redirect(new URL("/demo", request.url), 303);
  }

  return NextResponse.redirect(whatsappUrl(result), 303);
}

function whatsappUrl(input: { orderId: string; templateName: string; templateId: string; demoUrl: string }) {
  const text = [
    "Сәлеметсіз бе! Осы дизайнға тапсырыс бергім келеді.",
    "",
    `Дизайн: ${input.templateName}`,
    `Коды: ${input.templateId}`,
    `Тапсырыс ID: ${input.orderId}`,
    `Сілтеме: ${input.demoUrl}`,
  ].join("\n");

  return `https://wa.me/77056648971?text=${encodeURIComponent(text)}`;
}

function publicBaseUrl(request: Request) {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/+$/, "");
}
