import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { getDemoInvite } from "@/lib/demo-invitations";
import { copyFor, toPublicLanguage, withLanguage } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const { templateId } = await params;
  const paramsValue = await searchParams;
  const language = toPublicLanguage(Array.isArray(paramsValue.lang) ? paramsValue.lang[0] : paramsValue.lang);
  const demo = getDemoInvite(templateId, language);

  return {
    title: demo ? `${demo.type} — Toi` : "Toi",
  };
}

export default async function DemoInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const { templateId } = await params;
  const paramsValue = await searchParams;
  const language = toPublicLanguage(Array.isArray(paramsValue.lang) ? paramsValue.lang[0] : paramsValue.lang);
  const copy = copyFor(language);
  const demo = getDemoInvite(templateId, language);

  if (!demo) {
    notFound();
  }

  const hasFixedTemplateNav = ["qyz-uzatu-anel", "wedding-emerald-envelope", "wedding-classic-gold", "wedding-emerald-card", "wedding-editorial-istara", "kudalyk-gold-mobile", "besik-amanat"].includes(demo.templateId ?? "");
  const hideDemoBackLink = demo.templateId === "wedding-editorial-istara";

  return (
    <>
      {!hideDemoBackLink ? (
        <Link
          className={`demo-back-link ${hasFixedTemplateNav ? "invite-demo-back-link" : ""} ${demo.templateId === "qyz-uzatu-anel" ? "qyz-demo-back-link" : ""}`}
          href={withLanguage("/demo", language)}
        >
          <ArrowLeft size={16} />
          {copy.backToDemos as string}
        </Link>
      ) : null}
      <InvitationRenderer invite={demo} />
      <form action={`/order/${templateId}?lang=${language}`} className="demo-order-form" method="post">
        <button className="demo-order-cta" type="submit">
          {copy.orderThisDesign as string}
        </button>
      </form>
    </>
  );
}
