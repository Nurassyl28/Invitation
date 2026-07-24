import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { templates as catalogTemplates } from "@/lib/data";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase-server";

export type AgentLanguage = "kz" | "ru" | "kz_ru";
export type AgentTariff = "fixed";
export type AgentOrderStatus =
  | "collecting_data"
  | "preview"
  | "waiting_payment"
  | "payment_review"
  | "paid"
  | "published"
  | "cancelled"
  | "handoff";

export type AgentInvitationStatus = "draft" | "published" | "archived";

export type AgentTemplate = {
  id: string;
  toiType: string;
  name: string;
  style: "classic" | "modern" | "luxury" | "minimal";
  tariff: AgentTariff;
  previewImage: string;
  componentKey: string;
  isActive: boolean;
  createdAt: string;
};

export type AgentConversationState =
  | "choosing_toi_type"
  | "collecting_names"
  | "collecting_date"
  | "collecting_time"
  | "collecting_venue"
  | "collecting_address"
  | "collecting_language"
  | "choosing_template"
  | "collecting_slug"
  | "collecting_contact"
  | "confirming"
  | "waiting_payment"
  | "payment_review"
  | "completed"
  | "handoff";

export type AgentConversation = {
  id: string;
  channel: "whatsapp" | "telegram" | "manual";
  externalChatId: string;
  customerPhone?: string;
  customerName?: string;
  currentOrderId?: string;
  state: AgentConversationState;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
};

export type InvitationFields = {
  hostNames?: string;
  parentsNames?: string;
  date?: string;
  time?: string;
  venueName?: string;
  address?: string;
  mapLink?: string;
  contactPhone?: string;
  whatsappPhone?: string;
  musicUrl?: string;
  heroPhotoUrl?: string;
  galleryUrls?: string[];
  customText?: string;
  programItems?: string[];
  dressCode?: string;
  rsvpEnabled?: boolean;
  wishesEnabled?: boolean;
  privacyMode?: "public" | "password";
  password?: string;
};

export type AgentOrder = {
  id: string;
  customerPhone: string;
  customerName?: string;
  partnerId?: string;
  conversationId?: string;
  status: AgentOrderStatus;
  toiType: string;
  tariff: AgentTariff;
  templateId?: string;
  slug?: string;
  price: number;
  language: AgentLanguage;
  source: "openclaw" | "whatsapp" | "admin" | "manual";
  fields: InvitationFields;
  handoffReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentInvitation = InvitationFields & {
  id: string;
  orderId: string;
  templateId: string;
  slug: string;
  status: AgentInvitationStatus;
  title: string;
  language: AgentLanguage;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type AgentRsvpResponse = {
  id: string;
  invitationId: string;
  guestName: string;
  phone?: string;
  answer: "yes" | "no" | "maybe";
  guestCount: number;
  comment?: string;
  createdAt: string;
};

export type AgentPayment = {
  id: string;
  orderId?: string;
  invitationId?: string;
  customerPhone?: string;
  amount: number;
  method: "kaspi_manual";
  status: "pending" | "payment_review" | "paid" | "rejected";
  receiptUrls: string[];
  reviewerNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentActionLog = {
  id: string;
  action: string;
  orderId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type AgentStore = {
  version: 1;
  templates: AgentTemplate[];
  conversations: AgentConversation[];
  orders: AgentOrder[];
  invitations: AgentInvitation[];
  payments: AgentPayment[];
  rsvpResponses: AgentRsvpResponse[];
  actionLogs: AgentActionLog[];
};

export type AgentStoreStorage = "supabase" | "dev-json" | "dev-json-fallback";

export type AgentStoreSnapshot = {
  store: AgentStore;
  storage: AgentStoreStorage;
  error?: string;
};

const storeFile = path.join(process.cwd(), "data", "dev-store.json");
const mvpFixedPrice = Number(process.env.MVP_FIXED_PRICE ?? 12900);

const tariffPrices: Record<AgentTariff, number> = {
  fixed: Number.isFinite(mvpFixedPrice) && mvpFixedPrice > 0 ? mvpFixedPrice : 12900,
};

const validOrderStatuses: AgentOrderStatus[] = [
  "collecting_data",
  "preview",
  "waiting_payment",
  "payment_review",
  "paid",
  "published",
  "cancelled",
  "handoff",
];

const legacyTemplateIds = new Set(["velvet-arch", "royal-silk", "warm-story", "bright-steps", "heritage-day", "golden-night"]);

export function getTariffPrice(tariff: AgentTariff) {
  return tariffPrices[tariff];
}

export function normalizeTariff(value: unknown): AgentTariff {
  return "fixed";
}

export function normalizeLanguage(value: unknown): AgentLanguage {
  const language = typeof value === "string" ? value.toLowerCase().replace("+", "_").trim() : "";

  if (language === "kz" || language === "kaz" || language === "kk") {
    return "kz";
  }

  if (language === "ru" || language === "rus") {
    return "ru";
  }

  return "kz_ru";
}

export function normalizeOrderStatus(value: unknown): AgentOrderStatus | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const status = value.trim() as AgentOrderStatus;
  return validOrderStatuses.includes(status) ? status : undefined;
}

export function missingRequiredFields(fields: InvitationFields) {
  const missing: string[] = [];

  if (!fields.hostNames) missing.push("host_names");
  if (!fields.date) missing.push("date");
  if (!fields.time) missing.push("time");
  if (!fields.venueName) missing.push("venue_name");
  if (!fields.address && !fields.mapLink) missing.push("address_or_map_link");
  if (!fields.contactPhone && !fields.whatsappPhone) missing.push("contact_phone");

  return missing;
}

export function getPublicInviteData(invitation: AgentInvitation) {
  return {
    slug: invitation.slug,
    templateId: invitation.templateId,
    type: invitation.title,
    names: invitation.hostNames || "Жаңа шақыру",
    date: invitation.date || "Дата уточняется",
    time: invitation.time || "Время уточняется",
    venue: invitation.venueName || "Место уточняется",
    address: invitation.address || invitation.mapLink || "Адрес уточняется",
    text: invitation.customText || "С уважением приглашаем вас разделить с нами этот важный день.",
    program: invitation.programItems?.length
      ? invitation.programItems
      : ["Сбор гостей", "Торжественная часть", "Праздничный ужин"],
    status: invitation.status,
    mapLink: invitation.mapLink,
    musicUrl: invitation.musicUrl,
    heroPhotoUrl: invitation.heroPhotoUrl,
    galleryUrls: invitation.galleryUrls ?? [],
    parentsNames: invitation.parentsNames,
    dressCode: invitation.dressCode,
    contactPhone: invitation.contactPhone,
    whatsappPhone: invitation.whatsappPhone,
    rsvpEnabled: invitation.rsvpEnabled ?? true,
    wishesEnabled: invitation.wishesEnabled ?? false,
  };
}

export function normalizeInvitationFields(input: Record<string, unknown>): InvitationFields {
  return {
    hostNames: pickString(input, ["host_names", "hostNames", "names", "couple_names", "main_person_name"]),
    parentsNames: pickString(input, ["parents_names", "parentsNames"]),
    date: pickString(input, ["date", "event_date"]),
    time: pickString(input, ["time", "event_time"]),
    venueName: pickString(input, ["venue_name", "venueName", "venue", "restaurant", "hall"]),
    address: pickString(input, ["address", "venue_address"]),
    mapLink: pickString(input, ["map_link", "mapLink", "map", "gis_link", "google_maps_link"]),
    contactPhone: pickString(input, ["contact_phone", "contactPhone", "phone"]),
    whatsappPhone: pickString(input, ["whatsapp_phone", "whatsappPhone", "whatsapp"]),
    musicUrl: pickString(input, ["music_url", "musicUrl", "music"]),
    heroPhotoUrl: pickString(input, ["hero_photo_url", "heroPhotoUrl", "photo", "main_photo"]),
    galleryUrls: pickStringArray(input, ["gallery_urls", "galleryUrls", "gallery", "photos"]),
    customText: pickString(input, ["custom_text", "customText", "invitation_text", "text"]),
    programItems: pickStringArray(input, ["program_items", "programItems", "program", "schedule"]),
    dressCode: pickString(input, ["dress_code", "dressCode"]),
    rsvpEnabled: pickBoolean(input, ["rsvp_enabled", "rsvpEnabled", "enable_rsvp"]),
    wishesEnabled: pickBoolean(input, ["wishes_enabled", "wishesEnabled", "enable_guest_wishes"]),
    privacyMode: pickPrivacyMode(input),
    password: pickString(input, ["password"]),
  };
}

export function mergeInvitationFields(current: InvitationFields, next: InvitationFields) {
  const merged: InvitationFields = { ...current };

  for (const [key, value] of Object.entries(next) as Array<[keyof InvitationFields, InvitationFields[keyof InvitationFields]]>) {
    if (value !== undefined) {
      merged[key] = value as never;
    }
  }

  return merged;
}

export async function readAgentStoreSnapshot(): Promise<AgentStoreSnapshot> {
  if (isSupabaseConfigured()) {
    try {
      return {
        store: await readSupabaseAgentStore(),
        storage: "supabase",
      };
    } catch (error) {
      const message = errorMessage(error);
      console.error("Supabase store unavailable, falling back to dev JSON:", message);

      return {
        store: await readJsonAgentStore(),
        storage: "dev-json-fallback",
        error: message,
      };
    }
  }

  return {
    store: await readJsonAgentStore(),
    storage: "dev-json",
  };
}

export async function readAgentStore(): Promise<AgentStore> {
  return (await readAgentStoreSnapshot()).store;
}

async function readJsonAgentStore(): Promise<AgentStore> {
  try {
    const raw = await readFile(storeFile, "utf8");
    return normalizeStore(JSON.parse(raw) as Partial<AgentStore>);
  } catch (error) {
    if (isFileMissing(error)) {
      return createInitialStore();
    }

    throw error;
  }
}

export async function findAgentInvitationBySlug(slug: string) {
  const store = await readAgentStore();
  return store.invitations.find((invitation) => invitation.slug === slug) ?? null;
}

export async function updateAgentStore<T>(mutator: (store: AgentStore) => T): Promise<T> {
  const snapshot = await readAgentStoreSnapshot();
  const result = mutator(snapshot.store);
  await persistAgentStore(snapshot.store, snapshot.storage === "supabase");
  return result;
}

export function createOrderFromPayload(payload: Record<string, unknown>): AgentOrder {
  const now = new Date().toISOString();
  const tariff = normalizeTariff(payload.tariff);
  const fieldsSource = objectFrom(payload.fields);
  const fields = normalizeInvitationFields({ ...payload, ...fieldsSource });
  const phone = pickString(payload, ["phone", "customer_phone", "customerPhone", "whatsapp_phone", "whatsappPhone"]);
  const toiType = pickString(payload, ["toi_type", "toiType", "event_type", "eventType"]);

  if (!phone) {
    throw new ValidationError("phone is required");
  }

  if (!toiType) {
    throw new ValidationError("toi_type is required");
  }

  return {
    id: `ord_${randomUUID()}`,
    customerPhone: phone,
    customerName: pickString(payload, ["name", "customer_name", "customerName"]),
    partnerId: pickString(payload, ["partner_id", "partnerId"]),
    conversationId: pickString(payload, ["conversation_id", "conversationId", "chat_id", "chatId"]),
    status: "collecting_data",
    toiType,
    tariff,
    templateId: pickString(payload, ["template_id", "templateId"]),
    slug: createSlug(fields.hostNames || toiType),
    price: getTariffPrice(tariff),
    language: normalizeLanguage(payload.language),
    source: "openclaw",
    fields,
    createdAt: now,
    updatedAt: now,
  };
}

export function createOrUpdateDraftInvitation(store: AgentStore, orderId: string, templateId?: string, customSlug?: string) {
  const order = store.orders.find((item) => item.id === orderId);

  if (!order) {
    throw new ValidationError("order not found", 404);
  }

  const selectedTemplateId = templateId || order.templateId || templateForToiType(store, order.toiType)?.id;
  const template = store.templates.find((item) => item.id === selectedTemplateId && item.isActive);

  if (!template) {
    throw new ValidationError("active template not found");
  }

  const now = new Date().toISOString();
  const existing = store.invitations.find((item) => item.orderId === order.id);
  const preferredSlug = customSlug || order.slug || order.fields.hostNames || order.toiType;
  const slug = uniqueSlug(store, createSlug(preferredSlug), existing?.id);
  const title = `${order.toiType}: ${order.fields.hostNames || "Жаңа шақыру"}`;
  const invitation: AgentInvitation = {
    id: existing?.id ?? `inv_${randomUUID()}`,
    orderId: order.id,
    templateId: template.id,
    slug,
    status: existing?.status ?? "draft",
    title,
    hostNames: order.fields.hostNames,
    parentsNames: order.fields.parentsNames,
    date: order.fields.date,
    time: order.fields.time,
    venueName: order.fields.venueName,
    address: order.fields.address,
    mapLink: order.fields.mapLink,
    contactPhone: order.fields.contactPhone,
    whatsappPhone: order.fields.whatsappPhone,
    musicUrl: order.fields.musicUrl,
    heroPhotoUrl: order.fields.heroPhotoUrl,
    galleryUrls: order.fields.galleryUrls ?? [],
    customText: order.fields.customText,
    programItems: order.fields.programItems ?? [],
    dressCode: order.fields.dressCode,
    rsvpEnabled: order.fields.rsvpEnabled ?? true,
    wishesEnabled: order.fields.wishesEnabled ?? false,
    privacyMode: order.fields.privacyMode ?? "public",
    language: order.language,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    publishedAt: existing?.publishedAt,
  };

  if (existing) {
    Object.assign(existing, invitation);
  } else {
    store.invitations.unshift(invitation);
  }

  order.status = "preview";
  order.templateId = template.id;
  order.slug = slug;
  order.updatedAt = now;

  addActionLog(store, "create_draft_invitation", order.id, {
    invitation_id: invitation.id,
    template_id: template.id,
    slug,
  });

  return invitation;
}

export function addActionLog(store: AgentStore, action: string, orderId: string | undefined, payload: Record<string, unknown>) {
  store.actionLogs.unshift({
    id: `log_${randomUUID()}`,
    action,
    orderId,
    payload,
    createdAt: new Date().toISOString(),
  });

  store.actionLogs = store.actionLogs.slice(0, 500);
}

export class ValidationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function createInitialStore(): AgentStore {
  const now = new Date().toISOString();

  return {
    version: 1,
    templates: catalogTemplates.map((template, index) => ({
      id: template.id,
      toiType: template.category,
      name: template.title,
      style: template.tags.includes("premium") || template.tariff === "VIP" ? "luxury" : template.tags.includes("simple") ? "minimal" : index % 2 === 0 ? "classic" : "modern",
      tariff: "fixed",
      previewImage: "",
      componentKey: `${pascalCase(template.id)}Template`,
      isActive: true,
      createdAt: now,
    })),
    conversations: [],
    orders: [],
    invitations: [],
    payments: [],
    rsvpResponses: [],
    actionLogs: [],
  };
}

function normalizeStore(store: Partial<AgentStore>): AgentStore {
  const initial = createInitialStore();
  const activeCatalogIds = new Set(initial.templates.map((template) => template.id));
  const storedTemplates = Array.isArray(store.templates) ? store.templates.filter((template) => activeCatalogIds.has(template.id)) : [];
  const templateMap = new Map<string, AgentTemplate>();

  for (const template of [...storedTemplates, ...initial.templates]) {
    templateMap.set(template.id, template);
  }

  return {
    version: 1,
    templates: Array.from(templateMap.values()).map((template) =>
      legacyTemplateIds.has(template.id) ? { ...template, isActive: false } : template,
    ),
    conversations: Array.isArray(store.conversations) ? store.conversations : [],
    orders: Array.isArray(store.orders) ? store.orders : [],
    invitations: Array.isArray(store.invitations) ? store.invitations : [],
    payments: Array.isArray(store.payments) ? store.payments : [],
    rsvpResponses: Array.isArray(store.rsvpResponses) ? store.rsvpResponses : [],
    actionLogs: Array.isArray(store.actionLogs) ? store.actionLogs : [],
  };
}

type SupabaseTemplateRow = {
  id: string;
  toi_type: string;
  name: string;
  style: AgentTemplate["style"];
  tariff: AgentTariff;
  preview_image: string | null;
  component_key: string;
  is_active: boolean;
  created_at: string;
};

type SupabaseConversationRow = {
  id: string;
  channel: AgentConversation["channel"];
  external_chat_id: string;
  customer_phone: string | null;
  customer_name: string | null;
  current_order_id: string | null;
  state: AgentConversationState;
  created_at: string;
  updated_at: string;
  last_message_at: string;
};

type SupabaseOrderRow = {
  id: string;
  customer_phone: string;
  customer_name: string | null;
  partner_id: string | null;
  conversation_id: string | null;
  status: AgentOrderStatus;
  toi_type: string;
  tariff: AgentTariff;
  template_id: string | null;
  slug: string | null;
  price: number;
  language: AgentLanguage;
  source: AgentOrder["source"];
  fields: InvitationFields | null;
  handoff_reason: string | null;
  created_at: string;
  updated_at: string;
};

type SupabaseInvitationRow = {
  id: string;
  order_id: string;
  template_id: string;
  slug: string;
  status: AgentInvitationStatus;
  title: string;
  language: AgentLanguage;
  data: InvitationFields | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type SupabasePaymentRow = {
  id: string;
  order_id: string | null;
  invitation_id: string | null;
  customer_phone: string | null;
  amount: number;
  method: AgentPayment["method"];
  status: AgentPayment["status"];
  receipt_urls: string[] | null;
  reviewer_note: string | null;
  created_at: string;
  updated_at: string;
};

type SupabaseRsvpResponseRow = {
  id: string;
  invitation_id: string;
  guest_name: string;
  phone: string | null;
  answer: AgentRsvpResponse["answer"];
  guest_count: number;
  comment: string | null;
  created_at: string;
};

async function readSupabaseAgentStore(): Promise<AgentStore> {
  const [templateRows, conversationRows, orderRows, invitationRows, paymentRows, rsvpRows] = await Promise.all([
    selectSupabaseRows<SupabaseTemplateRow>("templates"),
    selectSupabaseRows<SupabaseConversationRow>("conversations"),
    selectSupabaseRows<SupabaseOrderRow>("orders"),
    selectSupabaseRows<SupabaseInvitationRow>("invitations"),
    selectSupabaseRows<SupabasePaymentRow>("payments"),
    selectSupabaseRows<SupabaseRsvpResponseRow>("rsvp_responses"),
  ]);

  const store = normalizeStore({
    templates: templateRows.map(rowToTemplate),
    conversations: conversationRows.map(rowToConversation),
    orders: orderRows.map(rowToOrder),
    invitations: invitationRows.map(rowToInvitation),
    payments: paymentRows.map(rowToPayment),
    rsvpResponses: rsvpRows.map(rowToRsvpResponse),
    actionLogs: [],
  });

  if (!templateRows.length) {
    await upsertSupabaseRows("templates", store.templates.map(templateToRow));
  }

  return store;
}

async function writeSupabaseAgentStore(store: AgentStore) {
  await upsertSupabaseRows("templates", store.templates.map(templateToRow));
  await upsertSupabaseRows("conversations", store.conversations.map(conversationToRow));
  await upsertSupabaseRows("orders", store.orders.map(orderToRow));
  await upsertSupabaseRows("invitations", store.invitations.map(invitationToRow));
  await upsertSupabaseRows("payments", store.payments.map(paymentToRow));
  await upsertSupabaseRows("rsvp_responses", store.rsvpResponses.map(rsvpResponseToRow));
}

async function selectSupabaseRows<T>(table: string): Promise<T[]> {
  return supabaseRest<T[]>(`${table}?select=*`);
}

async function upsertSupabaseRows(table: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) {
    return;
  }

  await supabaseRest(`${table}?on_conflict=id`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
}

function rowToTemplate(row: SupabaseTemplateRow): AgentTemplate {
  return {
    id: row.id,
    toiType: row.toi_type,
    name: row.name,
    style: row.style,
    tariff: normalizeTariff(row.tariff),
    previewImage: row.preview_image ?? "",
    componentKey: row.component_key,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

function templateToRow(template: AgentTemplate): Record<string, unknown> {
  return {
    id: template.id,
    toi_type: template.toiType,
    name: template.name,
    style: template.style,
    tariff: template.tariff,
    preview_image: template.previewImage || null,
    component_key: template.componentKey,
    is_active: template.isActive,
    created_at: template.createdAt,
  };
}

function rowToConversation(row: SupabaseConversationRow): AgentConversation {
  return {
    id: row.id,
    channel: row.channel,
    externalChatId: row.external_chat_id,
    customerPhone: row.customer_phone ?? undefined,
    customerName: row.customer_name ?? undefined,
    currentOrderId: row.current_order_id ?? undefined,
    state: row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastMessageAt: row.last_message_at,
  };
}

function conversationToRow(conversation: AgentConversation): Record<string, unknown> {
  return {
    id: conversation.id,
    channel: conversation.channel,
    external_chat_id: conversation.externalChatId,
    customer_phone: conversation.customerPhone ?? null,
    customer_name: conversation.customerName ?? null,
    current_order_id: conversation.currentOrderId ?? null,
    state: conversation.state,
    created_at: conversation.createdAt,
    updated_at: conversation.updatedAt,
    last_message_at: conversation.lastMessageAt,
  };
}

function rowToOrder(row: SupabaseOrderRow): AgentOrder {
  return {
    id: row.id,
    customerPhone: row.customer_phone,
    customerName: row.customer_name ?? undefined,
    partnerId: row.partner_id ?? undefined,
    conversationId: row.conversation_id ?? undefined,
    status: normalizeOrderStatus(row.status) ?? "collecting_data",
    toiType: row.toi_type,
    tariff: normalizeTariff(row.tariff),
    templateId: row.template_id ?? undefined,
    slug: row.slug ?? undefined,
    price: row.price,
    language: normalizeLanguage(row.language),
    source: row.source,
    fields: normalizeInvitationFields(objectFrom(row.fields)),
    handoffReason: row.handoff_reason ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function orderToRow(order: AgentOrder): Record<string, unknown> {
  return {
    id: order.id,
    customer_phone: order.customerPhone,
    customer_name: order.customerName ?? null,
    partner_id: order.partnerId ?? null,
    conversation_id: order.conversationId ?? null,
    status: order.status,
    toi_type: order.toiType,
    tariff: order.tariff,
    template_id: order.templateId ?? null,
    slug: order.slug ?? null,
    price: order.price,
    language: order.language,
    source: order.source,
    fields: order.fields,
    handoff_reason: order.handoffReason ?? null,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

function rowToInvitation(row: SupabaseInvitationRow): AgentInvitation {
  const fields = normalizeInvitationFields(objectFrom(row.data));

  return {
    id: row.id,
    orderId: row.order_id,
    templateId: row.template_id,
    slug: row.slug,
    status: row.status,
    title: row.title,
    language: normalizeLanguage(row.language),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? undefined,
    ...fields,
  };
}

function invitationToRow(invitation: AgentInvitation): Record<string, unknown> {
  return {
    id: invitation.id,
    order_id: invitation.orderId,
    template_id: invitation.templateId,
    slug: invitation.slug,
    status: invitation.status,
    title: invitation.title,
    language: invitation.language,
    data: invitationFieldsFromInvitation(invitation),
    created_at: invitation.createdAt,
    updated_at: invitation.updatedAt,
    published_at: invitation.publishedAt ?? null,
  };
}

function rowToPayment(row: SupabasePaymentRow): AgentPayment {
  return {
    id: row.id,
    orderId: row.order_id ?? undefined,
    invitationId: row.invitation_id ?? undefined,
    customerPhone: row.customer_phone ?? undefined,
    amount: row.amount,
    method: row.method,
    status: row.status,
    receiptUrls: row.receipt_urls ?? [],
    reviewerNote: row.reviewer_note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function paymentToRow(payment: AgentPayment): Record<string, unknown> {
  return {
    id: payment.id,
    order_id: payment.orderId ?? null,
    invitation_id: payment.invitationId ?? null,
    customer_phone: payment.customerPhone ?? null,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    receipt_urls: payment.receiptUrls,
    reviewer_note: payment.reviewerNote ?? null,
    created_at: payment.createdAt,
    updated_at: payment.updatedAt,
  };
}

function rowToRsvpResponse(row: SupabaseRsvpResponseRow): AgentRsvpResponse {
  return {
    id: row.id,
    invitationId: row.invitation_id,
    guestName: row.guest_name,
    phone: row.phone ?? undefined,
    answer: normalizeRsvpAnswer(row.answer),
    guestCount: normalizeGuestCount(row.guest_count),
    comment: row.comment ?? undefined,
    createdAt: row.created_at,
  };
}

function rsvpResponseToRow(response: AgentRsvpResponse): Record<string, unknown> {
  return {
    id: response.id,
    invitation_id: response.invitationId,
    guest_name: response.guestName,
    phone: response.phone ?? null,
    answer: normalizeRsvpAnswer(response.answer),
    guest_count: normalizeGuestCount(response.guestCount),
    comment: response.comment ?? null,
    created_at: response.createdAt,
  };
}

function invitationFieldsFromInvitation(invitation: AgentInvitation): InvitationFields {
  return {
    hostNames: invitation.hostNames,
    parentsNames: invitation.parentsNames,
    date: invitation.date,
    time: invitation.time,
    venueName: invitation.venueName,
    address: invitation.address,
    mapLink: invitation.mapLink,
    contactPhone: invitation.contactPhone,
    whatsappPhone: invitation.whatsappPhone,
    musicUrl: invitation.musicUrl,
    heroPhotoUrl: invitation.heroPhotoUrl,
    galleryUrls: invitation.galleryUrls ?? [],
    customText: invitation.customText,
    programItems: invitation.programItems ?? [],
    dressCode: invitation.dressCode,
    rsvpEnabled: invitation.rsvpEnabled,
    wishesEnabled: invitation.wishesEnabled,
    privacyMode: invitation.privacyMode,
    password: invitation.password,
  };
}

async function persistAgentStore(store: AgentStore, preferSupabase: boolean) {
  if (preferSupabase) {
    try {
      await writeSupabaseAgentStore(store);
      return;
    } catch (error) {
      console.error("Supabase write failed, falling back to dev JSON:", errorMessage(error));
    }
  }

  await writeAgentStore(store);
}

async function writeAgentStore(store: AgentStore) {
  await mkdir(path.dirname(storeFile), { recursive: true });
  await writeFile(storeFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function isFileMissing(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function pickString(input: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = input[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}

function pickStringArray(input: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = input[key];

    if (Array.isArray(value)) {
      const normalized = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
      return normalized.length ? normalized : undefined;
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return undefined;
}

function pickBoolean(input: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = input[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.toLowerCase().trim();

      if (["true", "yes", "1", "on", "да"].includes(normalized)) {
        return true;
      }

      if (["false", "no", "0", "off", "нет"].includes(normalized)) {
        return false;
      }
    }
  }

  return undefined;
}

function pickPrivacyMode(input: Record<string, unknown>): "public" | "password" | undefined {
  const value = pickString(input, ["privacy_mode", "privacyMode"]);

  if (value === "password") {
    return "password";
  }

  if (value === "public") {
    return "public";
  }

  return undefined;
}

function objectFrom(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function normalizeRsvpAnswer(value: unknown): AgentRsvpResponse["answer"] {
  if (typeof value !== "string") {
    return "yes";
  }

  const answer = value.toLowerCase().trim();

  if (answer === "no" || answer === "нет" || answer === "жоқ") {
    return "no";
  }

  if (answer === "maybe" || answer === "возможно" || answer === "мүмкін") {
    return "maybe";
  }

  return "yes";
}

export function normalizeGuestCount(value: unknown) {
  const count = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(count)) {
    return 1;
  }

  return Math.min(20, Math.max(1, Math.floor(count)));
}

function templateForToiType(store: AgentStore, toiType: string) {
  const normalized = toiType.toLowerCase();

  return (
    store.templates.find((template) => template.isActive && template.toiType.toLowerCase() === normalized) ??
    store.templates.find((template) => template.isActive)
  );
}

function uniqueSlug(store: AgentStore, baseSlug: string, currentInvitationId?: string) {
  let slug = baseSlug || "invite";
  let counter = 2;

  while (store.invitations.some((invitation) => invitation.slug === slug && invitation.id !== currentInvitationId)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export function createSlug(value: string) {
  const transliterated = value
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] ?? char)
    .join("");

  return (
    transliterated
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "invite"
  );
}

function pascalCase(value: string) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

const transliterationMap: Record<string, string> = {
  а: "a",
  ә: "a",
  б: "b",
  в: "v",
  г: "g",
  ғ: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  қ: "k",
  л: "l",
  м: "m",
  н: "n",
  ң: "n",
  о: "o",
  ө: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ұ: "u",
  ү: "u",
  ф: "f",
  х: "h",
  һ: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ы: "y",
  і: "i",
  э: "e",
  ю: "yu",
  я: "ya",
  ь: "",
  ъ: "",
};
