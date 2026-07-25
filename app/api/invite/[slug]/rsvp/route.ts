import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  addActionLog,
  normalizeGuestCount,
  normalizeRsvpAnswer,
  updateAgentStore,
} from "@/lib/agent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RsvpRouteContext) {
  const { slug } = await context.params;
  const formData = await request.formData();
  const guestName = stringValue(formData.get("guest_name"));
  const phone = stringValue(formData.get("phone"));
  const comment = stringValue(formData.get("comment"));
  const answer = normalizeRsvpAnswer(formData.get("answer"));
  const guestCount = normalizeGuestCount(formData.get("guest_count"));

  if (slug.startsWith("demo-")) {
    return NextResponse.redirect(demoRedirectUrl(request, slug), 303);
  }

  if (!guestName) {
    return NextResponse.redirect(inviteRedirectUrl(request, slug, "missing_name"), 303);
  }

  const result = await updateAgentStore((store) => {
    const invitation = store.invitations.find((item) => item.slug === slug && item.status === "published");

    if (!invitation) {
      return { ok: false as const, reason: "not_found" };
    }

    const response = {
      id: `rsvp_${randomUUID()}`,
      invitationId: invitation.id,
      guestName,
      phone,
      answer,
      guestCount,
      comment,
      createdAt: new Date().toISOString(),
    };

    store.rsvpResponses.unshift(response);
    addActionLog(store, "guest_rsvp_submitted", invitation.orderId, {
      invitation_id: invitation.id,
      slug,
      guest_name: guestName,
      answer,
      guest_count: guestCount,
    });

    return { ok: true as const };
  });

  return NextResponse.redirect(inviteRedirectUrl(request, slug, result.ok ? "ok" : result.reason), 303);
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function inviteRedirectUrl(request: Request, slug: string, status: string) {
  return new URL(`/invite/${encodeURIComponent(slug)}?rsvp=${encodeURIComponent(status)}#rsvp`, publicBaseUrl(request));
}

function demoRedirectUrl(request: Request, slug: string) {
  const templateId = slug.replace(/^demo-/, "");
  return new URL(`/demo/${encodeURIComponent(templateId)}?rsvp=demo#rsvp`, publicBaseUrl(request));
}

function publicBaseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL;

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}
