import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { getDemoInvite } from "@/lib/demo-invitations";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const demo = getDemoInvite(templateId);

  return {
    title: demo ? `${demo.type} demo — Toi` : "Demo — Toi",
  };
}

export default async function DemoInvitePage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const demo = getDemoInvite(templateId);

  if (!demo) {
    notFound();
  }

  const hasFixedTemplateNav = ["qyz-uzatu-anel", "wedding-emerald-envelope", "wedding-soft-arch"].includes(demo.templateId ?? "");

  return (
    <>
      <Link
        className={`demo-back-link ${hasFixedTemplateNav ? "invite-demo-back-link" : ""} ${demo.templateId === "qyz-uzatu-anel" ? "qyz-demo-back-link" : ""}`}
        href="/demo"
      >
        <ArrowLeft size={16} />
        Все демо
      </Link>
      <InvitationRenderer invite={demo} />
    </>
  );
}
