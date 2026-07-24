create table if not exists templates (
  id text primary key,
  toi_type text not null,
  name text not null,
  style text not null check (style in ('classic', 'modern', 'luxury', 'minimal')),
  tariff text not null default 'fixed' check (tariff = 'fixed'),
  preview_image text,
  component_key text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id text primary key,
  channel text not null check (channel in ('whatsapp', 'telegram', 'manual')),
  external_chat_id text not null unique,
  customer_phone text,
  customer_name text,
  current_order_id text,
  state text not null check (
    state in (
      'choosing_toi_type',
      'collecting_names',
      'collecting_date',
      'collecting_time',
      'collecting_venue',
      'collecting_address',
      'collecting_language',
      'choosing_template',
      'collecting_slug',
      'collecting_contact',
      'confirming',
      'waiting_payment',
      'payment_review',
      'completed',
      'handoff'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_phone text not null,
  customer_name text,
  partner_id text,
  conversation_id text references conversations(id) on delete set null,
  status text not null check (
    status in (
      'collecting_data',
      'preview',
      'waiting_payment',
      'payment_review',
      'paid',
      'published',
      'cancelled',
      'handoff'
    )
  ),
  toi_type text not null,
  tariff text not null default 'fixed' check (tariff = 'fixed'),
  template_id text references templates(id) on delete set null,
  slug text,
  price integer not null default 12900,
  language text not null check (language in ('kz', 'ru', 'kz_ru')),
  source text not null check (source in ('openclaw', 'whatsapp', 'admin', 'manual')),
  fields jsonb not null default '{}'::jsonb,
  handoff_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists invitations (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  template_id text not null references templates(id) on delete restrict,
  slug text not null unique,
  status text not null check (status in ('draft', 'published', 'archived')),
  title text not null,
  language text not null check (language in ('kz', 'ru', 'kz_ru')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists payments (
  id text primary key,
  order_id text references orders(id) on delete cascade,
  invitation_id text references invitations(id) on delete set null,
  customer_phone text,
  amount integer not null,
  method text not null default 'kaspi_manual' check (method = 'kaspi_manual'),
  status text not null check (status in ('pending', 'payment_review', 'paid', 'rejected')),
  receipt_urls text[] not null default '{}',
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_toi_type_idx on templates(toi_type);
create index if not exists orders_template_id_idx on orders(template_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_customer_phone_idx on orders(customer_phone);
create index if not exists invitations_slug_idx on invitations(slug);
create index if not exists payments_status_idx on payments(status);
create index if not exists payments_order_id_idx on payments(order_id);

insert into storage.buckets (id, name, public)
values
  ('customer-photos', 'customer-photos', true),
  ('customer-music', 'customer-music', true),
  ('payment-receipts', 'payment-receipts', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public customer photos" on storage.objects;
drop policy if exists "Public customer music" on storage.objects;

create policy "Public customer photos"
on storage.objects for select
to public
using (bucket_id = 'customer-photos');

create policy "Public customer music"
on storage.objects for select
to public
using (bucket_id = 'customer-music');
