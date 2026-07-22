# Invitation

WhatsApp-first backend + витрина demo-шаблонов для онлайн-приглашений.

## Запуск

```bash
npm install
npm run dev
```

Открой `http://localhost:3000`.

Проверки:

```bash
npm run typecheck
npm run build
```

## Шаблоны и страницы

- `/` — редирект на `/demo`
- `/demo` — единственная публичная витрина шаблонов
- `/demo/wedding-emerald-envelope` — свадебный шаблон (конверт с восковой печатью)
- `/demo/qyz-uzatu-anel` — қыз ұзату (анимация, countdown)
- `/demo/wedding-classic-gold` — классический свадебный шаблон
- `/demo/wedding-emerald-card` — лаконичный emerald wedding шаблон
- `/invite/[slug]` — публичная страница приглашения
- `/admin` — скрытая служебная страница для заказов и оплат
- **`/istara`** — alias на `/demo/wedding-editorial-istara`

Удалено из WhatsApp-first MVP:
- `/builder` — клиент не собирает приглашение сам
- `/dashboard` — клиент работает через WhatsApp
- `/login` — авторизация клиента не нужна на MVP
- `/partners` — партнёрская модель после MVP
- `/templates` — заменён на `/demo`

## Структура

- `app/` — маршруты и API (Next.js App Router).
- `components/` — React-компоненты шаблонов приглашений.
- `lib/` — стор заказов, чат-логика OpenClaw, данные.
- `public/images/` — изображения, используемые приложением.
- `public/istara/assets/` — image assets для editorial wedding template.
- `.github/workflows/` — CI (typecheck + build) и деплой на Vercel.

Маршрут `/istara` редиректит на полноценный React/OpenClaw template `/demo/wedding-editorial-istara`.

## WhatsApp-first логика

- Клиент не открывает конструктор, кабинет или login.
- OpenClaw собирает данные в WhatsApp через `POST /api/openclaw/message`.
- Для демонстрации шаблонов используется `/demo`.
- Каждый шаблон имеет отдельную demo-ссылку: `/demo/{template_id}`.
- OpenClaw показывает клиенту только шаблоны нужного типа тоя.
- Готовое приглашение получает отдельную ссылку: `/invite/{slug}`.
- Один и тот же шаблон может использоваться много раз: данные и slug у каждого клиента отдельные.
- Если клиент просит своё имя ссылки, OpenClaw сохраняет его как custom slug; если slug занят, backend добавит суффикс.

## Редактирование editorial wedding template

- Тексты demo: `lib/demo-invitations.ts`.
- Template metadata/OpenClaw catalog: `lib/data.ts`.
- React-renderer: `components/editorial-wedding-invite.tsx`.
- Изображение по умолчанию: `public/istara/assets/reference.jpg`.
