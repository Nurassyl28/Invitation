# Toi WhatsApp MVP plan v2: OpenClaw-assisted invitation factory

## 1. New direction

Мы меняем продуктовую логику.

Старый план:
- публичный сайт с конструктором;
- клиент сам заполняет формы;
- много UI до первой продажи.

Новый план:
- клиент пишет в WhatsApp;
- AI/оператор собирает данные;
- backend создает web-приглашение из готового шаблона;
- админ проверяет, принимает оплату и публикует;
- клиент получает ссылку и отправляет гостям.

Главная формула:

```text
WhatsApp = интерфейс заказа
OpenClaw/AI = помощник оператора и сборщик данных
Next.js backend = система заказов и приглашений
Admin panel = контроль, оплата, публикация
Public invite page = готовое приглашение для гостей
```

Продукт не нужно продавать как "конструктор сайтов".

Правильное позиционирование:

```text
Напишите в WhatsApp, и мы сделаем красивое онлайн-приглашение на той.
```

## 2. What OpenClaw does and does not do

OpenClaw в нашем плане не заменяет весь backend.

OpenClaw подходит для:
- приема сообщений от клиента в WhatsApp/Telegram;
- ведения диалога по сценарию;
- извлечения данных из сообщений;
- вызова наших API;
- уведомления админа;
- помощи оператору быстро собрать заказ;
- автоматизации повторяющихся задач.

OpenClaw не должен:
- хранить главную базу заказов;
- сам принимать решение о скидках;
- публиковать неоплаченные приглашения;
- иметь полный доступ к production-серверу;
- менять код проекта без подтверждения;
- быть единственной критичной точкой системы.

Практическое решение:
- для пилота можно использовать OpenClaw как быстрый WhatsApp/операторский слой;
- для стабильного production лучше оставить возможность перейти на Meta WhatsApp Cloud API;
- бизнес-логика должна жить в нашем backend, а не внутри OpenClaw prompt.

Technical note:
- OpenClaw описывает себя как self-hosted gateway для AI-агентов через разные chat apps.
- WhatsApp channel у OpenClaw работает через WhatsApp Web/Baileys, поэтому для быстрого пилота это удобно, но для долгосрочного production нужно держать запасной официальный путь через Meta WhatsApp Cloud API.
- References:
  - https://docs.openclaw.ai/
  - https://docs.openclaw.ai/channels/whatsapp

## 3. Product roles

### Customer

Клиент:
- пишет в WhatsApp;
- выбирает тип тоя;
- отправляет имена, дату, ресторан, фото, музыку;
- смотрит draft-ссылку;
- оплачивает;
- получает final-ссылку.

### Guest

Гость:
- открывает публичную ссылку;
- смотрит приглашение;
- открывает карту;
- подтверждает участие через RSVP;
- может оставить пожелание.

### Admin

Админ:
- видит новые заказы;
- проверяет данные;
- редактирует invitation;
- подтверждает оплату;
- публикует или снимает публикацию;
- смотрит RSVP.

### Partner / Agency

Партнер:
- продает приглашения своим клиентам;
- работает под своим брендом;
- создает заказы для разных клиентов;
- получает отдельный кабинет позже, после MVP.

В MVP партнерская модель должна быть заложена в базе данных, но не обязательно полностью реализована в UI.

## 4. MVP scope

В MVP входит:
- Next.js app.
- PostgreSQL database.
- Prisma schema.
- Public invitation page by slug.
- Admin panel для заказов.
- 3-6 готовых template components.
- Manual order creation from admin.
- WhatsApp/OpenClaw-assisted order intake.
- RSVP form.
- Manual payment status.
- Draft/public status logic.

В MVP не входит:
- drag-and-drop editor;
- полный self-service constructor;
- автоматический Kaspi Pay;
- сложная аналитика;
- custom domains;
- полноценный white-label кабинет;
- генерация уникального дизайна AI на каждый заказ;
- marketplace шаблонов.

## 5. Start categories

Начинаем с 6 категорий:
- Свадьба
- Қыз ұзату
- Бесік той
- Тұсаукесер
- Сүндет той
- Юбилей / мерейтой

Стартовый набор:
- 2-3 шаблона на категорию;
- всего 12-18 шаблонов;
- каждый шаблон является React component, а не картинкой.

## 6. Tariffs for first sales

### Lite — 4 990 ₸

Входит:
- 1 готовый шаблон;
- имена;
- дата и время;
- ресторан/адрес;
- кнопка карты;
- базовый RSVP;
- ссылка вида `/invite/name-name`.

### Standard — 8 990 ₸

Входит:
- все из Lite;
- музыка;
- фото;
- программа мероприятия;
- красивый текст;
- 2 языка: kaz/ru.

### Premium — 12 900 ₸

Входит:
- все из Standard;
- wish wall;
- private/password mode;
- красивый custom slug;
- приоритетная правка.

### Custom — от 20 000 ₸

Входит:
- индивидуальный дизайн;
- нестандартные блоки;
- срочная работа;
- ручная работа дизайнера/разработчика.

## 7. WhatsApp order flow

### Step 1: first message

Клиент пишет:

```text
Салем, хочу приглашение на той
```

AI/оператор отвечает:

```text
Салем! Какой той делаем?
1. Свадьба
2. Қыз ұзату
3. Бесік той
4. Тұсаукесер
5. Сүндет той
6. Юбилей
```

### Step 2: collect required data

Обязательные поля:
- тип тоя;
- имена главных людей;
- дата;
- время;
- город;
- ресторан/зал;
- адрес;
- 2GIS или Google Maps link;
- контактный номер;
- язык: kz, ru, kz+ru;
- выбранный тариф;
- выбранный шаблон.

Опциональные поля:
- фото;
- музыка;
- программа;
- dress code;
- пожелания гостям;
- password/private access.

### Step 3: template selection

AI/оператор отправляет:
- 3 preview-картинки;
- короткое описание стиля;
- цену тарифа.

Пример:

```text
Выберите стиль:
1. Classic gold
2. Modern emerald
3. Luxury saukele
```

### Step 4: backend creates draft

OpenClaw или админ вызывает backend endpoint:

```text
POST /api/orders
POST /api/invitations
```

Система создает draft:

```text
/invite/aida-erlan-draft
```

Статус:

```text
draft
```

### Step 5: customer approves draft

AI/оператор отправляет:

```text
Проверьте приглашение: https://domain.kz/invite/aida-erlan-draft
Если все правильно, напишите "ок".
```

Если клиент просит правку:
- OpenClaw собирает правку;
- backend обновляет invitation;
- админ может проверить вручную.

### Step 6: payment

MVP payment:
- Kaspi номер или QR отправляется вручную;
- клиент отправляет чек;
- админ проверяет чек;
- админ ставит payment status `approved`.

После оплаты:

```text
order.status = paid
invitation.status = published
```

### Step 7: final link

AI/оператор отправляет:

```text
Готово. Ваша ссылка:
https://domain.kz/invite/aida-erlan

Можете отправить гостям в WhatsApp.
```

## 8. Core data model

### users

```text
id
phone
name
email
role: customer/admin/partner
created_at
```

### partners

```text
id
user_id
brand_name
plan: starter/agency/white_label
monthly_limit
custom_logo_url
custom_domain
status
created_at
```

### conversations

```text
id
user_id
channel: whatsapp/telegram/manual
external_chat_id
state
last_message_at
created_at
```

### orders

```text
id
user_id
partner_id
conversation_id
status: new/collecting/draft/waiting_approval/waiting_payment/paid/published/cancelled/handoff
toi_type
tariff
template_id
slug
price
language
source: openclaw/whatsapp/admin/manual
created_at
updated_at
```

### invitations

```text
id
order_id
template_id
slug
status: draft/published/archived
title
host_names
parents_names
date
time
venue_name
address
map_link
contact_phone
whatsapp_phone
music_url
hero_photo_url
gallery_urls
custom_text
program_items
dress_code
privacy_mode
password_hash
language
published_at
created_at
updated_at
```

### templates

```text
id
toi_type
name
style: classic/modern/luxury/minimal
tariff: lite/standard/premium/custom
preview_image
component_key
is_active
created_at
```

### rsvp_responses

```text
id
invitation_id
guest_name
phone
answer: yes/no/maybe
guest_count
comment
created_at
```

### payments

```text
id
order_id
amount
method: kaspi_manual/card/manual
status: pending/approved/rejected
receipt_url
admin_comment
created_at
updated_at
```

### media_assets

```text
id
order_id
invitation_id
type: photo/music/video/receipt
url
storage_key
created_at
```

## 9. Backend modules

### Order API

Endpoints:

```text
POST /api/orders
GET /api/orders
GET /api/orders/:id
PATCH /api/orders/:id
POST /api/orders/:id/publish
POST /api/orders/:id/mark-paid
```

### Invitation API

Endpoints:

```text
POST /api/invitations
GET /api/invitations/:slug
PATCH /api/invitations/:id
POST /api/invitations/:id/rsvp
```

### OpenClaw bridge API

This is the safe boundary between OpenClaw and our product.

Endpoints:

```text
POST /api/agent/orders/create
POST /api/agent/orders/update
POST /api/agent/orders/create-draft
POST /api/agent/orders/send-preview
POST /api/agent/handoff
```

Rules:
- use API key for OpenClaw bridge;
- validate every input with zod;
- never expose admin-only endpoints directly;
- log every agent action;
- require admin approval for publish and payment.

### Admin panel

MVP pages:
- orders list;
- order detail;
- edit invitation fields;
- templates list;
- payment approval;
- RSVP responses.

### Public renderer

Responsibilities:
- render `/invite/[slug]`;
- block unpublished invitations;
- render selected template component;
- show map, music, gallery, RSVP;
- mobile-first layout.

## 10. OpenClaw integration design

OpenClaw should call our backend tools, not edit the database directly.

### Tool: create_order

Input:

```json
{
  "phone": "+77000000000",
  "toi_type": "wedding",
  "language": "kz_ru",
  "tariff": "standard"
}
```

Output:

```json
{
  "order_id": "ord_123",
  "status": "collecting"
}
```

### Tool: update_order_field

Input:

```json
{
  "order_id": "ord_123",
  "field": "venue_name",
  "value": "Royal Hall"
}
```

### Tool: create_draft_invitation

Input:

```json
{
  "order_id": "ord_123",
  "template_id": "tpl_luxury_01"
}
```

Output:

```json
{
  "draft_url": "https://domain.kz/invite/aida-erlan-draft"
}
```

### Tool: handoff_to_admin

Use when:
- клиент просит скидку;
- клиент хочет custom design;
- данные непонятные;
- клиент недоволен;
- вопрос про возврат/спор/оплату.

## 11. AI conversation rules

Assistant must:
- ask one question at a time;
- support Russian and Kazakh;
- keep answers short;
- show progress;
- save every answer;
- confirm final details before payment;
- move to admin handoff when unsure.

Assistant must not:
- promise exact deadline if admin did not confirm;
- discount below tariff;
- publish unpaid invitation;
- invent unavailable templates;
- make legal/payment decisions;
- ask for unnecessary personal data.

Recommended conversation states:

```text
new
choosing_toi_type
collecting_names
collecting_date
collecting_venue
collecting_language
choosing_tariff
choosing_template
collecting_media
draft_created
waiting_customer_approval
waiting_payment
paid
published
handoff
```

## 12. Template system

Correct model:
- templates are code components;
- AI only fills props;
- admin can edit data;
- no AI-generated final UI in MVP.

Example components:

```text
ClassicWeddingTemplate
EmeraldUzatuTemplate
SaukeleLuxuryTemplate
BesikSoftTemplate
TusauModernTemplate
MereitoiGoldTemplate
```

Each template accepts:

```text
host_names
parents_names
date
time
venue_name
address
map_link
hero_photo
gallery
music
language
program_items
dress_code
rsvp_enabled
wishes_enabled
```

## 13. Required pages

### Public

```text
/
/templates
/pricing
/partners
/invite/[slug]
```

### Internal

```text
/admin
/admin/orders
/admin/orders/[id]
/admin/templates
/admin/payments
/dashboard
```

### Later

```text
/blog
/legal/offer
/legal/privacy
/partner-dashboard
```

## 14. Development phases

### Phase 1: Core invitation factory

Build:
- Prisma schema;
- seed templates;
- public invitation route;
- template renderer;
- admin manual create/edit flow.

Done when:
- admin can create invitation manually;
- public draft URL works;
- unpublished invitations are protected.

### Phase 2: Admin operations

Build:
- orders list;
- order detail;
- edit invitation fields;
- mark paid;
- publish/unpublish;
- payment receipt field.

Done when:
- real orders can be processed manually without WhatsApp automation.

### Phase 3: RSVP

Build:
- RSVP form on public page;
- guest response storage;
- admin RSVP list.

Done when:
- guest can answer yes/no/maybe;
- admin sees responses.

### Phase 4: OpenClaw bridge

Build:
- `/api/agent/*` endpoints;
- API key protection;
- zod validation;
- agent action logs;
- tools for create/update/draft/handoff.

Done when:
- OpenClaw can create an order through our API;
- order appears in admin panel.

### Phase 5: WhatsApp pilot

Build:
- dedicated WhatsApp number;
- OpenClaw conversation script;
- operator handoff;
- preview link sending;
- payment instruction sending.

Done when:
- customer can start order in WhatsApp;
- order reaches admin;
- draft link is generated.

### Phase 6: Production WhatsApp hardening

Build later if pilot works:
- Meta WhatsApp Cloud API adapter;
- proper webhook verification;
- message templates;
- retry/error handling;
- message audit logs.

Done when:
- system does not depend only on a local OpenClaw session.

## 15. Security rules

OpenClaw/agent security:
- run in isolated environment;
- use limited API key;
- no direct DB access;
- no production shell access;
- no access to `.env` or private keys;
- no untrusted third-party skills without review;
- log every action.

Payment security:
- admin approval required;
- receipt upload stored as media asset;
- payment status cannot be changed by AI;
- rejected payment needs admin comment.

Invitation privacy:
- draft links should show draft watermark;
- private invitations require password;
- unpublished invitations should not be visible publicly.

## 16. First Codex task prompt

Use this prompt:

```text
Build the core MVP for a WhatsApp-first Kazakh toi web invitation platform.

Important product direction:
- Do not build a drag-and-drop website builder.
- Customers order through WhatsApp/operator flow.
- The backend creates mobile-first invitation pages from predefined React templates.
- OpenClaw can be integrated later as an agent layer through safe API endpoints, but all product data must live in our backend.

Tech stack:
- Next.js 15
- React
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS or existing CSS system

Build first:
1. Prisma schema for users, partners, conversations, orders, invitations, templates, rsvp_responses, payments, media_assets.
2. Seed 6 event categories and 3 sample invitation templates.
3. Public route `/invite/[slug]` that renders a template from invitation data.
4. Admin orders list.
5. Admin order detail page with edit fields.
6. Manual publish/unpublish.
7. Manual mark payment approved/rejected.
8. RSVP form and admin RSVP view.
9. Agent bridge endpoints under `/api/agent/*` with API key auth and validation.

Do not build full public constructor yet.
Do not put admin in public navigation.
Prioritize a working order-to-invitation factory.
```

## 17. Business priority

Build in this order:

```text
1. Admin can manually create invitation.
2. Public invitation page works.
3. Payment/publish status works.
4. RSVP works.
5. OpenClaw can create/update orders through API.
6. WhatsApp pilot starts.
7. Partner/agency mode.
8. Full automation and Meta WhatsApp Cloud API.
```

Reason:
- first sales can be done manually;
- automation should reduce admin work after the product already works;
- OpenClaw should accelerate operations, not become the product itself.
