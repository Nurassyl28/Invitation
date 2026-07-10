import { templates } from "@/lib/data";
import type { PublicInviteView } from "@/components/invitation-renderer";

const demos: Record<string, Partial<PublicInviteView> & { category: string }> = {
  "wedding-emerald-envelope": {
    category: "Свадьба",
    names: "Анатолий & Ксения",
    date: "2026-10-03",
    time: "16:30",
    venue: "Green Palace",
    address: "Алматы, проспект Аль-Фараби, 77",
    text: "Дорогие гости! Мы приглашаем вас разделить с нами день, когда мы скажем друг другу «Да» и начнём нашу семейную историю. Ваше присутствие сделает этот вечер особенно тёплым.",
    program: ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Ужин", "22:30 - Завершение вечера"],
  },
  "wedding-soft-arch": {
    category: "Свадьба",
    names: "Михаил & София",
    date: "2026-07-21",
    time: "15:00",
    venue: "Royal Hall",
    address: "Астана, Кабанбай батыр, 48",
    text: "Дорогие гости! Мы будем счастливы разделить с вами этот особенный день. Приглашаем отпраздновать нашу свадьбу в атмосфере света, нежности и семейного тепла.",
    program: ["15:00 - Сбор гостей и welcome", "16:00 - Церемония", "17:00 - Банкет", "21:30 - Торт и праздничная программа"],
  },
  "qyz-uzatu-anel": {
    category: "Қыз ұзату",
    names: "Әнел",
    date: "2026-04-25",
    time: "16:00",
    venue: "Aq Saray Grand Hall",
    address: "Алматы, Достық даңғылы, 132",
    text: "Дорогие друзья и родные! Приглашаем вас на қыз ұзату нашей прекрасной дочери Әнел. Для нашей семьи это важное и счастливое событие, и мы хотим провести этот торжественный момент в кругу близких людей.",
    program: ["16:00 - Қонақтарды қарсы алу", "17:00 - Сыңсу", "18:00 - Ақ бата", "19:00 - Қыз ұзату рәсімі"],
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
    rsvpEnabled: true,
    wishesEnabled: true,
  };
}

export function getAllDemoInvites() {
  return templates.map((template) => getDemoInvite(template.id)).filter((invite): invite is PublicInviteView => Boolean(invite));
}
