import { templates } from "@/lib/data";
import type { PublicInviteView } from "@/components/invitation-renderer";

const demos: Record<string, Partial<PublicInviteView> & { category: string }> = {
  "wedding-emerald-envelope": {
    category: "Свадьба",
    previewImage: "/images/envelope-open.png",
    names: "Анатолий & Ксения",
    date: "2026-10-03",
    time: "16:30",
    venue: "Green Palace",
    address: "Алматы, проспект Аль-Фараби, 77",
    text: "Мы приглашаем вас разделить с нами радостный день, в который мы станем семьёй. В этот волшебный день мы скажем друг другу «Да» и соединим наши сердца и судьбы в окружении самых близких и родных людей.",
    program: ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Праздничный ужин", "22:30 - Завершение вечера"],
  },
  "qyz-uzatu-anel": {
    category: "Қыз ұзату",
    previewImage: "/images/qyz-hero.jpg",
    names: "Әнел",
    date: "2026-10-24",
    time: "16:00",
    venue: "Aq Saray Grand Hall",
    address: "Алматы, Достық даңғылы, 132",
    text: "Дорогие друзья и родные! Приглашаем вас на қыз ұзату нашей прекрасной дочери Әнел. Для нашей семьи это важное и счастливое событие — мы провожаем нашу дочь во взрослую жизнь и хотим провести этот торжественный момент в кругу близких людей.",
    program: ["16:00 - Қонақтарды қарсы алу", "17:00 - Сыңсу", "18:00 - Ақ бата", "19:00 - Қыз ұзату рәсімі"],
  },
  "wedding-classic-gold": {
    category: "Свадьба",
    previewImage: "/images/kazakh-ornament-yurt.jpg",
    names: "Арман & Аружан",
    date: "2026-09-12",
    time: "18:30",
    venue: "Royal Hall",
    address: "Алматы, проспект Абая, 120",
    text: "Құрметті ағайын-туыс, достар! Сіздерді ұлымыз бен келініміздің үйлену тойына шақырамыз. Екі жүрек, бір шаңырақ — қуанышымызға ортақ болыңыздар.",
    program: ["18:30 - Қонақтарды қарсы алу", "19:00 - Салтанатты бөлім", "20:00 - Той дастарханы", "22:30 - Тойдың жалғасы"],
  },
  "wedding-emerald-card": {
    category: "Свадьба",
    previewImage: "/images/wc-castle.png",
    names: "Арман и Аружан",
    date: "12 сентября 2026",
    time: "18:30",
    venue: "Royal Hall",
    address: "Алматы, проспект Абая, 120",
    text: "С уважением приглашаем вас разделить с нами этот важный день.",
    program: ["18:30 - Сбор гостей", "19:00 - Церемония", "20:00 - Праздничный ужин", "22:30 - Завершение вечера"],
  },
  "wedding-editorial-istara": {
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
  "kudalyk-gold-mobile": {
    category: "Құдалық",
    previewImage: "/images/gold-fern-ornament.png",
    names: "Айдана & Нұрсұлтан",
    parentsNames: "Қыз жақ: Асанова Болатбек, Асанова Гүлнар; Ұл жақ: Төлегенов Серік, Төлегенова Райхан",
    date: "2026-10-25",
    time: "16:00",
    venue: "Бақшат мейрамханасы",
    address: "Алматы қ., Абылай хан даңғ., 11",
    dressCode: "Дәстүрлі / ұлттық киімде келулеріңізді сұраймыз",
    text: "Құрметті ағайын-туыс, бауырлар! Сіздерді ұл-қызымыздың құдалық тойына қатысуға шақырамыз!",
    program: ["16:00 - Қонақтарды қарсы алу", "17:00 - Құдалық рәсімі", "18:30 - Ақ дастархан", "20:00 - Тойдың жалғасы"],
  },
};

export function getDemoInvite(templateId: string): PublicInviteView | undefined {
  const template = templates.find((item) => item.id === templateId);
  const demo = demos[templateId];

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
  };
}

export function getAllDemoInvites() {
  return templates.map((template) => getDemoInvite(template.id)).filter((invite): invite is PublicInviteView => Boolean(invite));
}
