export type Tariff = "Free" | "Standard" | "Premium" | "VIP";

export type Template = {
  id: string;
  title: string;
  category: string;
  tariff: Tariff;
  color: "teal" | "wine" | "gold" | "ink";
  tags: string[];
  description: string;
};

export type PaymentStatus = "approved" | "pending" | "review";

export const MVP_FIXED_PRICE = 12900;

export const mvpCategories = [
  "Свадьба",
  "Қыз ұзату",
  "Құдалық",
  "Бесік той",
  "Туған күн",
  "Мерейтой",
  "Сүндет той",
  "Тұсаукесер",
] as const;

export const categories = [...mvpCategories];

export const templates: Template[] = [
  {
    id: "wedding-emerald-envelope",
    title: "Emerald Envelope Wedding",
    category: "Свадьба",
    tariff: "Premium",
    color: "teal",
    tags: ["wedding", "emerald", "envelope", "wax-seal", "interactive", "animated"],
    description: "Свадебный шаблон в изумрудно-зелёном цвете: обложка с восковой печатью, анимация открытия конверта по клику, имена, программа, пожелания, countdown и RSVP.",
  },
  {
    id: "qyz-uzatu-anel",
    title: "Qyz Uzatu Anel",
    category: "Қыз ұзату",
    tariff: "Premium",
    color: "wine",
    tags: ["qyz-uzatu", "saukele", "koshkar-muiz", "photo", "countdown", "animated"],
    description: "Қыз ұзату шаблон с бордовым ою-орнаментом, летящими ласточками, живым countdown и плавными scroll-анимациями. Фон — казахский арочный узор, фото невесты в национальном костюме.",
  },
  {
    id: "wedding-classic-gold",
    title: "Classic Gold Wedding",
    category: "Свадьба",
    tariff: "Premium",
    color: "gold",
    tags: ["wedding", "gold", "koshkar-muiz", "classic", "kz-ru"],
    description: "Классический казахский свадебный шаблон: қошқар мүйіз ою, алтын жиек, ivory фон, двуязычные тексты (kz/ru), программа вечера, галерея и RSVP.",
  },
  {
    id: "wedding-emerald-card",
    title: "Emerald Card",
    category: "Свадьба",
    tariff: "Standard",
    color: "teal",
    tags: ["wedding", "emerald", "gold", "minimal", "card", "rsvp"],
    description: "Лаконичный свадебный шаблон: изумрудно-зелёный градиент, золотая рамка и акценты, крупный serif, карточки даты/времени/зала, программа и золотая кнопка RSVP.",
  },
  {
    id: "wedding-editorial-istara",
    title: "Garden Gate Wedding",
    category: "Свадьба",
    tariff: "Premium",
    color: "gold",
    tags: ["wedding", "garden", "gate", "sage", "botanical", "rsvp", "animated"],
    description: "Интерактивный свадебный шаблон: первый экран с декоративными воротами, открытие по клику, бумажная карточка в sage/ivory стиле, программа, локация и RSVP.",
  },
  {
    id: "kudalyk-gold-mobile",
    title: "Qudalyk Gold Mobile",
    category: "Құдалық",
    tariff: "Premium",
    color: "gold",
    tags: ["kudalyk", "gold", "ivory", "mobile", "countdown", "rsvp", "kazakh"],
    description: "Мобильный шаблон для құдалық: ivory/gold палитра, гүлдер, той ақпараттары, countdown, галерея және WhatsApp арқылы қатысуды растау.",
  },
  {
    id: "besik-amanat",
    title: "Amanat & Legacy",
    category: "Бесік той",
    tariff: "Premium",
    color: "teal",
    tags: ["besik-toi", "amanat", "emerald", "gold", "ivory", "gallery", "rsvp", "kazakh"],
    description: "Люкс-шаблон для бесік той в стиле Amanat: изумруд/золото/айвори, стеклянные карточки, круглое фото, той бағдарламасы, галерея, RSVP и карта.",
  },
  {
    id: "besik-stitch-heritage",
    title: "Besik Heritage Stitch",
    category: "Бесік той",
    tariff: "Premium",
    color: "gold",
    tags: ["besik-toi", "stitch", "gold", "heritage", "mobile", "ornament", "rsvp"],
    description: "Мобильный Stitch-вариант для бесік той: мягкий ivory фон, золотые орнаменты, семейная карточка, программа, карта, музыка и ответ гостей.",
  },
  {
    id: "birthday-gold-ornament",
    title: "Birthday Gold Ornament",
    category: "Туған күн",
    tariff: "Premium",
    color: "gold",
    tags: ["birthday", "gold", "ornament", "mobile", "celebration", "animated", "rsvp"],
    description: "Праздничный мобильный шаблон для туған күн: золото, мягкая бумажная фактура, крупная дата, программа, фото, музыка и WhatsApp-заказ.",
  },
  {
    id: "birthday-emerald-jubilee",
    title: "Emerald Birthday Jubilee",
    category: "Туған күн",
    tariff: "Premium",
    color: "teal",
    tags: ["birthday", "emerald", "jubilee", "countdown", "gallery", "mobile", "animated"],
    description: "Изумрудный праздничный дизайн для дня рождения или юбилейного вечера: геро-блок, обратный отсчёт, карточки деталей и RSVP.",
  },
  {
    id: "mereytoy-gold-jubilee",
    title: "Mereytoy Gold Jubilee",
    category: "Мерейтой",
    tariff: "Premium",
    color: "wine",
    tags: ["mereytoy", "jubilee", "gold", "burgundy", "elegant", "mobile", "rsvp"],
    description: "Элегантный шаблон для мерейтой: бордо, золото, семейная история, расписание вечера, карта и форма ответа гостей.",
  },
  {
    id: "sundet-blue-royal",
    title: "Sundet Blue Royal",
    category: "Сүндет той",
    tariff: "Premium",
    color: "teal",
    tags: ["sundet-toi", "blue", "royal", "gold", "boy", "mobile", "rsvp"],
    description: "Торжественный шаблон для сүндет той: глубокий синий, золотые детали, галерея, программа, музыка и подтверждение участия.",
  },
  {
    id: "tusaukeser-gold-baby",
    title: "Tusaukeser Gold Baby",
    category: "Тұсаукесер",
    tariff: "Premium",
    color: "gold",
    tags: ["tusaukeser", "baby", "first-steps", "gold", "soft", "mobile", "rsvp"],
    description: "Нежный шаблон для тұсаукесер: светлая палитра, золотые акценты, блок первых шагов, фото, карта и RSVP.",
  },
];

export const invitation = {
  slug: "arman-aruzhan",
  type: "Свадьба",
  names: "Арман и Аружан",
  date: "12 сентября 2026",
  time: "18:30",
  venue: "Royal Hall",
  address: "Алматы, проспект Абая, 120",
  text: "С уважением приглашаем вас разделить с нами этот важный день.",
  program: ["18:30 - Сбор гостей", "19:00 - Церемония", "20:00 - Праздничный ужин"],
};

export const payments = [
  { invite: "arman-aruzhan", client: "Арман", amount: "4 990 ₸", status: "review" as PaymentStatus },
  { invite: "qyz-uzatu-aida", client: "Аида", amount: "6 990 ₸", status: "pending" as PaymentStatus },
  { invite: "besik-toi-ayan", client: "Нуржан", amount: "2 990 ₸", status: "approved" as PaymentStatus },
];

export const guestResponses = [
  { name: "Асем", answer: "Да", count: 2 },
  { name: "Нурлан", answer: "Возможно", count: 3 },
  { name: "Айгуль", answer: "Нет", count: 0 },
];
