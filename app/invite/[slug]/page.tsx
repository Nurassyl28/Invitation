import { notFound } from "next/navigation";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { invitation } from "@/lib/data";
import { findAgentInvitationBySlug, getPublicInviteData } from "@/lib/agent-store";

export const metadata = {
  title: "Приглашение — Toi Invite",
};

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storedInvitation = await findAgentInvitationBySlug(slug);
  const currentInvitation =
    storedInvitation
      ? getPublicInviteData(storedInvitation)
      : slug === invitation.slug
        ? {
            ...invitation,
            templateId: "wedding-classic-gold",
            type: invitation.type,
            names: invitation.names,
            venue: invitation.venue,
            status: "published",
            mapLink: "",
            musicUrl: "",
            heroPhotoUrl: "",
            galleryUrls: [],
            rsvpEnabled: true,
            wishesEnabled: false,
            language: "ru" as const,
          }
        : undefined;

  if (!currentInvitation) {
    notFound();
  }

  return <InvitationRenderer invite={currentInvitation} />;
}
