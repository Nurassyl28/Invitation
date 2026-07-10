import Link from "next/link";
import { BadgeCheck, Building2, Palette, Users } from "lucide-react";
import { SiteNav } from "@/components/site-nav";

export const metadata = {
  title: "Партнёрам — Toi",
};

export default function PartnersPage() {
  return (
    <div className="shell">
      <SiteNav section="Партнёрская система" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Reseller / White label</span>
            <h1>Продавайте приглашения под своим брендом</h1>
            <p className="page-lede">
              Организатор, ведущий, декоратор или агентство получает кабинет, создаёт
              приглашения для своих клиентов и продаёт услугу самостоятельно. Платформа,
              шаблоны, хостинг и обновления остаются на нашей стороне.
            </p>
          </div>
          <Link className="button primary" href="/login">
            Запросить доступ
          </Link>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <span className="eyebrow"><Users size={15} /> Clients</span>
            <strong>Multi-client</strong>
            <p>Партнёр создаёт отдельные приглашения для разных клиентов.</p>
          </article>
          <article className="stat-card">
            <span className="eyebrow"><Palette size={15} /> Brand</span>
            <strong>White label</strong>
            <p>Логотип, цвета и контакты партнёра можно показывать клиентам.</p>
          </article>
          <article className="stat-card">
            <span className="eyebrow"><Building2 size={15} /> Agency</span>
            <strong>Dashboard</strong>
            <p>Кабинет для менеджеров, заказов, оплат и RSVP.</p>
          </article>
          <article className="stat-card">
            <span className="eyebrow"><BadgeCheck size={15} /> Control</span>
            <strong>SaaS</strong>
            <p>Исходный код не продаётся. Продаётся доступ к системе.</p>
          </article>
        </section>

        <section className="section">
          <div className="panel">
            <h2>Как это работает</h2>
            <p>1. Мы создаём партнёрский аккаунт и тариф.</p>
            <p>2. Партнёр создаёт приглашения для клиентов через `/dashboard`.</p>
            <p>3. Клиент получает ссылку вида `/invite/client-slug`.</p>
            <p>4. Партнёр берёт оплату у клиента, а платформе платит подписку или процент.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
