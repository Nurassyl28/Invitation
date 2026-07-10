import Link from "next/link";
import { ArrowRight, CalendarCheck, LayoutDashboard, MessageCircle, Music, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { TemplateCard } from "@/components/template-card";
import { templates } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="shell">
      <SiteNav />

      <main>
        <section className="hero-band">
          <div className="hero-copy">
            <span className="eyebrow">Digital invitations for Kazakh traditions</span>
            <h1>Toi</h1>
            <p>
              Премиальная платформа для мобильных приглашений на свадьбу, ұзату,
              бесік той, тұсаукесер и семейные события. Шаблон, музыка, карта,
              RSVP и публикация одной ссылкой.
            </p>
            <div className="button-row">
              <Link className="button primary" href="/builder">
                <Sparkles size={16} />
                Start creating
              </Link>
              <Link className="button secondary" href="/templates">
                View templates
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <aside className="hero-phone">
            <div className="phone-preview">
              <div className="phone-bar" />
              <div className="phone-screen">
                <span>Wedding invitation</span>
                <h2>Maral & Azamat</h2>
                <p>Құрметті қонақтар, сіздерді қуанышымызға ортақ болуға шақырамыз.</p>
                <div className="phone-meta">
                  <strong>24.08.2026</strong>
                  <strong>17:00</strong>
                </div>
                <div className="phone-location">
                  <small>Venue</small>
                  <strong>Ritz-Carlton Almaty</strong>
                </div>
                <div className="phone-rsvp">RSVP</div>
              </div>
            </div>
          </aside>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2>Стартовые шаблоны</h2>
            </div>
            <Link className="button secondary" href="/templates">
              Все шаблоны
            </Link>
          </div>
          {templates.length ? (
            <div className="template-grid">
              {templates.slice(0, 3).map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <section className="empty-state compact-empty">
              <span className="eyebrow">Reset</span>
              <h2>Шаблоны пересобираются</h2>
              <p>Старая библиотека очищена. Новые шаблоны будем добавлять по одному с правильным стилем и анимациями.</p>
            </section>
          )}
        </section>

        <section className="section">
          <div className="stats-grid">
            <article className="stat-card">
              <span className="eyebrow"><CalendarCheck size={15} /> Flow</span>
              <strong>4 steps</strong>
              <p>Выбор шаблона, заполнение, preview, публикация.</p>
            </article>
            <article className="stat-card">
              <span className="eyebrow"><MessageCircle size={15} /> Guests</span>
              <strong>RSVP</strong>
              <p>Ответы и количество гостей собираются в кабинете.</p>
            </article>
            <article className="stat-card">
              <span className="eyebrow"><Music size={15} /> Atmosphere</span>
              <strong>Music</strong>
              <p>Фото, музыка, карта и программа события в одном приглашении.</p>
            </article>
            <article className="stat-card">
              <span className="eyebrow">Партнёры</span>
              <strong>White label</strong>
              <p>Систему можно продавать агентствам как партнёрский доступ.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <Link className="button secondary" href="/dashboard">
            <LayoutDashboard size={16} />
            Войти в кабинет
          </Link>
        </section>
      </main>
    </div>
  );
}
