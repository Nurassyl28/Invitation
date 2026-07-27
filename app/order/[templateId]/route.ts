import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  addActionLog,
  createOrderFromPayload,
  getTariffPrice,
  updateAgentStore,
} from "@/lib/agent-store";
import { templateName, toPublicLanguage } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderStartRouteContext = {
  params: Promise<{ templateId: string }>;
};

export async function POST(request: Request, context: OrderStartRouteContext) {
  const { templateId } = await context.params;
  const language = toPublicLanguage(new URL(request.url).searchParams.get("lang"));
  const result = await updateAgentStore((store) => {
    const template = store.templates.find((item) => item.id === templateId && item.isActive);

    if (!template) {
      return { ok: false as const };
    }

    const order = createOrderFromPayload({
      phone: `lead_${randomUUID()}`,
      toi_type: template.toiType,
      template_id: template.id,
      language,
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
      templateName: templateName(template.id, language, template.name),
      templateId: template.id,
      language,
      demoUrl: `${publicBaseUrl(request)}/demo/${template.id}`,
    };
  });

  if (!result.ok) {
    return NextResponse.redirect(new URL("/demo", request.url), 303);
  }

  return NextResponse.redirect(whatsappUrl(result), 303);
}

function whatsappUrl(input: { orderId: string; templateName: string; templateId: string; demoUrl: string; language: "kz" | "ru" }) {
  const text =
    input.language === "kz"
      ? [
          "Сәлеметсіз бе! Осы үлгіге тапсырыс бергім келеді.",
          "",
          `Үлгі: ${input.templateName}`,
          `Код: ${input.templateId}`,
          `Тапсырыс нөмірі: ${input.orderId}`,
          "Тіл: Қазақша",
          `Сілтеме: ${input.demoUrl}?lang=kz`,
        ].join("\n")
      : [
          "Здравствуйте! Хочу заказать этот дизайн.",
          "",
          `Дизайн: ${input.templateName}`,
          `Код: ${input.templateId}`,
          `Номер заказа: ${input.orderId}`,
          "Язык: Русский",
          `Ссылка: ${input.demoUrl}?lang=ru`,
        ].join("\n");

  return `https://wa.me/77056648971?text=${encodeURIComponent(text)}`;
}

function publicBaseUrl(request: Request) {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/+$/, "");
}
