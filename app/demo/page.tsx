import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { getAllDemoInvites } from "@/lib/demo-invitations";

export const metadata = {
  title: "Демо шаблоны — Toi",
};

export default function DemoTemplatesPage() {
  const demos = getAllDemoInvites();

  return (
    <div className="shell demo-shell">
      <SiteNav section="Демо" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Preview library</span>
            <h1>Все шаблоны</h1>
            <p className="page-lede">
              Все демо-шаблоны в одном месте. Ссылки можно отправлять клиентам в WhatsApp.
            </p>
          </div>
          <a className="button primary" href="https://wa.me/?text=Посмотрите%20демо%20шаблоны%20приглашений">
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </section>

        {demos.length ? (
          <section className="demo-grid">
            {demos.map((demo) => (
              <article className={`demo-template-card ${demo.templateId}`} key={demo.templateId}>
                <div className="demo-template-preview">
                  <span>{demo.type}</span>
                  <strong>{demo.names}</strong>
                  <small>{demo.date}</small>
                </div>
                <div className="demo-template-body">
                  <span className="muted">{demo.templateId}</span>
                  <h2>{demo.type}</h2>
                  <p>{demo.text}</p>
                  <Link className="button primary" href={`/demo/${demo.templateId}`}>
                    <Eye size={16} />
                    Смотреть демо
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <span className="eyebrow">Reset</span>
            <h2>Шаблоны очищены</h2>
            <p>Старая библиотека удалена из показа. Следующий шаг - собрать новые шаблоны с нуля в нужном казахском стиле.</p>
          </section>
        )}
      </main>
    </div>
  );
}
