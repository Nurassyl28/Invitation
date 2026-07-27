import { templates } from "@/lib/data";
import type { PublicInviteView } from "@/components/invitation-renderer";
import { toPublicLanguage, type PublicLanguage } from "@/lib/i18n";

type DemoInviteContent = Partial<Omit<PublicInviteView, "language">> & { category: string };

const demos: Record<string, Record<PublicLanguage, DemoInviteContent>> = {
  "wedding-emerald-envelope": {
    kz: {
      category: "Үйлену тойы",
      previewImage: "/images/envelope-open.png",
      names: "Анатолий & Ксения",
      date: "2026-10-03",
      time: "16:30",
      venue: "Green Palace",
      address: "Алматы, Әл-Фараби даңғылы, 77",
      text: "Сіздерді отбасымыз үшін ерекше қуанышты күнге шақырамыз. Осы салтанатты сәтте ақ тілегіңізді білдіріп, қуанышымызға ортақ болуыңызды қалаймыз.",
      program: ["16:30 - Қонақтарды қарсы алу", "17:00 - Неке қию рәсімі", "18:00 - Мерекелік дастархан", "22:30 - Кештің аяқталуы"],
    },
    ru: {
      category: "Свадьба",
      previewImage: "/images/envelope-open.png",
      names: "Анатолий & Ксения",
      date: "2026-10-03",
      time: "16:30",
      venue: "Green Palace",
      address: "Алматы, проспект Аль-Фараби, 77",
      text: "Мы приглашаем вас разделить с нами радостный день, в который мы станем семьёй. В этот волшебный момент нам особенно важно видеть рядом самых близких людей.",
      program: ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Праздничный ужин", "22:30 - Завершение вечера"],
    },
  },
  "qyz-uzatu-anel": {
    kz: {
      category: "Қыз ұзату",
      previewImage: "/images/qyz-hero.jpg",
      names: "Әнел",
      date: "2026-10-24",
      time: "16:00",
      venue: "Aq Saray Grand Hall",
      address: "Алматы, Достық даңғылы, 132",
      text: "Құрметті ағайын-туыс, бауырлар! Сіздерді аяулы қызымыз Әнелдің ұзату тойына шақырамыз. Бұл күн отбасымыз үшін ерекше қуаныш пен ақ батаға толы салтанат.",
      program: ["16:00 - Қонақтарды қарсы алу", "17:00 - Сыңсу", "18:00 - Ақ бата", "19:00 - Қыз ұзату рәсімі"],
    },
    ru: {
      category: "Проводы невесты",
      previewImage: "/images/qyz-hero.jpg",
      names: "Анель",
      date: "2026-10-24",
      time: "16:00",
      venue: "Aq Saray Grand Hall",
      address: "Алматы, проспект Достык, 132",
      text: "Дорогие родные и друзья! Приглашаем вас на торжественные проводы нашей прекрасной дочери Анель. Для нашей семьи это важный и счастливый день, который мы хотим провести рядом с близкими людьми.",
      program: ["16:00 - Встреча гостей", "17:00 - Традиционная церемония", "18:00 - Благословение", "19:00 - Проводы невесты"],
    },
  },
  "wedding-classic-gold": {
    kz: {
      category: "Үйлену тойы",
      previewImage: "/images/kazakh-ornament-yurt.jpg",
      names: "Арман & Аружан",
      date: "2026-09-12",
      time: "18:30",
      venue: "Royal Hall",
      address: "Алматы, Абай даңғылы, 120",
      text: "Құрметті ағайын-туыс, достар! Сіздерді ұлымыз бен келініміздің үйлену тойына шақырамыз. Екі жүрек, бір шаңырақ — қуанышымызға ортақ болыңыздар.",
      program: ["18:30 - Қонақтарды қарсы алу", "19:00 - Салтанатты бөлім", "20:00 - Той дастарханы", "22:30 - Тойдың жалғасы"],
    },
    ru: {
      category: "Свадьба",
      previewImage: "/images/kazakh-ornament-yurt.jpg",
      names: "Арман и Аружан",
      date: "2026-09-12",
      time: "18:30",
      venue: "Royal Hall",
      address: "Алматы, проспект Абая, 120",
      text: "Дорогие родные и друзья! Приглашаем вас на нашу свадьбу. Для нас будет большой честью разделить этот важный день с близкими людьми.",
      program: ["18:30 - Сбор гостей", "19:00 - Торжественная часть", "20:00 - Праздничный ужин", "22:30 - Продолжение вечера"],
    },
  },
  "wedding-emerald-card": {
    kz: {
      category: "Үйлену тойы",
      previewImage: "/images/wc-castle.png",
      names: "Арман & Аружан",
      date: "2026-09-12",
      time: "18:30",
      venue: "Royal Hall",
      address: "Алматы, Абай даңғылы, 120",
      text: "Сіздерді өміріміздегі ең маңызды күндердің біріне шақырамыз. Қуанышымызға ортақ болып, ақ тілегіңізді білдіруіңізді қалаймыз.",
      program: ["18:30 - Қонақтарды қарсы алу", "19:00 - Неке қию рәсімі", "20:00 - Мерекелік дастархан", "22:30 - Кештің аяқталуы"],
    },
    ru: {
      category: "Свадьба",
      previewImage: "/images/wc-castle.png",
      names: "Арман и Аружан",
      date: "2026-09-12",
      time: "18:30",
      venue: "Royal Hall",
      address: "Алматы, проспект Абая, 120",
      text: "С уважением приглашаем вас разделить с нами этот важный день.",
      program: ["18:30 - Сбор гостей", "19:00 - Церемония", "20:00 - Праздничный ужин", "22:30 - Завершение вечера"],
    },
  },
  "wedding-editorial-istara": {
    kz: {
      category: "Үйлену тойы",
      previewImage: "/istara/assets/reference.jpg",
      names: "Евгений & Мария",
      date: "2026-07-20",
      time: "17:00",
      venue: "Aq Garden Hall",
      address: "Алматы, Сейфуллин көшесі, 506",
      text: "Сіздерді қуанышымызға ортақтасуға шақырамыз. Осы ерекше күні жанымызда болып, ақ тілегіңізді білдіруіңіз біз үшін өте маңызды.",
      program: ["16:30 - Қонақтарды қарсы алу", "17:00 - Неке қию рәсімі", "18:00 - Мерекелік кеш", "22:30 - Кештің аяқталуы"],
    },
    ru: {
      category: "Свадьба",
      previewImage: "/istara/assets/reference.jpg",
      names: "Евгений & Мария",
      date: "2026-07-20",
      time: "17:00",
      venue: "Aq Garden Hall",
      address: "Алматы, улица Сейфуллина, 506",
      text: "Мы приглашаем вас разделить с нами радостный день, в который мы станем семьёй. Нам будет особенно приятно видеть вас рядом в этот важный момент.",
      program: ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Банкет", "22:30 - Завершение вечера"],
    },
  },
  "kudalyk-gold-mobile": {
    kz: {
      category: "Құдалық",
      previewImage: "/images/gold-fern-ornament.png",
      names: "Айдана & Нұрсұлтан",
      parentsNames: "Қыз жақ: Асанова Болатбек, Асанова Гүлнар; Ұл жақ: Төлегенов Серік, Төлегенова Райхан",
      date: "2026-10-25",
      time: "16:00",
      venue: "Бақшат мейрамханасы",
      address: "Алматы қ., Абылай хан даңғылы, 11",
      dressCode: "Дәстүрлі немесе ұлттық киімде келулеріңізді сұраймыз",
      text: "Құрметті ағайын-туыс, бауырлар! Сіздерді ұл-қызымыздың құдалық тойына қатысуға шақырамыз!",
      program: ["16:00 - Қонақтарды қарсы алу", "17:00 - Құдалық рәсімі", "18:30 - Ақ дастархан", "20:00 - Тойдың жалғасы"],
    },
    ru: {
      category: "Сватовство",
      previewImage: "/images/gold-fern-ornament.png",
      names: "Айдана & Нурсултан",
      parentsNames: "Сторона невесты: Асанов Болатбек, Асанова Гульнар; Сторона жениха: Толегенов Серик, Толегенова Райхан",
      date: "2026-10-25",
      time: "16:00",
      venue: "Ресторан Бакшат",
      address: "Алматы, проспект Абылай хана, 11",
      dressCode: "Просим прийти в традиционной или национальной одежде",
      text: "Дорогие родные и близкие! Приглашаем вас на торжество сватовства наших детей. Будем рады разделить этот важный день вместе с вами.",
      program: ["16:00 - Встреча гостей", "17:00 - Обряд сватовства", "18:30 - Праздничный ужин", "20:00 - Продолжение вечера"],
    },
  },
  "besik-amanat": {
    kz: {
      category: "Бесік той",
      names: "Асылжан",
      parentsNames: "Ата-анасы: Ержан & Айгерім; Әже-атасы: Серікжан & Гүлнар",
      date: "2026-09-25",
      time: "18:00",
      venue: "«Ritz-Carlton» Almaty",
      address: "Алматы, Әл-Фараби даңғылы, 77/7",
      dressCode: "Ұлттық киімде келулеріңізді сұраймыз",
      text: "«Бала — көңілдің гүлі, көздің нұры»",
      program: ["18:00 - Қонақтарды қарсы алу", "19:30 - Бесікке салу рәсімі", "20:30 - Мерекелік дастархан"],
    },
    ru: {
      category: "Праздник колыбели",
      names: "Асылжан",
      parentsNames: "Родители: Ержан & Айгерим; Бабушка и дедушка: Серикжан & Гульнар",
      date: "2026-09-25",
      time: "18:00",
      venue: "«Ritz-Carlton» Almaty",
      address: "Алматы, проспект Аль-Фараби, 77/7",
      dressCode: "Просим прийти в национальной одежде",
      text: "Дорогие родные и близкие! Приглашаем вас на семейный праздник, посвящённый нашему малышу Асылжану.",
      program: ["18:00 - Встреча гостей", "19:30 - Семейная церемония", "20:30 - Праздничный ужин"],
    },
  },
};

export function getDemoInvite(templateId: string, languageInput?: unknown): PublicInviteView | undefined {
  const language = toPublicLanguage(languageInput);
  const template = templates.find((item) => item.id === templateId);
  const demo = demos[templateId]?.[language];

  if (!template || !demo) {
    return undefined;
  }

  return {
    slug: `demo-${templateId}`,
    templateId,
    type: demo.category,
    names: demo.names ?? "Әнел",
    date: demo.date ?? "2026-04-25",
    time: demo.time ?? "16:00",
    venue: demo.venue ?? "Aq Saray Grand Hall",
    address: demo.address ?? "Алматы",
    text: demo.text ?? template.description,
    program: demo.program ?? ["16:00 - Қонақтарды қарсы алу", "18:00 - Салтанатты бөлім", "19:00 - Қыз ұзату рәсімі"],
    status: "published",
    mapLink: "https://2gis.kz/almaty",
    musicUrl: "",
    heroPhotoUrl: "",
    galleryUrls: [],
    parentsNames: demo.parentsNames,
    dressCode: demo.dressCode,
    rsvpEnabled: true,
    wishesEnabled: true,
    previewImage: demo.previewImage,
    language,
  };
}

export function getAllDemoInvites(languageInput?: unknown) {
  return templates.map((template) => getDemoInvite(template.id, languageInput)).filter((invite): invite is PublicInviteView => Boolean(invite));
}
