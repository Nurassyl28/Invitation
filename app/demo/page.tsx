import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { getAllDemoInvites } from "@/lib/demo-invitations";
import { MVP_FIXED_PRICE } from "@/lib/data";

export const metadata = {
  title: "Демо шаблоны — Toi",
};

type DemoTemplatesPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function DemoTemplatesPage({ searchParams }: DemoTemplatesPageProps) {
  const params = await searchParams;
  const selectedType = selectedValue(params.type);
  const demos = getAllDemoInvites();
  const categories = Array.from(new Set(demos.map((demo) => demo.type)));
  const filteredDemos = selectedType ? demos.filter((demo) => demo.type === selectedType) : demos;
  const formattedPrice = new Intl.NumberFormat("ru-KZ").format(MVP_FIXED_PRICE);

  return (
    <div className="shell demo-shell">
      <SiteNav section="Демо" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Каталог MVP</span>
            <h1>Дизайны приглашений</h1>
            <p className="page-lede">
              Выберите тип тоя, откройте дизайн и отправьте клиенту ссылку. Сейчас в запуске только 6 готовых дизайнов и фиксированная цена {formattedPrice} ₸.
            </p>
          </div>
          <a className="button primary" href="https://wa.me/?text=Посмотрите%20демо%20шаблоны%20приглашений">
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </section>

        {categories.length ? (
          <section className="demo-category-panel" aria-label="Фильтр по типу тоя">
            <div>
              <span className="eyebrow">Тип тоя</span>
              <h2>Показать дизайны по категории</h2>
            </div>
            <div className="demo-category-list">
              <Link className={`demo-category-chip ${!selectedType ? "is-active" : ""}`} href="/demo">
                Все
                <span>{demos.length}</span>
              </Link>
              {categories.map((category) => (
                <Link
                  aria-current={selectedType === category ? "page" : undefined}
                  className={`demo-category-chip ${selectedType === category ? "is-active" : ""}`}
                  href={`/demo?type=${encodeURIComponent(category)}`}
                  key={category}
                >
                  {category}
                  <span>{demos.filter((demo) => demo.type === category).length}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {filteredDemos.length ? (
          <section className="demo-grid">
            {filteredDemos.map((demo) => (
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
                    Посмотреть
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

function selectedValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
