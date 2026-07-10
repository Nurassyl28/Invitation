import Link from "next/link";
import { Check, RefreshCw } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { StatusBadge } from "@/components/status-badge";
import { payments, templates } from "@/lib/data";
import { readAgentStore } from "@/lib/agent-store";

export const metadata = {
  title: "Админ-панель — Toi Invite",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await readAgentStore();
  const latestOrders = store.orders.slice(0, 8);

  return (
    <div className="shell">
      <SiteNav section="Admin" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Админ-панель</span>
            <h1>Операции платформы</h1>
            <p className="page-lede">Проверка оплат, управление шаблонами, пользователями и партнёрскими кабинетами.</p>
          </div>
          <button className="button primary" type="button">
            <RefreshCw size={16} />
            Обновить
          </button>
        </section>

        <section className="admin-grid">
          <aside className="sidebar">
            <Link className="button primary" href="/admin">Оплаты</Link>
            <Link className="button secondary" href="/templates">Шаблоны</Link>
            <Link className="button secondary" href="/dashboard">Пользователи</Link>
            <Link className="button secondary" href="/builder">Создать invite</Link>
          </aside>

          <div className="app-main">
            <div className="stats-grid">
              <article className="stat-card"><span className="eyebrow">MRR</span><strong>189k ₸</strong><p>плановая выручка месяца</p></article>
              <article className="stat-card"><span className="eyebrow">Чеки</span><strong>5</strong><p>ждут проверки</p></article>
              <article className="stat-card"><span className="eyebrow">Шаблоны</span><strong>{store.templates.length}</strong><p>доступны для OpenClaw</p></article>
              <article className="stat-card"><span className="eyebrow">Agent orders</span><strong>{store.orders.length}</strong><p>созданы через API</p></article>
            </div>

            <section className="table-panel">
              <h2>OpenClaw orders</h2>
              <table>
                <thead><tr><th>Order</th><th>Клиент</th><th>Той</th><th>Статус</th><th>Ссылка</th></tr></thead>
                <tbody>
                  {latestOrders.length ? (
                    latestOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id.slice(0, 12)}</td>
                        <td>{order.customerPhone}</td>
                        <td>{order.toiType}</td>
                        <td>{order.status}</td>
                        <td>
                          {order.slug ? (
                            <Link className="small-action" href={`/invite/${order.slug}`}>
                              Preview
                            </Link>
                          ) : (
                            "Нет draft"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Пока нет заказов из OpenClaw.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            <section className="table-panel">
              <h2>Kaspi manual flow</h2>
              <table>
                <thead><tr><th>Приглашение</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Действие</th></tr></thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.invite}>
                      <td>{payment.invite}</td>
                      <td>{payment.client}</td>
                      <td>{payment.amount}</td>
                      <td><StatusBadge status={payment.status} /></td>
                      <td>
                        <button className="small-action" type="button">
                          <Check size={14} />
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="table-panel">
              <h2>Шаблоны</h2>
              <table>
                <thead><tr><th>Название</th><th>Категория</th><th>Тариф</th></tr></thead>
                <tbody>
                  {templates.length ? (
                    templates.map((template) => (
                      <tr key={template.id}>
                        <td>{template.title}</td>
                        <td>{template.category}</td>
                        <td>{template.tariff}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>Шаблоны очищены. Новые дизайны ещё не добавлены.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
