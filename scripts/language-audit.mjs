const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");

const templateIds = [
  "wedding-emerald-envelope",
  "qyz-uzatu-anel",
  "wedding-classic-gold",
  "wedding-emerald-card",
  "wedding-editorial-istara",
  "kudalyk-gold-mobile",
  "besik-amanat",
];

const urls = [
  "/demo?lang=kz",
  "/demo?lang=ru",
  ...templateIds.flatMap((templateId) => [`/demo/${templateId}?lang=kz`, `/demo/${templateId}?lang=ru`]),
];

const forbidden = {
  kz: [
    "Дата",
    "Время",
    "Программа",
    "Музыка",
    "Ваше имя",
    "Отправить",
    "Открыть карту",
    "Дорогие",
    "Приглашаем",
    "Свадебное",
    "Предпросмотр",
    "Поделиться",
    "Посмотреть",
  ],
  ru: [
    "Күні",
    "Уақыты",
    "Бағдарлама",
    "Әуен",
    "Аты-жөніңіз",
    "Жіберу",
    "Картаны ашу",
    "Құрметті",
    "Шақыру",
    "Алдын ала",
    "Бөлісу",
    "Көру",
  ],
};

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let failed = false;

for (const path of urls) {
  const language = path.includes("lang=kz") ? "kz" : "ru";
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    failed = true;
    console.error(`${path}: HTTP ${response.status}`);
    continue;
  }

  const text = visibleText(await response.text());
  const hits = forbidden[language].filter((word) => text.includes(word));

  if (hits.length) {
    failed = true;
    console.error(`${path}: forbidden words: ${hits.join(", ")}`);
    continue;
  }

  console.log(`${path}: ok`);
}

process.exit(failed ? 1 : 0);
