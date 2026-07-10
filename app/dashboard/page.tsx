import Link from "next/link";
import { Plus, Settings } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { StatusBadge } from "@/components/status-badge";
import { guestResponses, payments } from "@/lib/data";

export const metadata = {
  title: "Кабинет — Toi Invite",
};

export default function DashboardPage() {
  return (
    <div className="shell">
      <SiteNav section="Кабинет" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Личный кабинет</span>
            <h1>Приглашения и гости</h1>
            <p className="page-lede">Рабочий экран клиента: статусы приглашений, ответы гостей, оплата и быстрые действия.</p>
          </div>
          <Link className="button primary" href="/builder">
            <Plus size={16} />
            Новое приглашение
          </Link>
        </section>

        <section className="dashboard-grid">
          <aside className="sidebar">
            <Link className="button primary" href="/dashboard">Обзор</Link>
            <Link className="button secondary" href="/builder">Создать</Link>
            <Link className="button secondary" href="/templates">Шаблоны</Link>
            <Link className="button secondary" href="/login"><Settings size={16} /> Настройки</Link>
          </aside>

          <div className="app-main">
            <div className="stats-grid">
              <article className="stat-card"><span className="eyebrow">Активные</span><strong>12</strong><p>публичных приглашений</p></article>
              <article className="stat-card"><span className="eyebrow">RSVP</span><strong>312</strong><p>ответов гостей</p></article>
              <article className="stat-card"><span className="eyebrow">Оплата</span><strong>2</strong><p>чека ждут проверки</p></article>
              <article className="stat-card"><span className="eyebrow">Партнёры</span><strong>4</strong><p>аккаунта для агентств</p></article>
            </div>

            <section className="panel-row">
              <div className="table-panel">
                <h2>Оплаты</h2>
                <table>
                  <thead><tr><th>Приглашение</th><th>Сумма</th><th>Статус</th></tr></thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.invite}>
                        <td>{payment.invite}</td>
                        <td>{payment.amount}</td>
                        <td><StatusBadge status={payment.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-panel">
                <h2>RSVP</h2>
                <table>
                  <thead><tr><th>Гость</th><th>Ответ</th><th>Кол-во</th></tr></thead>
                  <tbody>
                    {guestResponses.map((guest) => (
                      <tr key={guest.name}>
                        <td>{guest.name}</td>
                        <td>{guest.answer}</td>
                        <td>{guest.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
