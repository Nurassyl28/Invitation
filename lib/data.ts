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

export const categories = [
  "Свадьба",
  "Қыз ұзату",
  "Бесік той",
  "Тұсаукесер",
  "Сүндет той",
  "Юбилей",
];

export const templates: Template[] = [
  {
    id: "wedding-emerald-envelope",
    title: "Emerald Envelope Wedding",
    category: "Свадьба",
    tariff: "Premium",
    color: "teal",
    tags: ["wedding", "emerald", "envelope", "wax-seal", "classic"],
    description: "Элегантный свадебный шаблон в тёмно-зелёном цвете: конверт, сургучная печать, классическая каллиграфия, программа, пожелания и RSVP.",
  },
  {
    id: "wedding-soft-arch",
    title: "Soft Arch Wedding",
    category: "Свадьба",
    tariff: "Premium",
    color: "gold",
    tags: ["wedding", "beige", "arch", "minimal", "dress-code"],
    description: "Светлый свадебный шаблон в beige palette: арки, мягкие тени, программа дня, dress code, карта и mobile-first layout.",
  },
  {
    id: "qyz-uzatu-anel",
    title: "Qyz Uzatu Anel",
    category: "Қыз ұзату",
    tariff: "Premium",
    color: "wine",
    tags: ["qyz-uzatu", "saukele", "koshkar-muiz", "photo", "countdown"],
    description: "Фото-ориентированный қыз ұзату шаблон: бордовый фон, алтын ою, сәукеле атмосферасы, countdown, күнтізбе, dress code и RSVP.",
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
