import Link from "next/link";
import { Check, RefreshCw } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import type { PaymentStatus } from "@/lib/data";
import { payments, templates } from "@/lib/data";
import { readAgentStore } from "@/lib/agent-store";

export const metadata = {
  title: "Админ-панель — Toi Invite",
};

export const dynamic = "force-dynamic";

const paymentStatusLabels: Record<PaymentStatus, string> = {
  approved: "Одобрено",
  pending: "Ожидает",
  review: "Проверка",
};

type AdminPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const token = firstParam(params.token);

  if (!(await hasAdminAccess(token))) {
    notFound();
  }

  const store = await readAgentStore();
  const latestOrders = store.orders.slice(0, 8);
  const adminHref = token ? `/admin?token=${encodeURIComponent(token)}` : "/admin";

  return (
    <div className="shell">
      <SiteNav section="Admin" />
      <main>
        <section className="page-head">
          <div>
            <span className="eyebrow">Админ-панель</span>
            <h1>Операции платформы</h1>
            <p className="page-lede">Скрытая служебная зона для OpenClaw-заказов, оплат, шаблонов и опубликованных ссылок.</p>
          </div>
          <button className="button primary" type="button">
            <RefreshCw size={16} />
            Обновить
          </button>
        </section>

        <section className="admin-grid">
          <aside className="sidebar">
            <Link className="button primary" href={adminHref}>Оплаты</Link>
            <Link className="button secondary" href="/demo">Демо</Link>
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
                      <td>
                        <span className={`status ${payment.status}`}>
                          {paymentStatusLabels[payment.status]}
                        </span>
                      </td>
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

async function hasAdminAccess(queryToken?: string) {
  const expectedToken = process.env.ADMIN_TOKEN ?? (process.env.NODE_ENV === "production" ? "" : "dev-admin-token");

  if (!expectedToken) {
    return false;
  }

  const headerList = await headers();
  const authHeader = headerList.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";
  const headerToken = headerList.get("x-admin-token")?.trim();
  const providedToken = queryToken || headerToken || bearerToken;

  return providedToken === expectedToken;
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
