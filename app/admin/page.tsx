import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AdminCopyButton } from "@/components/admin-copy-button";
import { SiteNav } from "@/components/site-nav";
import { adminTokenFromHeaders, isValidAdminToken } from "@/lib/admin-auth";
import { readAgentStore } from "@/lib/agent-store";
import { createSupabaseSignedObjectUrl, SUPABASE_STORAGE_BUCKETS } from "@/lib/supabase-server";

export const metadata = {
  title: "Админ-панель — Toi Invite",
};

export const dynamic = "force-dynamic";

const paymentStatusLabels = {
  pending: "Ожидает чек",
  payment_review: "Проверка",
  paid: "Оплачено",
  rejected: "Отклонено",
};

type AdminPageProps = {
  searchParams: Promise<{ token?: string | string[]; published?: string | string[] }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const token = firstParam(params.token);
  const publishedSlug = firstParam(params.published);

  if (!(await hasAdminAccess(token))) {
    notFound();
  }

  const store = await readAgentStore();
  const latestOrders = store.orders.slice(0, 12);
  const latestPayments = store.payments.slice(0, 12);
  const latestRsvpResponses = store.rsvpResponses.slice(0, 8);
  const paymentsForReview = store.payments.filter((payment) => payment.status === "pending" || payment.status === "payment_review").length;
  const adminHref = token ? `/admin?token=${encodeURIComponent(token)}` : "/admin";
  const baseUrl = publicBaseUrl();
  const receiptLinksByPaymentId = new Map(
    await Promise.all(store.payments.map(async (payment) => [payment.id, await resolveReceiptLinks(payment.receiptUrls)] as const)),
  );
  const publishedUrl = publishedSlug ? `${baseUrl}/invite/${publishedSlug}` : "";

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
          <Link className="button primary" href={adminHref}>
            <RefreshCw size={16} />
            Обновить
          </Link>
        </section>

        <section className="admin-grid">
          <aside className="sidebar">
            <Link className="button primary" href={adminHref}>Оплаты</Link>
            <Link className="button secondary" href="/demo">Демо</Link>
          </aside>

          <div className="app-main">
            {publishedUrl ? (
              <section className="admin-success-panel">
                <div>
                  <span className="eyebrow">Оплата подтверждена</span>
                  <h2>Готовая ссылка опубликована</h2>
                  <a href={publishedUrl} rel="noreferrer" target="_blank">{publishedUrl}</a>
                </div>
                <AdminCopyButton text={publishedUrl} label="Копировать ссылку" />
              </section>
            ) : null}

            <div className="stats-grid">
              <article className="stat-card"><span className="eyebrow">MVP</span><strong>12 900 ₸</strong><p>фиксированная цена заказа</p></article>
              <article className="stat-card"><span className="eyebrow">Чеки</span><strong>{paymentsForReview}</strong><p>ждут ручной проверки</p></article>
              <article className="stat-card"><span className="eyebrow">Шаблоны</span><strong>{store.templates.length}</strong><p>доступны для OpenClaw</p></article>
              <article className="stat-card"><span className="eyebrow">Agent orders</span><strong>{store.orders.length}</strong><p>созданы через API</p></article>
              <article className="stat-card"><span className="eyebrow">RSVP</span><strong>{store.rsvpResponses.length}</strong><p>ответы гостей</p></article>
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

            <section className="admin-order-cards">
              <h2>Полные карточки заказов</h2>
              {latestOrders.length ? (
                latestOrders.map((order) => {
                  const template = store.templates.find((item) => item.id === order.templateId);
                  const invitation = store.invitations.find((item) => item.orderId === order.id);
                  const orderPayments = store.payments.filter((item) => item.orderId === order.id);
                  const rsvpResponses = invitation
                    ? store.rsvpResponses.filter((item) => item.invitationId === invitation.id)
                    : [];
                  const inviteUrl = invitation ? `${baseUrl}/invite/${invitation.slug}` : "";
                  const photos = [order.fields.heroPhotoUrl, ...(order.fields.galleryUrls ?? [])].filter((item): item is string => Boolean(item));

                  return (
                    <article className="admin-order-card" key={order.id}>
                      <div className="admin-order-card-head">
                        <div>
                          <span className="eyebrow">{order.id}</span>
                          <h3>{order.fields.hostNames ?? "Без имён"}</h3>
                          <p>{order.toiType} · {template?.name ?? order.templateId ?? "шаблон не выбран"}</p>
                        </div>
                        <span className={`status ${order.status}`}>{order.status}</span>
                      </div>

                      {inviteUrl ? (
                        <div className="admin-copy-row">
                          <a href={inviteUrl} rel="noreferrer" target="_blank">{inviteUrl}</a>
                          <AdminCopyButton text={inviteUrl} label="Копировать" />
                        </div>
                      ) : null}

                      <dl className="admin-fields-grid">
                        <div><dt>Клиент</dt><dd>{order.customerName ?? "-"} · {order.customerPhone}</dd></div>
                        <div><dt>Язык</dt><dd>{order.language}</dd></div>
                        <div><dt>Дата</dt><dd>{order.fields.date ?? "-"}</dd></div>
                        <div><dt>Время</dt><dd>{order.fields.time ?? "-"}</dd></div>
                        <div><dt>Зал</dt><dd>{order.fields.venueName ?? "-"}</dd></div>
                        <div><dt>Адрес</dt><dd>{order.fields.address ?? order.fields.mapLink ?? "-"}</dd></div>
                        <div><dt>Родители</dt><dd>{order.fields.parentsNames ?? "-"}</dd></div>
                        <div><dt>Контакт</dt><dd>{order.fields.contactPhone ?? order.fields.whatsappPhone ?? "-"}</dd></div>
                        <div><dt>Dress code</dt><dd>{order.fields.dressCode ?? "-"}</dd></div>
                        <div><dt>Цена</dt><dd>{formatPrice(order.price)}</dd></div>
                      </dl>

                      {order.fields.customText ? (
                        <div className="admin-note-block">
                          <span>Текст приглашения</span>
                          <p>{order.fields.customText}</p>
                        </div>
                      ) : null}

                      {order.fields.programItems?.length ? (
                        <div className="admin-note-block">
                          <span>Программа</span>
                          <p>{order.fields.programItems.join(" · ")}</p>
                        </div>
                      ) : null}

                      <div className="admin-media-grid">
                        <section>
                          <h4>Фото</h4>
                          {photos.length ? (
                            <div className="admin-photo-list">
                              {photos.slice(0, 6).map((photo) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <a href={photo} key={photo} rel="noreferrer" target="_blank"><img src={photo} alt="" /></a>
                              ))}
                            </div>
                          ) : (
                            <p>Фото не загружены</p>
                          )}
                        </section>

                        <section>
                          <h4>Музыка</h4>
                          {order.fields.musicUrl ? (
                            <div className="admin-audio-box">
                              <audio controls preload="metadata" src={order.fields.musicUrl} />
                              <a href={order.fields.musicUrl} rel="noreferrer" target="_blank">Открыть файл</a>
                            </div>
                          ) : (
                            <p>Музыка не загружена</p>
                          )}
                        </section>
                      </div>

                      <div className="admin-media-grid">
                        <section>
                          <h4>Чеки</h4>
                          {orderPayments.length ? (
                            <div className="admin-link-list">
                              {orderPayments.map((payment) => {
                                const receiptLinks = receiptLinksByPaymentId.get(payment.id) ?? [];

                                return (
                                  <div key={payment.id}>
                                    <span className={`status ${payment.status}`}>{paymentStatusLabels[payment.status]}</span>
                                    {receiptLinks.length ? (
                                      receiptLinks.map((receipt, index) => (
                                        <a href={receipt.href} key={`${payment.id}-${receipt.raw}-${index}`} rel="noreferrer" target="_blank">
                                          Чек {index + 1}
                                        </a>
                                      ))
                                    ) : (
                                      <p>Нет ссылки на чек</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p>Оплаты нет</p>
                          )}
                        </section>

                        <section>
                          <h4>RSVP</h4>
                          {rsvpResponses.length ? (
                            <div className="admin-rsvp-list">
                              {rsvpResponses.slice(0, 6).map((response) => (
                                <p key={response.id}>
                                  <strong>{response.guestName}</strong> · {response.answer} · {response.guestCount} гостей
                                  {response.comment ? ` · ${response.comment}` : ""}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p>Ответов гостей пока нет</p>
                          )}
                        </section>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p>Пока нет заказов.</p>
              )}
            </section>

            <section className="table-panel">
              <h2>Kaspi manual flow</h2>
              <table>
                <thead><tr><th>Приглашение</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Действие</th></tr></thead>
                <tbody>
                  {latestPayments.length ? (
                    latestPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.invitationId ?? payment.orderId ?? payment.id.slice(0, 12)}</td>
                        <td>{payment.customerPhone ?? "-"}</td>
                        <td>{formatPrice(payment.amount)}</td>
                        <td>
                          <span className={`status ${payment.status}`}>
                            {paymentStatusLabels[payment.status]}
                          </span>
                        </td>
                        <td>
                          {(receiptLinksByPaymentId.get(payment.id) ?? [])[0] ? (
                            <a className="small-action" href={(receiptLinksByPaymentId.get(payment.id) ?? [])[0].href} rel="noreferrer" target="_blank">
                              Открыть чек
                            </a>
                          ) : (
                            "Нет чека"
                          )}
                          <form action="/admin/payments/review" className="admin-inline-form" method="post">
                            <input name="payment_id" type="hidden" value={payment.id} />
                            <input name="decision" type="hidden" value="approve" />
                            {token ? <input name="token" type="hidden" value={token} /> : null}
                            <button className="small-action" disabled={payment.status === "paid"} type="submit">
                              Approve
                            </button>
                          </form>
                          <form action="/admin/payments/review" className="admin-inline-form" method="post">
                            <input name="payment_id" type="hidden" value={payment.id} />
                            <input name="decision" type="hidden" value="reject" />
                            {token ? <input name="token" type="hidden" value={token} /> : null}
                            <button className="small-action danger" disabled={payment.status === "rejected"} type="submit">
                              Reject
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>Пока нет чеков на проверку.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            <section className="table-panel">
              <h2>RSVP responses</h2>
              <table>
                <thead><tr><th>Гость</th><th>Ответ</th><th>Кол-во</th><th>Приглашение</th><th>Комментарий</th></tr></thead>
                <tbody>
                  {latestRsvpResponses.length ? (
                    latestRsvpResponses.map((response) => {
                      const invitation = store.invitations.find((item) => item.id === response.invitationId);

                      return (
                        <tr key={response.id}>
                          <td>{response.guestName}</td>
                          <td>{response.answer}</td>
                          <td>{response.guestCount}</td>
                          <td>
                            {invitation ? (
                              <Link className="small-action" href={`/invite/${invitation.slug}`}>
                                {invitation.slug}
                              </Link>
                            ) : (
                              response.invitationId.slice(0, 12)
                            )}
                          </td>
                          <td>{response.comment ?? "-"}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>Пока нет ответов гостей.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            <section className="table-panel">
              <h2>Шаблоны</h2>
              <table>
                <thead><tr><th>Название</th><th>Категория</th><th>Тариф</th></tr></thead>
                <tbody>
                  {store.templates.length ? (
                    store.templates.map((template) => (
                      <tr key={template.id}>
                        <td>{template.name}</td>
                        <td>{template.toiType}</td>
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
  const headerList = await headers();
  return isValidAdminToken(queryToken || adminTokenFromHeaders(headerList));
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-KZ").format(price) + " ₸";
}

function publicBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://dellover.live").replace(/\/+$/, "");
}

async function resolveReceiptLinks(receiptUrls: string[]) {
  return Promise.all(
    receiptUrls.map(async (raw) => {
      const storageObject = parseStorageObject(raw);

      if (storageObject?.bucket === SUPABASE_STORAGE_BUCKETS.paymentReceipts) {
        try {
          return {
            raw,
            href: await createSupabaseSignedObjectUrl(storageObject.bucket, storageObject.path, 3600),
          };
        } catch (error) {
          console.error("Admin receipt signed URL failed", error);
        }
      }

      return {
        raw,
        href: raw,
      };
    }),
  );
}

function parseStorageObject(value: string) {
  if (value.startsWith("storage://")) {
    const withoutProtocol = value.replace(/^storage:\/\//, "");
    const [bucket, ...pathParts] = withoutProtocol.split("/");
    const objectPath = pathParts.join("/");

    if (bucket && objectPath) {
      return { bucket, path: objectPath };
    }
  }

  if (value.startsWith(`${SUPABASE_STORAGE_BUCKETS.paymentReceipts}/`)) {
    return {
      bucket: SUPABASE_STORAGE_BUCKETS.paymentReceipts,
      path: value.slice(`${SUPABASE_STORAGE_BUCKETS.paymentReceipts}/`.length),
    };
  }

  return undefined;
}
