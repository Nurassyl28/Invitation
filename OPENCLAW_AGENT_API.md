# OpenClaw Agent API

Backend endpoints for OpenClaw.

New product direction:

```text
OpenClaw handles the customer conversation in WhatsApp.
The backend stores the order state and returns the next WhatsApp reply.
No frontend is required for the customer flow.
No public invite publishing is required for this flow.
```

## Auth

Every protected endpoint requires one of these headers:

```text
x-agent-api-key: your-agent-key
```

or:

```text
Authorization: Bearer your-agent-key
```

Local dev fallback key:

```text
dev-agent-key
```

Production must set:

```text
AGENT_API_KEY=strong-secret-key
NEXT_PUBLIC_SITE_URL=https://your-domain.kz
```

## Health

```http
GET /api/agent/health
```

No auth required.

Use this before connecting WhatsApp:

```bash
curl http://localhost:3000/api/agent/health
```

Expected response:

```json
{
  "ok": true,
  "service": "toi-agent-api"
}
```

## Main Endpoint: WhatsApp Message

This is the preferred endpoint for OpenClaw.

OpenClaw should call this endpoint every time the customer sends a WhatsApp message.
The backend returns `reply`. OpenClaw sends that `reply` back to the customer.

```http
POST /api/openclaw/message
```

Example first message:

```json
{
  "chat_id": "whatsapp-chat-id",
  "phone": "+77001234567",
  "name": "Нуржан",
  "text": "Салем хочу пригласительный",
  "channel": "whatsapp"
}
```

Example response:

```json
{
  "ok": true,
  "reply": "Салем! Какой той делаем?\n1. Свадьба\n2. Қыз ұзату\n3. Бесік той\n4. Тұсаукесер\n5. Сүндет той\n6. Юбилей",
  "state": "choosing_toi_type",
  "quick_replies": [
    "Свадьба",
    "Қыз ұзату",
    "Бесік той",
    "Тұсаукесер",
    "Сүндет той",
    "Юбилей"
  ]
}
```

OpenClaw logic:

```text
1. Receive WhatsApp message.
2. POST message to /api/openclaw/message.
3. Send response.reply back to the same WhatsApp chat.
4. If response.quick_replies exists, show them as menu/options if OpenClaw supports it.
```

## Required OpenClaw Request Fields

Minimum request:

```json
{
  "chat_id": "unique-whatsapp-chat-id",
  "phone": "+77001234567",
  "text": "customer message"
}
```

Recommended request:

```json
{
  "chat_id": "unique-whatsapp-chat-id",
  "phone": "+77001234567",
  "name": "Customer name",
  "text": "customer message",
  "channel": "whatsapp",
  "media_urls": [],
  "media_type": "image"
}
```

Rules:
- `chat_id` must stay the same for the same WhatsApp customer.
- `phone` is used as fallback customer contact.
- `text` can be empty only when customer sends media.
- `media_urls` should contain public or backend-accessible URLs for receipt/photo/audio files.

## Full Chat Flow

The backend state machine asks for:

```text
1. Event category
2. Names
3. Date
4. Time
5. Venue
6. Address or map link
7. Language
8. Tariff
9. Template
10. Confirmation
11. Payment receipt
```

When the customer confirms with `ОК`, the backend returns a complete invitation text:

```json
{
  "ok": true,
  "state": "waiting_payment",
  "reply": "Шаблон: Velvet Arch\nҚұрметті ағайын-туыс, достар!...",
  "invitation_text": "Шаблон: Velvet Arch\nҚұрметті ағайын-туыс, достар!..."
}
```

OpenClaw sends `reply` to the customer.

## Payment Receipt Message

When customer sends a Kaspi receipt image, OpenClaw should pass media URLs:

```json
{
  "chat_id": "whatsapp-chat-id",
  "phone": "+77001234567",
  "text": "чек",
  "media_urls": [
    "https://example.com/receipt.jpg"
  ],
  "media_type": "image"
}
```

Response:

```json
{
  "ok": true,
  "state": "payment_review",
  "reply": "Чек получил. Передал админу на проверку. После подтверждения мы отправим финальный текст приглашения."
}
```

Use the same format for customer photos/music:

```json
{
  "chat_id": "whatsapp-chat-id",
  "phone": "+77001234567",
  "text": "фото",
  "media_urls": [
    "https://example.com/photo.jpg"
  ],
  "media_type": "image"
}
```

Current MVP behavior:
- in `waiting_payment` state, media is treated as payment receipt;
- in earlier states, media support is not yet fully processed;
- if OpenClaw needs photo/music collection, add it as text URL for now or move to admin handoff.

## Error Handling

OpenClaw must handle both HTTP errors and JSON errors.

If backend returns:

```json
{
  "ok": false,
  "error": "Invalid agent API key"
}
```

OpenClaw should not continue the order. Show operator/admin alert.

If backend returns:

```json
{
  "ok": false,
  "error": "openclaw_message_handler_failed",
  "reply": "Техническая ошибка. Я передал запрос администратору, скоро ответим здесь."
}
```

OpenClaw should send `reply` to the customer and notify admin.

If backend is unreachable or times out:

```text
1. Do not lose the customer message.
2. Retry once after 2-5 seconds.
3. If still failed, send fallback:
   "Техническая ошибка. Передал запрос администратору, скоро ответим здесь."
4. Notify admin/operator with customer phone and original message.
```

Recommended timeout:

```text
10 seconds
```

Recommended retry:

```text
1 retry only
```

## Connection Checklist

Before real WhatsApp connection:

```text
1. OpenClaw machine can reach backend URL.
2. /api/agent/health returns ok:true.
3. x-agent-api-key matches AGENT_API_KEY.
4. Test POST /api/openclaw/message returns reply.
5. Test same chat_id twice and verify state continues.
6. Test media_urls in waiting_payment state.
7. Test invalid API key and verify admin alert.
8. Test backend unavailable fallback in OpenClaw.
```

## Commands

Customer can write:

```text
админ
оператор
менеджер
```

The backend moves the order to `handoff`.

Customer can restart:

```text
новый заказ
restart
```

The backend starts category selection again.

## Legacy Tool Endpoints

These endpoints still exist, but they are optional.
Use them only if you want OpenClaw to control the flow itself instead of using `/api/openclaw/message`.

## Get Templates

```http
GET /api/agent/templates
```

Returns active templates that OpenClaw can show to the customer.

## Create Order

```http
POST /api/agent/orders/create
```

Example body:

```json
{
  "phone": "+77001234567",
  "toi_type": "Свадьба",
  "language": "kz_ru",
  "tariff": "standard",
  "fields": {
    "host_names": "Аян и Мадина",
    "date": "20 сентября 2026",
    "time": "18:00",
    "venue_name": "Altyn Hall",
    "address": "Алматы, Кабанбай батыра 50",
    "contact_phone": "+77001234567",
    "custom_text": "Құрметті қонақтар, сіздерді қуанышымызға шақырамыз.",
    "program_items": [
      "18:00 - Қонақтарды қарсы алу",
      "19:00 - Беташар",
      "20:00 - Той дастарханы"
    ],
    "rsvp_enabled": true
  }
}
```

Response includes:

```json
{
  "ok": true,
  "order": {
    "id": "ord_..."
  },
  "missing_fields": []
}
```

## Update Order

```http
POST /api/agent/orders/update
```

Bulk field update:

```json
{
  "order_id": "ord_...",
  "fields": {
    "music_url": "https://example.com/music.mp3",
    "map_link": "https://2gis.kz/..."
  }
}
```

Single field update:

```json
{
  "order_id": "ord_...",
  "field": "venue_name",
  "value": "Royal Hall"
}
```

## Create Draft Invitation

```http
POST /api/agent/orders/create-draft
```

Example:

```json
{
  "order_id": "ord_...",
  "template_id": "velvet-arch",
  "custom_slug": "ayan-madina"
}
```

Response includes:

```json
{
  "ok": true,
  "draft_url": "http://localhost:3000/invite/ayan-madina",
  "missing_fields": [],
  "invitation": {
    "slug": "ayan-madina",
    "status": "draft"
  }
}
```

OpenClaw should send `draft_url` to the customer for checking.

## Get Order

```http
POST /api/agent/orders/get
```

Example:

```json
{
  "order_id": "ord_..."
}
```

## Handoff To Admin

```http
POST /api/agent/handoff
```

Use this when the customer asks for discount, custom design, unclear changes, refund/payment dispute, or anything the bot should not decide.

Example:

```json
{
  "order_id": "ord_...",
  "reason": "Customer wants custom design and discount"
}
```

## Legacy OpenClaw Tool Flow

If not using `/api/openclaw/message`, use this tool order:

```text
1. GET /api/agent/templates
2. POST /api/agent/orders/create
3. POST /api/agent/orders/update until missing_fields is empty
4. POST /api/agent/orders/create-draft
5. Send draft_url to customer
6. If customer approves, tell admin to check payment manually
```

OpenClaw must not publish unpaid invitations or approve payments.
