import { SiteNav } from "@/components/site-nav";
import { InvitationBuilder } from "@/components/invitation-builder";

export const metadata = {
  title: "Конструктор — Toi Invite",
};

export default function BuilderPage() {
  return (
    <div className="shell">
      <SiteNav section="Конструктор" />
      <main>
        <InvitationBuilder />
      </main>
    </div>
  );
}
