import { createHash, randomUUID } from "node:crypto";
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
import { eventTypeLabel, inferPublicLanguageFromText, templateName, toPublicLanguage, type PublicLanguage } from "@/lib/i18n";

export type OpenClawMessagePayload = {
  chat_id?: string;
  chatId?: string;
  idempotency_key?: string;
  idempotencyKey?: string;
  message_id?: string;
  messageId?: string;
  webhook_id?: string;
  webhookId?: string;
  event_id?: string;
  eventId?: string;
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

export type OpenClawMessageResult =
  | OpenClawMessageSuccess
  | OpenClawMessageFailure;

export type OpenClawMessageSuccess = {
  ok: true;
  reply: string;
  state: AgentConversationState;
  order_id?: string;
  order?: AgentOrder;
  missing_fields?: string[];
  invitation_text?: string;
  quick_replies?: string[];
  idempotency_key?: string;
  idempotent?: boolean;
};

export type OpenClawMessageFailure = {
  ok: false;
  error_code: string;
  error: string;
  reply: string;
  retryable: boolean;
  http_status?: number;
  missing_fields?: string[];
  idempotency_key?: string;
};

const fallbackIdempotencyTtlMs = 10 * 60 * 1000;
const explicitIdempotencyTtlMs = 30 * 24 * 60 * 60 * 1000;

const openClawCopy = {
  kz: {
    missingIdentity: "chat_id немесе phone берілмеді. Тапсырысты сақтау үшін chat_id және phone жіберіңіз.",
    emptyMessage: "Хабарлама немесе файл келмеді. Мәтін, фото, әуен немесе төлем түбіртегін жіберіңіз.",
    idempotencyConflict: "Бірдей кілтпен басқа хабарлама келді. Қайталанған тапсырыс жасамау үшін админге жібердім.",
    handoff: "Тапсырысыңызды маманға жібердім. Ол мәліметтерді тексеріп, осы жерде жауап береді.",
    receiptReceived: "Төлем түбіртегі қабылданды. Маман тексергеннен кейін дайын шақыру сілтемесін жібереміз.",
    receiptWaiting: "Төлем түбіртегін күтіп отырмын. Көмек керек болса, “маман” деп жазыңыз.",
    receiptReview: "Төлем түбіртегі тексеріліп жатыр. Расталғаннан кейін осы жерде жауап береміз.",
    handoffState: "Тапсырыс маманда. Ол осы жерде жауап береді.",
    completed: "Тапсырыс аяқталды. Жаңа тапсырыс бастау үшін “жаңа тапсырыс” деп жазыңыз.",
    orderFound: (id: string, design: string) => `Тапсырыс табылды: ${id}.\nҮлгі: ${design}.\nЕнді шақырудағы есімдерді жазыңыз. Мысалы: "Аян мен Мадина".`,
    designSelected: (design: string) => `Үлгі таңдалды: ${design}.\nЕнді шақырудағы есімдерді жазыңыз. Мысалы: "Аян мен Мадина".`,
    acceptedType: (type: string) => `Қабылданды: ${type}. Шақырудағы есімдерді жазыңыз. Мысалы: "Аян мен Мадина".`,
    namesRequired: "Шақырудағы есімдерді мәтінмен жазыңыз. Мысалы: “Аян мен Мадина”.",
    dateQuestion: "Енді той күнін жазыңыз. Мысалы: 20 қыркүйек 2026.",
    dateRequired: "Той күнін мәтінмен жазыңыз. Мысалы: 20 қыркүйек 2026.",
    timeQuestion: "Басталу уақытын жазыңыз. Мысалы: 18:00.",
    timeRequired: "Басталу уақытын мәтінмен жазыңыз. Мысалы: 18:00.",
    venueQuestion: "Мейрамхана немесе зал атауын жазыңыз.",
    venueRequired: "Мейрамхана немесе зал атауын мәтінмен жазыңыз.",
    addressQuestion: "Мекенжайды немесе 2GIS/Google Maps сілтемесін жіберіңіз.",
    addressRequired: "Мекенжайды мәтінмен немесе 2GIS/Google Maps сілтемесімен жіберіңіз.",
    languageQuestion: "Шақыру тілін таңдаңыз:\n1. Қазақша\n2. Орысша",
    languageQuick: ["Қазақша", "Орысша"],
    slugQuick: ["Маңызды емес", "arman-aruzhan", "aidos-madina"],
    confirmQuick: ["Дұрыс", "Түзету", "Маман"],
    paymentQuick: ["Түбіртек жіберу", "Маман керек"],
    contactQuestion: "Ұйымдастырушының байланыс нөмірін жазыңыз.",
    contactRequired: "Ұйымдастырушының байланыс нөмірін мәтінмен жазыңыз.",
    paymentInstruction: (url: string, price: string) => `Сілтеме: ${url}\nБағасы: ${price}.\nЖариялау үшін Kaspi арқылы төлем жасап, түбіртекті осы жерге жіберіңіз.`,
    editQuestion: "Егер бәрі дұрыс болса, “дұрыс” деп жазыңыз. Өзгеріс болса, “түзету” деп жазыңыз.",
    editHandoff: "Қандай өзгеріс керек екенін жазыңыз. Тапсырысты маманға жібердім.",
    musicSaved: "Әуен сақталды. Ол шақыруға қосылады. Мәліметтерді толтыруды жалғастыра аласыз.",
    photosSaved: "Фото сақталды. Бірінші фото негізгі сурет болады, қалғандары галереяға қосылады.",
    noTemplates: "Бұл санатқа арналған үлгілер әзірге жоқ. Мәліметтерді қабылдай аламын, дайын сілтемені үлгі қосылғаннан кейін береміз.",
    chooseTemplate: "Үлгіні таңдаңыз:",
    linkNameTitle: "Шақыру сілтемесін қалай атаймыз?",
    linkNameExample: "Мысалы",
    linkNameResult: "Нәтижесінде сілтеме осылай болады",
    linkNameSkip: "Маңызды болмаса, “маңызды емес” деп жазыңыз.",
    checkData: "Мәліметтерді тексеріңіз:",
    toi: "Той",
    names: "Есімдер",
    date: "Күні",
    time: "Уақыты",
    venue: "Зал",
    address: "Мекенжай/карта",
    language: "Тіл",
    price: "Бағасы",
    template: "Үлгі",
    link: "Сілтеме",
    confirmOk: "Егер бәрі дұрыс болса, “дұрыс” деп жазыңыз.",
    invitationTemplate: "Үлгі",
    invitationGreeting: "Құрметті ағайын-туыс, достар!",
    invitationLine: (names: string) => `${names} қуанышына арналған тойға шақырамыз.`,
    invitationFallback: "Сіздерді қуанышымыздың қадірлі қонағы болуға шақырамыз.",
    program: "Бағдарлама",
    missingFallback: "Шақыруға қажетті мәлімет жетіспейді. Жетіспейтін ақпаратты жазыңыз.",
  },
  ru: {
    missingIdentity: "Не вижу chat_id или phone. Передайте chat_id и phone, чтобы я мог сохранить заказ.",
    emptyMessage: "Не получил текст или файл. Отправьте сообщение, фото, музыку или чек.",
    idempotencyConflict: "Получили повтор с другим содержимым. Передал админу для проверки, чтобы не создать дубль.",
    handoff: "Передал ваш заказ админу. Он проверит детали и ответит здесь.",
    receiptReceived: "Чек получил. Передал админу на проверку. После подтверждения мы отправим финальную ссылку.",
    receiptWaiting: "Жду чек оплаты. Если нужна помощь, напишите “админ”.",
    receiptReview: "Чек уже на проверке у админа. Как только подтвердим, ответим здесь.",
    handoffState: "Заказ у админа. Он ответит здесь.",
    completed: "Заказ завершён. Чтобы начать новый заказ, напишите “новый заказ”.",
    orderFound: (id: string, design: string) => `Заказ найден: ${id}.\nДизайн: ${design}.\nТеперь напишите имена для приглашения. Например: "Аян и Мадина".`,
    designSelected: (design: string) => `Дизайн выбран: ${design}.\nТеперь напишите имена для приглашения. Например: "Аян и Мадина".`,
    acceptedType: (type: string) => `Принял: ${type}. Напишите имена для приглашения. Например: "Аян и Мадина".`,
    namesRequired: "Напишите имена для приглашения текстом. Например: “Аян и Мадина”.",
    dateQuestion: "Теперь напишите дату события. Например: 20 сентября 2026.",
    dateRequired: "Напишите дату события текстом. Например: 20 сентября 2026.",
    timeQuestion: "Напишите время начала. Например: 18:00.",
    timeRequired: "Напишите время начала текстом. Например: 18:00.",
    venueQuestion: "Напишите название ресторана или зала.",
    venueRequired: "Напишите название ресторана или зала текстом.",
    addressQuestion: "Отправьте адрес или ссылку 2GIS/Google Maps.",
    addressRequired: "Отправьте адрес текстом или ссылку 2GIS/Google Maps.",
    languageQuestion: "Выберите язык приглашения:\n1. Казахский\n2. Русский",
    languageQuick: ["Казахский", "Русский"],
    slugQuick: ["Без разницы", "arman-aruzhan", "aidos-madina"],
    confirmQuick: ["ОК", "Исправить", "Админ"],
    paymentQuick: ["Отправить чек", "Нужен админ"],
    contactQuestion: "Напишите контактный номер организатора.",
    contactRequired: "Напишите контактный номер организатора текстом.",
    paymentInstruction: (url: string, price: string) => `Ссылка: ${url}\nСтоимость: ${price}.\nДля запуска отправьте оплату Kaspi и пришлите чек сюда.`,
    editQuestion: "Если всё правильно, напишите ОК. Если есть правка, напишите “исправить” и что поменять.",
    editHandoff: "Напишите, что нужно исправить. Я передал заказ админу для проверки.",
    musicSaved: "Музыку сохранил. Она будет подключена к приглашению. Можете продолжить заполнять данные.",
    photosSaved: "Фото сохранил. Первое фото будет главным, остальные попадут в галерею. Можете продолжить заполнять данные.",
    noTemplates: "Сейчас шаблоны очищены и пересобираются. Я могу принять данные клиента, но готовую ссылку лучше выдавать после добавления нового шаблона.",
    chooseTemplate: "Выберите шаблон:",
    linkNameTitle: "Как назвать ссылку приглашения?",
    linkNameExample: "Например",
    linkNameResult: "Итог будет примерно так",
    linkNameSkip: "Если не важно, напишите: без разницы.",
    checkData: "Проверьте данные:",
    toi: "Событие",
    names: "Имена",
    date: "Дата",
    time: "Время",
    venue: "Зал",
    address: "Адрес/карта",
    language: "Язык",
    price: "Стоимость",
    template: "Шаблон",
    link: "Ссылка",
    confirmOk: "Если всё правильно, напишите ОК.",
    invitationTemplate: "Шаблон",
    invitationGreeting: "Дорогие родные и друзья!",
    invitationLine: (names: string) => `Приглашаем вас на торжество: ${names}.`,
    invitationFallback: "Будем рады видеть вас среди дорогих гостей.",
    program: "Программа",
    missingFallback: "Не хватает данных для приглашения. Напишите недостающую информацию.",
  },
} satisfies Record<PublicLanguage, Record<string, string | string[] | ((...args: string[]) => string)>>;

type OpenClawCopy = typeof openClawCopy.kz;

function textCopy(language: PublicLanguage): OpenClawCopy {
  return openClawCopy[language] as OpenClawCopy;
}

export async function handleOpenClawMessage(payload: OpenClawMessagePayload): Promise<OpenClawMessageResult> {
  const idempotency = buildIdempotency(payload);

  return updateAgentStore((store) => {
    if (idempotency) {
      const existing = store.processedMessages.find((message) => message.idempotencyKey === idempotency.key);

      if (existing && existing.requestHash !== idempotency.requestHash && !isProcessedMessageExpired(existing.expiresAt)) {
        const language = inferPublicLanguageFromText(payload.text);
        return {
          ok: false,
          error_code: "idempotency_key_conflict",
          error: "The same idempotency key was already used for a different payload.",
          reply: textCopy(language).idempotencyConflict,
          retryable: false,
          http_status: 409,
          idempotency_key: idempotency.key,
        };
      }

      if (existing && !isProcessedMessageExpired(existing.expiresAt)) {
        return {
          ...(existing.response as OpenClawMessageResult),
          idempotency_key: idempotency.key,
          idempotent: true,
        };
      }
    }

    const result = handleMessage(store, payload);

    if (idempotency && result.ok) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (idempotency.explicit ? explicitIdempotencyTtlMs : fallbackIdempotencyTtlMs)).toISOString();
      const processedMessage = {
        id: `msg_${randomUUID()}`,
        idempotencyKey: idempotency.key,
        requestHash: idempotency.requestHash,
        response: result as unknown as Record<string, unknown>,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt,
      };

      store.processedMessages = [
        processedMessage,
        ...store.processedMessages.filter((message) => message.idempotencyKey !== idempotency.key && !isProcessedMessageExpired(message.expiresAt)),
      ].slice(0, 1000);

      return {
        ...result,
        idempotency_key: idempotency.key,
      };
    }

    return result;
  });
}

function handleMessage(store: AgentStore, payload: OpenClawMessagePayload): OpenClawMessageResult {
  const text = cleanText(payload.text);
  const mediaUrls = normalizedMediaUrls(payload);
  const mediaKind = normalizeMediaKind(payload);
  const chatId = stringValue(payload.chat_id) ?? stringValue(payload.chatId) ?? stringValue(payload.phone) ?? stringValue(payload.customer_phone) ?? stringValue(payload.customerPhone);
  const phone = stringValue(payload.phone) ?? stringValue(payload.customer_phone) ?? stringValue(payload.customerPhone);
  const inferredLanguage = inferPublicLanguageFromText(text);

  if (!chatId) {
    return {
      ok: false,
      error_code: "missing_identity",
      error: "chat_id or phone is required",
      reply: textCopy(inferredLanguage).missingIdentity,
      retryable: false,
      http_status: 400,
      missing_fields: ["chat_id_or_phone"],
    };
  }

  if (!text && !mediaUrls.length) {
    return {
      ok: false,
      error_code: "empty_message",
      error: "text or media_urls is required",
      reply: textCopy(inferredLanguage).emptyMessage,
      retryable: false,
      http_status: 400,
      missing_fields: ["text_or_media_urls"],
    };
  }

  const conversation = getOrCreateConversation(store, {
    chatId,
    phone,
    name: stringValue(payload.name),
    channel: payload.channel ?? "whatsapp",
  });
  const order = conversation.currentOrderId ? store.orders.find((item) => item.id === conversation.currentOrderId) : undefined;
  let language = orderLanguage(order, text);

  conversation.lastMessageAt = new Date().toISOString();
  conversation.updatedAt = conversation.lastMessageAt;

  if (wantsRestart(text)) {
    conversation.currentOrderId = undefined;
    conversation.state = "choosing_toi_type";

    return reply(conversation, undefined, categoryQuestion(language), categoryOptions(language));
  }

  if (wantsAdmin(text)) {
    if (order) {
      order.status = "handoff";
      order.handoffReason = "Customer requested admin/operator";
      order.updatedAt = new Date().toISOString();
      addActionLog(store, "openclaw_handoff_requested", order.id, { text });
    }

    conversation.state = "handoff";
    return reply(conversation, order, textCopy(language).handoff);
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
    return reply(conversation, order, textCopy(language).receiptReceived);
  }

  if (order && mediaUrls.length && mediaKind !== "receipt") {
    const mediaReply = attachMediaToOrder(store, order, mediaUrls, mediaKind, payload, language);

    return reply(conversation, order, mediaReply, nextQuickReplies(conversation.state, language));
  }

  if (!order) {
    const leadOrder = parseOrderFromText(store, text);

    if (leadOrder) {
      language = orderLanguage(leadOrder, text);
      leadOrder.conversationId = conversation.id;
      leadOrder.customerPhone = phone ?? chatId;
      leadOrder.fields = mergeInvitationFields(leadOrder.fields, { contactPhone: phone ?? leadOrder.fields.contactPhone });
      leadOrder.updatedAt = new Date().toISOString();
      conversation.currentOrderId = leadOrder.id;
      conversation.state = leadOrder.fields.hostNames ? "collecting_date" : "collecting_names";
      addActionLog(store, "openclaw_lead_order_attached", leadOrder.id, {
        text,
        chat_id: chatId,
      });

      return reply(
        conversation,
        leadOrder,
        textCopy(language).orderFound(leadOrder.id, templateName(leadOrder.templateId, language, selectedTemplate(store, leadOrder)?.name ?? leadOrder.templateId ?? "-")),
      );
    }

    const selectedFromDemo = parseTemplateCodeFromText(store, text);

    if (selectedFromDemo) {
      const selectedLanguage = parseLanguage(text) ?? inferredLanguage;
      const createdOrder = createOrderFromPayload({
        phone: phone ?? chatId,
        customer_name: payload.name,
        toi_type: selectedFromDemo.toiType,
        template_id: selectedFromDemo.id,
        language: selectedLanguage,
        tariff: "fixed",
        contact_phone: phone,
      });
      language = selectedLanguage;

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
        textCopy(language).designSelected(templateName(selectedFromDemo.id, language, selectedFromDemo.name)),
      );
    }

    const toiType = parseToiType(text);

    if (!toiType) {
      conversation.state = "choosing_toi_type";
      return reply(conversation, undefined, categoryQuestion(language), categoryOptions(language));
    }

    const createdOrder = createOrderFromPayload({
      phone: phone ?? chatId,
      customer_name: payload.name,
      toi_type: toiType,
      language,
      tariff: "fixed",
      contact_phone: phone,
    });

    createdOrder.conversationId = conversation.id;
    createdOrder.price = getTariffPrice("fixed");
    store.orders.unshift(createdOrder);
    conversation.currentOrderId = createdOrder.id;
    conversation.state = "collecting_names";
    addActionLog(store, "openclaw_order_started", createdOrder.id, { text, chat_id: chatId });

    return reply(conversation, createdOrder, textCopy(language).acceptedType(eventTypeLabel(toiType, language)));
  }

  switch (conversation.state) {
    case "choosing_toi_type": {
      const toiType = parseToiType(text);

      if (!toiType) {
        return reply(conversation, order, categoryQuestion(language), categoryOptions(language));
      }

      order.toiType = toiType;
      conversation.state = "collecting_names";
      touchOrder(order);
      return reply(conversation, order, textCopy(language).acceptedType(eventTypeLabel(toiType, language)));
    }

    case "collecting_names":
      if (!text) {
        return reply(conversation, order, textCopy(language).namesRequired);
      }
      order.fields = mergeInvitationFields(order.fields, { hostNames: text });
      conversation.state = "collecting_date";
      touchOrder(order);
      return reply(conversation, order, textCopy(language).dateQuestion);

    case "collecting_date":
      if (!text) {
        return reply(conversation, order, textCopy(language).dateRequired);
      }
      order.fields = mergeInvitationFields(order.fields, { date: text });
      conversation.state = "collecting_time";
      touchOrder(order);
      return reply(conversation, order, textCopy(language).timeQuestion);

    case "collecting_time":
      if (!text) {
        return reply(conversation, order, textCopy(language).timeRequired);
      }
      order.fields = mergeInvitationFields(order.fields, { time: text });
      conversation.state = "collecting_venue";
      touchOrder(order);
      return reply(conversation, order, textCopy(language).venueQuestion);

    case "collecting_venue":
      if (!text) {
        return reply(conversation, order, textCopy(language).venueRequired);
      }
      order.fields = mergeInvitationFields(order.fields, { venueName: text });
      conversation.state = "collecting_address";
      touchOrder(order);
      return reply(conversation, order, textCopy(language).addressQuestion);

    case "collecting_address":
      if (!text) {
        return reply(conversation, order, textCopy(language).addressRequired);
      }
      order.fields = mergeInvitationFields(order.fields, isLink(text) ? { mapLink: text } : { address: text });
      conversation.state = "collecting_language";
      touchOrder(order);
      return reply(conversation, order, textCopy(language).languageQuestion, textCopy(language).languageQuick);

    case "collecting_language":
      {
        const selectedLanguage = parseLanguage(text);
        if (!selectedLanguage) {
          return reply(conversation, order, textCopy(language).languageQuestion, textCopy(language).languageQuick);
        }
        order.language = normalizeLanguage(selectedLanguage);
        language = toPublicLanguage(order.language);
      }
      order.tariff = "fixed";
      order.price = getTariffPrice("fixed");
      conversation.state = order.templateId ? "collecting_slug" : "choosing_template";
      touchOrder(order);

      if (order.templateId) {
        return reply(conversation, order, linkNameQuestion(order, language), textCopy(language).slugQuick);
      }

      return reply(conversation, order, templateQuestion(store, order, language), templateNames(store, order, language));

    case "choosing_template": {
      const template = parseTemplate(store, order, text);

      if (!template) {
        return reply(conversation, order, templateQuestion(store, order, language), templateNames(store, order, language));
      }

      order.templateId = template.id;
      conversation.state = "collecting_slug";
      touchOrder(order);

      return reply(conversation, order, linkNameQuestion(order, language), textCopy(language).slugQuick);
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
        return reply(conversation, order, textCopy(language).contactQuestion);
      }

      return reply(conversation, order, confirmationText(order, selectedTemplate(store, order), language), textCopy(language).confirmQuick);
    }

    case "collecting_contact":
      if (!text) {
        return reply(conversation, order, textCopy(language).contactRequired);
      }
      order.fields = mergeInvitationFields(order.fields, { contactPhone: text });
      conversation.state = "confirming";
      touchOrder(order);
      return reply(conversation, order, confirmationText(order, selectedTemplate(store, order), language), textCopy(language).confirmQuick);

    case "confirming":
      if (isYes(text)) {
        const missing = missingRequiredFields(order.fields);

        if (missing.length) {
          conversation.state = stateForMissingField(missing[0]);
          touchOrder(order);
          return reply(conversation, order, missingFieldQuestion(missing[0], language), nextQuickReplies(conversation.state, language));
        }

        const invitation = createOrUpdateDraftInvitation(store, order.id, order.templateId);
        const invitationText = formatInvitationText(order, selectedTemplate(store, order), language);
        const inviteUrl = `${publicBaseUrl()}/invite/${invitation.slug}`;
        order.status = "waiting_payment";
        conversation.state = "waiting_payment";
        touchOrder(order);
        addActionLog(store, "openclaw_invitation_text_generated", order.id, { invitation_id: invitation.id });

        return {
          ok: true,
          reply: `${invitationText}\n\n${textCopy(language).paymentInstruction(inviteUrl, formatPrice(order.price))}`,
          invitation_text: invitationText,
          state: conversation.state,
          order_id: order.id,
          order,
          missing_fields: missingRequiredFields(order.fields),
          quick_replies: textCopy(language).paymentQuick,
        };
      }

      if (wantsEdit(text)) {
        conversation.state = "handoff";
        order.status = "handoff";
        order.handoffReason = "Customer requested edits after confirmation";
        touchOrder(order);
        return reply(conversation, order, textCopy(language).editHandoff);
      }

      return reply(conversation, order, textCopy(language).editQuestion, textCopy(language).confirmQuick.slice(0, 2));

    case "waiting_payment":
      return reply(conversation, order, textCopy(language).receiptWaiting);

    case "payment_review":
      return reply(conversation, order, textCopy(language).receiptReview);

    case "handoff":
      return reply(conversation, order, textCopy(language).handoffState);

    case "completed":
      return reply(conversation, order, textCopy(language).completed);

    default:
      conversation.state = "choosing_toi_type";
      return reply(conversation, order, categoryQuestion(language), categoryOptions(language));
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

function attachMediaToOrder(store: AgentStore, order: AgentOrder, mediaUrls: string[], mediaKind: MediaKind, payload: OpenClawMessagePayload, language: PublicLanguage) {
  const now = new Date().toISOString();
  const existingGallery = order.fields.galleryUrls ?? [];

  if (mediaKind === "music") {
    order.fields = mergeInvitationFields(order.fields, { musicUrl: mediaUrls[0] });
    touchOrder(order);
    addActionLog(store, "openclaw_music_attached", order.id, {
      media_urls: mediaUrls,
      media_type: payload.media_type ?? payload.mediaType,
    });

    return textCopy(language).musicSaved;
  }

  const [firstPhoto, ...extraPhotos] = mediaUrls;
  order.fields = mergeInvitationFields(order.fields, {
    heroPhotoUrl: order.fields.heroPhotoUrl ?? firstPhoto,
    galleryUrls: [...existingGallery, ...(order.fields.heroPhotoUrl ? mediaUrls : extraPhotos)].slice(0, 12),
  });
  order.updatedAt = now;
  addActionLog(store, "openclaw_photos_attached", order.id, {
    media_urls: mediaUrls,
    media_type: payload.media_type ?? payload.mediaType,
  });

  return textCopy(language).photosSaved;
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

function categoryQuestion(language: PublicLanguage) {
  return language === "kz"
    ? "Сәлеметсіз бе! Қандай тойға шақыру жасаймыз?\n1. Үйлену тойы\n2. Қыз ұзату\n3. Құдалық\n4. Бесік той\n5. Туған күн\n6. Мерейтой\n7. Сүндет той\n8. Тұсаукесер"
    : "Здравствуйте! Для какого события делаем приглашение?\n1. Свадьба\n2. Проводы невесты\n3. Сватовство\n4. Праздник колыбели\n5. День рождения\n6. Юбилей\n7. Обрезание\n8. Первый шаг";
}

function categoryOptions(language: PublicLanguage) {
  return language === "kz"
    ? ["Үйлену тойы", "Қыз ұзату", "Құдалық", "Бесік той", "Туған күн", "Мерейтой", "Сүндет той", "Тұсаукесер"]
    : ["Свадьба", "Проводы невесты", "Сватовство", "Праздник колыбели", "День рождения", "Юбилей", "Обрезание", "Первый шаг"];
}

function orderLanguage(order: AgentOrder | undefined, text?: string): PublicLanguage {
  return order ? toPublicLanguage(order.language) : inferPublicLanguageFromText(text);
}

function styleLabel(style: AgentTemplate["style"], language: PublicLanguage) {
  const labels: Record<PublicLanguage, Record<AgentTemplate["style"], string>> = {
    kz: {
      classic: "классика",
      modern: "заманауи",
      luxury: "сәнді",
      minimal: "минимал",
    },
    ru: {
      classic: "классика",
      modern: "современный",
      luxury: "люкс",
      minimal: "минимал",
    },
  };

  return labels[language][style] ?? style;
}

function templateQuestion(store: AgentStore, order: AgentOrder, language: PublicLanguage) {
  const templates = templatesForOrder(store, order);

  if (!templates.length) {
    return textCopy(language).noTemplates;
  }

  return `${textCopy(language).chooseTemplate}\n${templates.map((template, index) => `${index + 1}. ${templateName(template.id, language, template.name)} (${styleLabel(template.style, language)})\n${publicBaseUrl()}/demo/${template.id}?lang=${language}`).join("\n\n")}`;
}

function linkNameQuestion(order: AgentOrder, language: PublicLanguage) {
  const fallback = createSlug(order.fields.hostNames || order.toiType);
  return [
    textCopy(language).linkNameTitle,
    `${textCopy(language).linkNameExample}: ${fallback}`,
    `${textCopy(language).linkNameResult}: ${publicBaseUrl()}/invite/${fallback}`,
    "",
    textCopy(language).linkNameSkip,
  ].join("\n");
}

function confirmationText(order: AgentOrder, template: AgentTemplate | undefined, language: PublicLanguage) {
  const slug = order.slug ? createSlug(order.slug) : createSlug(order.fields.hostNames || order.toiType);
  return [
    textCopy(language).checkData,
    `${textCopy(language).toi}: ${eventTypeLabel(order.toiType, language)}`,
    `${textCopy(language).names}: ${order.fields.hostNames ?? "-"}`,
    `${textCopy(language).date}: ${order.fields.date ?? "-"}`,
    `${textCopy(language).time}: ${order.fields.time ?? "-"}`,
    `${textCopy(language).venue}: ${order.fields.venueName ?? "-"}`,
    `${textCopy(language).address}: ${order.fields.address ?? order.fields.mapLink ?? "-"}`,
    `${textCopy(language).language}: ${language === "kz" ? "Қазақша" : "Русский"}`,
    `${textCopy(language).price}: ${formatPrice(order.price)}`,
    `${textCopy(language).template}: ${templateName(template?.id ?? order.templateId, language, template?.name ?? order.templateId ?? "-")}`,
    `${textCopy(language).link}: ${publicBaseUrl()}/invite/${slug}`,
    "",
    textCopy(language).confirmOk,
  ].join("\n");
}

function formatInvitationText(order: AgentOrder, template: AgentTemplate | undefined, language: PublicLanguage) {
  const names = order.fields.hostNames ?? (language === "kz" ? "Құрметті қонақтар" : "дорогие гости");
  const date = order.fields.date ?? (language === "kz" ? "күні" : "дата");
  const time = order.fields.time ?? (language === "kz" ? "уақыты" : "время");
  const venue = order.fields.venueName ?? (language === "kz" ? "тойхана" : "зал");
  const address = order.fields.address ?? order.fields.mapLink ?? (language === "kz" ? "мекенжай" : "адрес");
  const program = order.fields.programItems?.length ? `\n\n${textCopy(language).program}:\n${order.fields.programItems.map((item) => `- ${item}`).join("\n")}` : "";

  return [
    `${textCopy(language).invitationTemplate}: ${templateName(template?.id, language, template?.name)}`,
    "",
    textCopy(language).invitationGreeting,
    textCopy(language).invitationLine(names),
    "",
    `${textCopy(language).date}: ${date}`,
    `${textCopy(language).time}: ${time}`,
    `${textCopy(language).venue}: ${venue}`,
    `${textCopy(language).address}: ${address}`,
    program,
    "",
    order.fields.customText ?? textCopy(language).invitationFallback,
  ]
    .filter(Boolean)
    .join("\n");
}

function parseToiType(text: string) {
  const normalized = normalizeForMatch(text);

  if (normalized === "1" || normalized.includes("svad") || normalized.includes("свад") || normalized.includes("уилен") || normalized.includes("үйлен")) return "Свадьба";
  if (normalized === "2" || normalized.includes("uzatu") || normalized.includes("ұзату") || normalized.includes("узату")) return "Қыз ұзату";
  if (normalized === "3" || normalized.includes("qudalyk") || normalized.includes("kudalyk") || normalized.includes("кудалык") || normalized.includes("құдалық") || normalized.includes("кұдалық")) return "Құдалық";
  if (normalized === "4" || normalized.includes("besik") || normalized.includes("бесік") || normalized.includes("бесик") || normalized.includes("колыб")) return "Бесік той";
  if (normalized === "5" || normalized.includes("birthday") || normalized.includes("туған") || normalized.includes("туган") || normalized.includes("день рождения")) return "Туған күн";
  if (normalized === "6" || normalized.includes("mereytoy") || normalized.includes("мерейтой") || normalized.includes("юбилей")) return "Мерейтой";
  if (normalized === "7" || normalized.includes("sundet") || normalized.includes("сүндет") || normalized.includes("сундет") || normalized.includes("обрез")) return "Сүндет той";
  if (normalized === "8" || normalized.includes("tusau") || normalized.includes("тұсау") || normalized.includes("тусау") || normalized.includes("перв")) return "Тұсаукесер";

  return undefined;
}

function parseLanguage(text: string) {
  const normalized = normalizeForMatch(text);

  if (normalized === "1" || normalized === "kz" || normalized.includes("kaz") || normalized.includes("қазақ") || normalized.includes("каз")) return "kz";
  if (normalized === "2" || normalized === "ru" || normalized.includes("rus") || normalized.includes("рус") || normalized.includes("орыс")) return "ru";
  return undefined;
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

  if (
    !normalized ||
    normalized === "-" ||
    normalized.includes("без") ||
    normalized.includes("не важно") ||
    normalized.includes("люб") ||
    normalized.includes("маңызды емес") ||
    normalized.includes("манызды емес") ||
    normalized.includes("бәрібір") ||
    normalized.includes("барибир")
  ) {
    return undefined;
  }

  return createSlug(text);
}

function templatesForOrder(store: AgentStore, order: AgentOrder) {
  const normalizedToi = normalizeForMatch(order.toiType);
  const matched = store.templates.filter((template) => template.isActive && normalizeForMatch(template.toiType) === normalizedToi);
  return matched;
}

function templateNames(store: AgentStore, order: AgentOrder, language = orderLanguage(order)) {
  return templatesForOrder(store, order).map((template, index) => `${index + 1}. ${templateName(template.id, language, template.name)}`);
}

function selectedTemplate(store: AgentStore, order: AgentOrder) {
  return store.templates.find((template) => template.id === order.templateId);
}

function parseOrderFromText(store: AgentStore, text: string) {
  const orderId = text.match(/ord_[a-z0-9-]+/i)?.[0];

  if (!orderId) {
    return undefined;
  }

  return store.orders.find((order) => normalizeForMatch(order.id) === normalizeForMatch(orderId));
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

type MediaKind = "photo" | "music" | "receipt";

function normalizeMediaKind(payload: OpenClawMessagePayload): MediaKind {
  const value = normalizeForMatch(stringValue(payload.media_type) ?? stringValue(payload.mediaType) ?? "");

  if (value.includes("music") || value.includes("audio") || value.includes("song") || value.includes("ән")) {
    return "music";
  }

  if (value.includes("receipt") || value.includes("payment") || value.includes("check") || value.includes("kaspi") || value.includes("чек")) {
    return "receipt";
  }

  return "photo";
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

function wantsEdit(value: string) {
  const normalized = normalizeForMatch(value);
  return normalized.includes("исправ") || normalized.includes("помен") || normalized.includes("измен") || normalized.includes("түзет") || normalized.includes("тузет") || normalized.includes("өзгер") || normalized.includes("озгер");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-KZ").format(price) + " ₸";
}

function buildIdempotency(payload: OpenClawMessagePayload) {
  const explicitKey =
    stringValue(payload.idempotency_key) ??
    stringValue(payload.idempotencyKey) ??
    stringValue(payload.message_id) ??
    stringValue(payload.messageId) ??
    stringValue(payload.webhook_id) ??
    stringValue(payload.webhookId) ??
    stringValue(payload.event_id) ??
    stringValue(payload.eventId);
  const chatId = stringValue(payload.chat_id) ?? stringValue(payload.chatId) ?? stringValue(payload.phone) ?? stringValue(payload.customer_phone) ?? stringValue(payload.customerPhone);
  const normalizedPayload = stableStringify({
    chatId,
    text: cleanText(payload.text),
    mediaUrls: normalizedMediaUrls(payload),
    mediaType: stringValue(payload.media_type) ?? stringValue(payload.mediaType),
    channel: payload.channel ?? "whatsapp",
  });
  const requestHash = sha256(normalizedPayload);

  if (explicitKey) {
    return {
      key: `openclaw:${sha256(explicitKey).slice(0, 48)}`,
      requestHash,
      explicit: true,
    };
  }

  if (!chatId) {
    return undefined;
  }

  return {
    key: `openclaw-fallback:${requestHash}`,
    requestHash,
    explicit: false,
  };
}

function isProcessedMessageExpired(expiresAt?: string) {
  if (!expiresAt) {
    return false;
  }

  return new Date(expiresAt).getTime() <= Date.now();
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value) ?? "null";
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function nextQuickReplies(state: AgentConversationState, language: PublicLanguage) {
  switch (state) {
    case "choosing_toi_type":
      return categoryOptions(language);
    case "collecting_language":
      return textCopy(language).languageQuick;
    case "confirming":
      return textCopy(language).confirmQuick;
    case "waiting_payment":
      return textCopy(language).paymentQuick;
    default:
      return undefined;
  }
}

function stateForMissingField(field: string): AgentConversationState {
  if (field === "host_names") return "collecting_names";
  if (field === "date") return "collecting_date";
  if (field === "time") return "collecting_time";
  if (field === "venue_name") return "collecting_venue";
  if (field === "address_or_map_link") return "collecting_address";
  if (field === "contact_phone") return "collecting_contact";
  return "confirming";
}

function missingFieldQuestion(field: string, language: PublicLanguage) {
  const questions: Record<PublicLanguage, Record<string, string>> = {
    kz: {
      host_names: "Шақыруға есімдер жетіспейді. Есімдерді мәтінмен жазыңыз.",
      date: "Той күні жетіспейді. Мысалы: 20 қыркүйек 2026.",
      time: "Басталу уақыты жетіспейді. Мысалы: 18:00.",
      venue_name: "Зал атауы жетіспейді. Мейрамхана немесе зал атауын жазыңыз.",
      address_or_map_link: "Мекенжай немесе карта жетіспейді. Мекенжайды мәтінмен немесе 2GIS/Google Maps сілтемесімен жіберіңіз.",
      contact_phone: "Ұйымдастырушының байланыс нөмірі жетіспейді. Телефон нөмірін жазыңыз.",
    },
    ru: {
      host_names: "Не хватает имён для приглашения. Напишите имена текстом.",
      date: "Не хватает даты события. Напишите дату, например: 20 сентября 2026.",
      time: "Не хватает времени начала. Напишите время, например: 18:00.",
      venue_name: "Не хватает названия зала. Напишите ресторан или зал.",
      address_or_map_link: "Не хватает адреса или карты. Отправьте адрес текстом или ссылку 2GIS/Google Maps.",
      contact_phone: "Не хватает контактного номера организатора. Напишите номер телефона.",
    },
  };

  return questions[language][field] ?? textCopy(language).missingFallback;
}
