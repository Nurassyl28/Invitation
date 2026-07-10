import { SiteNav } from "@/components/site-nav";
import { TemplateCatalog } from "@/components/template-catalog";

export const metadata = {
  title: "Шаблоны — Toi Invite",
};

export default function TemplatesPage() {
  return (
    <div className="shell">
      <SiteNav section="Каталог шаблонов" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Шаблоны</span>
            <h1>Каталог приглашений</h1>
            <p className="page-lede">
              Категории, тарифы и поиск уже работают в интерфейсе. Следующий слой - база данных и админское управление.
            </p>
          </div>
        </section>
        <TemplateCatalog />
      </main>
    </div>
  );
}
