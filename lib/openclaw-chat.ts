import { randomUUID } from "node:crypto";
import {
  addActionLog,
  AgentConversation,
  AgentConversationState,
  AgentOrder,
  AgentStore,
  AgentTemplate,
  createSlug,
  createOrderFromPayload,
  createOrUpdateDraftInvitation,
  getTariffPrice,
  mergeInvitationFields,
  missingRequiredFields,
  normalizeLanguage,
  updateAgentStore,
} from "@/lib/agent-store";

export type OpenClawMessagePayload = {
  chat_id?: string;
  chatId?: string;
  phone?: string;
  customer_phone?: string;
  customerPhone?: string;
  name?: string;
  text?: string;
  channel?: "whatsapp" | "telegram" | "manual";
  media_urls?: string[];
  mediaUrls?: string[];
  media_type?: string;
  mediaType?: string;
};

export type OpenClawMessageResult = {
  ok: true;
  reply: string;
  state: AgentConversationState;
  order_id?: string;
  order?: AgentOrder;
  missing_fields?: string[];
  invitation_text?: string;
  quick_replies?: string[];
};

const categories = ["Свадьба", "Қыз ұзату", "Құдалық"];

export async function handleOpenClawMessage(payload: OpenClawMessagePayload): Promise<OpenClawMessageResult> {
  return updateAgentStore((store) => handleMessage(store, payload));
}

function handleMessage(store: AgentStore, payload: OpenClawMessagePayload): OpenClawMessageResult {
  const text = cleanText(payload.text);
  const mediaUrls = normalizedMediaUrls(payload);
  const chatId = stringValue(payload.chat_id) ?? stringValue(payload.chatId) ?? stringValue(payload.phone) ?? stringValue(payload.customer_phone) ?? stringValue(payload.customerPhone);
  const phone = stringValue(payload.phone) ?? stringValue(payload.customer_phone) ?? stringValue(payload.customerPhone);

  if (!chatId) {
    return {
      ok: true,
      reply: "Не вижу chat_id или phone. Передайте chat_id и phone, чтобы я мог сохранить заказ.",
      state: "handoff",
      quick_replies: ["Передать админу"],
    };
  }

  const conversation = getOrCreateConversation(store, {
    chatId,
    phone,
    name: stringValue(payload.name),
    channel: payload.channel ?? "whatsapp",
  });
  const order = conversation.currentOrderId ? store.orders.find((item) => item.id === conversation.currentOrderId) : undefined;

  conversation.lastMessageAt = new Date().toISOString();
  conversation.updatedAt = conversation.lastMessageAt;

  if (wantsRestart(text)) {
    conversation.currentOrderId = undefined;
    conversation.state = "choosing_toi_type";

    return reply(conversation, undefined, categoryQuestion());
  }

  if (wantsAdmin(text)) {
    if (order) {
      order.status = "handoff";
      order.handoffReason = "Customer requested admin/operator";
      order.updatedAt = new Date().toISOString();
      addActionLog(store, "openclaw_handoff_requested", order.id, { text });
    }

    conversation.state = "handoff";
    return reply(conversation, order, "Передал ваш заказ админу. Он проверит детали и ответит здесь.");
  }

  if (conversation.state === "waiting_payment" && mediaUrls.length) {
    if (order) {
      const now = new Date().toISOString();
      order.status = "payment_review";
      order.updatedAt = now;
      store.payments.unshift({
        id: `pay_${randomUUID()}`,
        orderId: order.id,
        customerPhone: order.customerPhone,
        amount: order.price,
        method: "kaspi_manual",
        status: "payment_review",
        receiptUrls: mediaUrls,
        createdAt: now,
        updatedAt: now,
      });
      addActionLog(store, "payment_receipt_received", order.id, {
        media_urls: mediaUrls,
        media_type: payload.media_type ?? payload.mediaType,
      });
    }

    conversation.state = "payment_review";
    return reply(conversation, order, "Чек получил. Передал админу на проверку. После подтверждения мы отправим финальный текст приглашения.");
  }

  if (!order) {
    const selectedFromDemo = parseTemplateCodeFromText(store, text);

    if (selectedFromDemo) {
      const createdOrder = createOrderFromPayload({
        phone: phone ?? chatId,
        customer_name: payload.name,
        toi_type: selectedFromDemo.toiType,
        template_id: selectedFromDemo.id,
        language: "kz_ru",
        tariff: "fixed",
        contact_phone: phone,
      });

      createdOrder.conversationId = conversation.id;
      createdOrder.templateId = selectedFromDemo.id;
      createdOrder.price = getTariffPrice("fixed");
      store.orders.unshift(createdOrder);
      conversation.currentOrderId = createdOrder.id;
      conversation.state = "collecting_names";
      addActionLog(store, "openclaw_order_started_from_demo", createdOrder.id, {
        text,
        chat_id: chatId,
        template_id: selectedFromDemo.id,
      });

      return reply(
        conversation,
        createdOrder,
        `Дизайн выбран: ${selectedFromDemo.name}.\nТеперь напишите имена для приглашения. Например: "Аян и Мадина".`,
      );
    }

    const toiType = parseToiType(text);

    if (!toiType) {
      conversation.state = "choosing_toi_type";
      return reply(conversation, undefined, categoryQuestion(), categories);
    }

    const createdOrder = createOrderFromPayload({
      phone: phone ?? chatId,
      customer_name: payload.name,
      toi_type: toiType,
      language: "kz_ru",
      tariff: "fixed",
      contact_phone: phone,
    });

    createdOrder.conversationId = conversation.id;
    createdOrder.price = getTariffPrice("fixed");
    store.orders.unshift(createdOrder);
    conversation.currentOrderId = createdOrder.id;
    conversation.state = "collecting_names";
    addActionLog(store, "openclaw_order_started", createdOrder.id, { text, chat_id: chatId });

    return reply(conversation, createdOrder, `Принял: ${toiType}. Напишите имена для приглашения. Например: "Аян и Мадина".`);
  }

  switch (conversation.state) {
    case "choosing_toi_type": {
      const toiType = parseToiType(text);

      if (!toiType) {
        return reply(conversation, order, categoryQuestion(), categories);
      }

      order.toiType = toiType;
      conversation.state = "collecting_names";
      touchOrder(order);
      return reply(conversation, order, `Принял: ${toiType}. Напишите имена для приглашения.`);
    }

    case "collecting_names":
      order.fields = mergeInvitationFields(order.fields, { hostNames: text });
      conversation.state = "collecting_date";
      touchOrder(order);
      return reply(conversation, order, "Теперь напишите дату тоя. Например: 20 сентября 2026.");

    case "collecting_date":
      order.fields = mergeInvitationFields(order.fields, { date: text });
      conversation.state = "collecting_time";
      touchOrder(order);
      return reply(conversation, order, "Напишите время начала. Например: 18:00.");

    case "collecting_time":
      order.fields = mergeInvitationFields(order.fields, { time: text });
      conversation.state = "collecting_venue";
      touchOrder(order);
      return reply(conversation, order, "Напишите название ресторана или зала.");

    case "collecting_venue":
      order.fields = mergeInvitationFields(order.fields, { venueName: text });
      conversation.state = "collecting_address";
      touchOrder(order);
      return reply(conversation, order, "Отправьте адрес или ссылку 2GIS/Google Maps.");

    case "collecting_address":
      order.fields = mergeInvitationFields(order.fields, isLink(text) ? { mapLink: text } : { address: text });
      conversation.state = "collecting_language";
      touchOrder(order);
      return reply(conversation, order, "На каком языке сделать приглашение?\n1. Қазақша\n2. Русский\n3. Қазақша + Русский", ["Қазақша", "Русский", "Қазақша + Русский"]);

    case "collecting_language":
      order.language = normalizeLanguage(parseLanguage(text));
      order.tariff = "fixed";
      order.price = getTariffPrice("fixed");
      conversation.state = order.templateId ? "collecting_slug" : "choosing_template";
      touchOrder(order);

      if (order.templateId) {
        return reply(conversation, order, linkNameQuestion(order), ["Без разницы", "arman-aruzhan", "aidos-madina"]);
      }

      return reply(conversation, order, templateQuestion(store, order), templateNames(store, order));

    case "choosing_template": {
      const template = parseTemplate(store, order, text);

      if (!template) {
        return reply(conversation, order, templateQuestion(store, order), templateNames(store, order));
      }

      order.templateId = template.id;
      conversation.state = "collecting_slug";
      touchOrder(order);

      return reply(conversation, order, linkNameQuestion(order), ["Без разницы", "arman-aruzhan", "aidos-madina"]);
    }

    case "collecting_slug": {
      const customSlug = parseCustomSlug(text);
      if (customSlug) {
        order.slug = customSlug;
      }

      conversation.state = order.fields.contactPhone || phone ? "confirming" : "collecting_contact";
      order.fields = mergeInvitationFields(order.fields, { contactPhone: order.fields.contactPhone ?? phone });
      touchOrder(order);

      if (conversation.state === "collecting_contact") {
        return reply(conversation, order, "Напишите контактный номер организатора.");
      }

      return reply(conversation, order, confirmationText(order, selectedTemplate(store, order)), ["ОК", "Исправить", "Админ"]);
    }

    case "collecting_contact":
      order.fields = mergeInvitationFields(order.fields, { contactPhone: text });
      conversation.state = "confirming";
      touchOrder(order);
      return reply(conversation, order, confirmationText(order, selectedTemplate(store, order)), ["ОК", "Исправить", "Админ"]);

    case "confirming":
      if (isYes(text)) {
        const invitation = createOrUpdateDraftInvitation(store, order.id, order.templateId);
        const invitationText = formatInvitationText(order, selectedTemplate(store, order));
        const inviteUrl = `${publicBaseUrl()}/invite/${invitation.slug}`;
        order.status = "waiting_payment";
        conversation.state = "waiting_payment";
        touchOrder(order);
        addActionLog(store, "openclaw_invitation_text_generated", order.id, { invitation_id: invitation.id });

        return {
          ok: true,
          reply: `${invitationText}\n\nСсылка: ${inviteUrl}\nСтоимость: ${formatPrice(order.price)}.\nДля запуска отправьте оплату Kaspi и пришлите чек сюда.`,
          invitation_text: invitationText,
          state: conversation.state,
          order_id: order.id,
          order,
          missing_fields: missingRequiredFields(order.fields),
          quick_replies: ["Отправить чек", "Нужен админ"],
        };
      }

      if (text.includes("исправ")) {
        conversation.state = "handoff";
        order.status = "handoff";
        order.handoffReason = "Customer requested edits after confirmation";
        touchOrder(order);
        return reply(conversation, order, "Напишите, что нужно исправить. Я передал заказ админу для проверки.");
      }

      return reply(conversation, order, "Если всё правильно, напишите ОК. Если есть правка, напишите “исправить” и что поменять.", ["ОК", "Исправить"]);

    case "waiting_payment":
      return reply(conversation, order, "Жду чек оплаты. Если нужна помощь, напишите “админ”.");

    case "payment_review":
      return reply(conversation, order, "Чек уже на проверке у админа. Как только подтвердим, ответим здесь.");

    case "handoff":
      return reply(conversation, order, "Заказ у админа. Он ответит здесь.");

    case "completed":
      return reply(conversation, order, "Заказ завершён. Чтобы начать новый заказ, напишите “новый заказ”.");

    default:
      conversation.state = "choosing_toi_type";
      return reply(conversation, order, categoryQuestion(), categories);
  }
}

function reply(conversation: AgentConversation, order: AgentOrder | undefined, message: string, quickReplies?: string[]): OpenClawMessageResult {
  return {
    ok: true,
    reply: message,
    state: conversation.state,
    order_id: order?.id,
    order,
    missing_fields: order ? missingRequiredFields(order.fields) : undefined,
    quick_replies: quickReplies,
  };
}

function getOrCreateConversation(
  store: AgentStore,
  input: { chatId: string; phone?: string; name?: string; channel: "whatsapp" | "telegram" | "manual" },
) {
  const existing = store.conversations.find((conversation) => conversation.externalChatId === input.chatId);
  const now = new Date().toISOString();

  if (existing) {
    existing.customerPhone = existing.customerPhone ?? input.phone;
    existing.customerName = existing.customerName ?? input.name;
    existing.updatedAt = now;
    existing.lastMessageAt = now;
    return existing;
  }

  const conversation: AgentConversation = {
    id: `conv_${randomUUID()}`,
    channel: input.channel,
    externalChatId: input.chatId,
    customerPhone: input.phone,
    customerName: input.name,
    state: "choosing_toi_type",
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now,
  };

  store.conversations.unshift(conversation);
  return conversation;
}

function categoryQuestion() {
  return "Сәлеметсіз бе! Какой той делаем?\n1. Свадьба\n2. Қыз ұзату\n3. Құдалық";
}

function templateQuestion(store: AgentStore, order: AgentOrder) {
  const templates = templatesForOrder(store, order);

  if (!templates.length) {
    return "Сейчас шаблоны очищены и пересобираются. Я могу принять данные клиента, но готовую ссылку лучше выдавать после добавления нового шаблона.";
  }

  return `Выберите шаблон:\n${templates.map((template, index) => `${index + 1}. ${template.name} (${template.style})\n${publicBaseUrl()}/demo/${template.id}`).join("\n\n")}`;
}

function linkNameQuestion(order: AgentOrder) {
  const fallback = createSlug(order.fields.hostNames || order.toiType);
  return [
    "Как назвать ссылку приглашения?",
    `Например: ${fallback}`,
    `Итог будет примерно так: ${publicBaseUrl()}/invite/${fallback}`,
    "",
    "Если не важно, напишите: без разницы.",
  ].join("\n");
}

function confirmationText(order: AgentOrder, template?: AgentTemplate) {
  const slug = order.slug ? createSlug(order.slug) : createSlug(order.fields.hostNames || order.toiType);
  return [
    "Проверьте данные:",
    `Той: ${order.toiType}`,
    `Имена: ${order.fields.hostNames ?? "-"}`,
    `Дата: ${order.fields.date ?? "-"}`,
    `Время: ${order.fields.time ?? "-"}`,
    `Зал: ${order.fields.venueName ?? "-"}`,
    `Адрес/карта: ${order.fields.address ?? order.fields.mapLink ?? "-"}`,
    `Язык: ${order.language}`,
    `Стоимость: ${formatPrice(order.price)}`,
    `Шаблон: ${template?.name ?? order.templateId ?? "-"}`,
    `Ссылка: ${publicBaseUrl()}/invite/${slug}`,
    "",
    "Если всё правильно, напишите ОК.",
  ].join("\n");
}

function formatInvitationText(order: AgentOrder, template?: AgentTemplate) {
  const names = order.fields.hostNames ?? "Құрметті қонақтар";
  const date = order.fields.date ?? "күні";
  const time = order.fields.time ?? "уақыты";
  const venue = order.fields.venueName ?? "тойхана";
  const address = order.fields.address ?? order.fields.mapLink ?? "мекенжай";
  const program = order.fields.programItems?.length ? `\n\nБағдарлама:\n${order.fields.programItems.map((item) => `- ${item}`).join("\n")}` : "";

  return [
    `Шаблон: ${template?.name ?? "Classic"}`,
    "",
    `Құрметті ағайын-туыс, достар!`,
    `${names} қуанышына арналған тойға шақырамыз.`,
    "",
    `Күні: ${date}`,
    `Уақыты: ${time}`,
    `Өтетін орны: ${venue}`,
    `Мекенжай: ${address}`,
    program,
    "",
    order.fields.customText ?? "Сіздерді қуанышымыздың қадірлі қонағы болуға шақырамыз.",
  ]
    .filter(Boolean)
    .join("\n");
}

function parseToiType(text: string) {
  const normalized = normalizeForMatch(text);

  if (normalized === "1" || normalized.includes("svad") || normalized.includes("свад") || normalized.includes("уилен") || normalized.includes("үйлен")) return "Свадьба";
  if (normalized === "2" || normalized.includes("uzatu") || normalized.includes("ұзату") || normalized.includes("узату")) return "Қыз ұзату";
  if (normalized === "3" || normalized.includes("qudalyk") || normalized.includes("kudalyk") || normalized.includes("кудалык") || normalized.includes("құдалық") || normalized.includes("кұдалық")) return "Құдалық";

  return undefined;
}

function parseLanguage(text: string) {
  const normalized = normalizeForMatch(text);

  if (normalized === "1" || normalized.includes("kaz") || normalized.includes("қазақ") || normalized.includes("каз")) return "kz";
  if (normalized === "2" || normalized.includes("rus") || normalized.includes("рус")) return "ru";
  return "kz_ru";
}

function parseTemplate(store: AgentStore, order: AgentOrder, text: string) {
  const templates = templatesForOrder(store, order);
  const normalized = normalizeForMatch(text);
  const number = Number.parseInt(normalized, 10);

  if (Number.isInteger(number) && number > 0 && number <= templates.length) {
    return templates[number - 1];
  }

  return templates.find(
    (template) =>
      normalizeForMatch(template.id) === normalized ||
      normalizeForMatch(template.name).includes(normalized) ||
      normalized.includes(normalizeForMatch(template.name)),
  );
}

function parseCustomSlug(text: string) {
  const normalized = normalizeForMatch(text);

  if (!normalized || normalized === "-" || normalized.includes("без") || normalized.includes("не важно") || normalized.includes("люб")) {
    return undefined;
  }

  return createSlug(text);
}

function templatesForOrder(store: AgentStore, order: AgentOrder) {
  const normalizedToi = normalizeForMatch(order.toiType);
  const matched = store.templates.filter((template) => template.isActive && normalizeForMatch(template.toiType) === normalizedToi);
  return matched;
}

function templateNames(store: AgentStore, order: AgentOrder) {
  return templatesForOrder(store, order).map((template, index) => `${index + 1}. ${template.name}`);
}

function selectedTemplate(store: AgentStore, order: AgentOrder) {
  return store.templates.find((template) => template.id === order.templateId);
}

function parseTemplateCodeFromText(store: AgentStore, text: string) {
  const normalized = normalizeForMatch(text);
  const code = text.match(/(?:коды|код|code)\s*:\s*([a-z0-9-]+)/i)?.[1] ?? text.match(/\/demo\/([a-z0-9-]+)/i)?.[1];
  const templateId = code ? normalizeForMatch(code) : undefined;

  return store.templates.find((template) => {
    if (!template.isActive) {
      return false;
    }

    const normalizedId = normalizeForMatch(template.id);
    return normalizedId === templateId || normalized.includes(normalizedId);
  });
}

function touchOrder(order: AgentOrder) {
  order.status = order.status === "collecting_data" ? "collecting_data" : order.status;
  order.updatedAt = new Date().toISOString();
}

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function normalizedMediaUrls(payload: OpenClawMessagePayload) {
  const value = payload.media_urls ?? payload.mediaUrls;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

function isLink(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function isYes(value: string) {
  const normalized = normalizeForMatch(value);
  return ["ок", "ok", "yes", "да", "иә", "иа", "дұрыс", "дурыс"].includes(normalized);
}

function publicBaseUrl() {
  return (process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://dellover.live").replace(/\/+$/, "");
}

function wantsAdmin(value: string) {
  const normalized = normalizeForMatch(value);
  return normalized.includes("админ") || normalized.includes("оператор") || normalized.includes("менеджер") || normalized.includes("адам");
}

function wantsRestart(value: string) {
  const normalized = normalizeForMatch(value);
  return normalized.includes("новый заказ") || normalized.includes("restart") || normalized.includes("start over") || normalized.includes("қайта");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-KZ").format(price) + " ₸";
}
