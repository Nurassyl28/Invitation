import Link from "next/link";
import { Eye, MessageCircle } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { getAllDemoInvites } from "@/lib/demo-invitations";
import { MVP_FIXED_PRICE } from "@/lib/data";
import { copyFor, eventTypeLabel, languageNames, toPublicLanguage, withLanguage } from "@/lib/i18n";

export const metadata = {
  title: "Toi",
};

type DemoTemplatesPageProps = {
  searchParams: Promise<{ type?: string | string[]; lang?: string | string[] }>;
};

export default async function DemoTemplatesPage({ searchParams }: DemoTemplatesPageProps) {
  const params = await searchParams;
  const language = toPublicLanguage(selectedValue(params.lang));
  const copy = copyFor(language);
  const selectedType = selectedValue(params.type);
  const demos = getAllDemoInvites(language);
  const categories = Array.from(new Set(demos.map((demo) => demo.type)));
  const filteredDemos = selectedType ? demos.filter((demo) => demo.type === selectedType) : demos;
  const formattedPrice = new Intl.NumberFormat("ru-KZ").format(MVP_FIXED_PRICE);
  const otherLanguage = language === "kz" ? "ru" : "kz";

  return (
    <div className="shell demo-shell">
      <SiteNav language={language} section={copy.navDemo as string} />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">{copy.demoEyebrow as string}</span>
            <h1>{copy.demoTitle as string}</h1>
            <p className="page-lede">
              {(copy.demoLead as (price: string) => string)(formattedPrice)}
            </p>
          </div>
          <div className="demo-head-actions">
            <a className="button secondary" href={withLanguage("/demo", otherLanguage)}>
              {languageNames[otherLanguage]}
            </a>
            <a className="button primary" href={`https://wa.me/?text=${encodeURIComponent(copy.demoWhatsappText as string)}`}>
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </section>

        {categories.length ? (
          <section className="demo-category-panel" aria-label={copy.demoFilterAria as string}>
            <div>
              <span className="eyebrow">{copy.eventType as string}</span>
              <h2>{copy.showByCategory as string}</h2>
            </div>
            <div className="demo-category-list">
              <Link className={`demo-category-chip ${!selectedType ? "is-active" : ""}`} href={withLanguage("/demo", language)}>
                {copy.all as string}
                <span>{demos.length}</span>
              </Link>
              {categories.map((category) => (
                <Link
                  aria-current={selectedType === category ? "page" : undefined}
                  className={`demo-category-chip ${selectedType === category ? "is-active" : ""}`}
                  href={`/demo?lang=${language}&type=${encodeURIComponent(category)}`}
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
                <div className={`demo-template-preview ${demo.previewImage ? "has-image" : ""}`}>
                  {demo.previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={demo.previewImage} alt={`${demo.type} ${demo.names}`} />
                  ) : null}
                  <span>{demo.type}</span>
                  <strong>{demo.names}</strong>
                  <small>{eventTypeLabel(demo.type, language)}</small>
                </div>
                <div className="demo-template-body">
                  <span className="muted">{demo.templateId}</span>
                  <h2>{demo.type}</h2>
                  <p>{demo.text}</p>
                  <Link className="button primary" href={withLanguage(`/demo/${demo.templateId}`, language)}>
                    <Eye size={16} />
                    {copy.view as string}
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <span className="eyebrow">{copy.emptyEyebrow as string}</span>
            <h2>{copy.emptyTitle as string}</h2>
            <p>{copy.emptyText as string}</p>
          </section>
        )}
      </main>
    </div>
  );
}

function selectedValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
