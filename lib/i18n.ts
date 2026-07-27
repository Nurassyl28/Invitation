export type PublicLanguage = "kz" | "ru";
export type StoredLanguage = PublicLanguage | "kz_ru";

export function toPublicLanguage(value: unknown, fallback: PublicLanguage = "kz"): PublicLanguage {
  if (typeof value !== "string") {
    return fallback;
  }

  const language = value.toLowerCase().replace("+", "_").trim();

  if (language === "ru" || language === "rus" || language.includes("рус")) {
    return "ru";
  }

  if (language === "kz" || language === "kk" || language === "kaz" || language.includes("қазақ") || language.includes("каз")) {
    return "kz";
  }

  return fallback;
}

export function inferPublicLanguageFromText(value: string | undefined, fallback: PublicLanguage = "kz"): PublicLanguage {
  const text = value?.toLowerCase() ?? "";

  if (!text) {
    return fallback;
  }

  if (/[әғқңөұүһі]/i.test(text) || text.includes("qyz") || text.includes("kudalyk") || text.includes("qudalyk")) {
    return "kz";
  }

  if (text.includes("свад") || text.includes("рус") || text.includes("заказ") || text.includes("дизайн") || text.includes("приглаш")) {
    return "ru";
  }

  return fallback;
}

export function languageParam(language: PublicLanguage) {
  return `lang=${language}`;
}

export function withLanguage(path: string, language: PublicLanguage) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${languageParam(language)}`;
}

export const languageNames: Record<PublicLanguage, string> = {
  kz: "Қазақша",
  ru: "Русский",
};

export const eventTypeCopy = {
  kz: {
    wedding: "Үйлену тойы",
    qyzUzatu: "Қыз ұзату",
    kudalyk: "Құдалық",
    besikToi: "Бесік той",
    birthday: "Туған күн",
    mereytoy: "Мерейтой",
    sundetToi: "Сүндет той",
    tusaukeser: "Тұсаукесер",
    unknown: "Той",
  },
  ru: {
    wedding: "Свадьба",
    qyzUzatu: "Проводы невесты",
    kudalyk: "Сватовство",
    besikToi: "Праздник колыбели",
    birthday: "День рождения",
    mereytoy: "Юбилей",
    sundetToi: "Обрезание",
    tusaukeser: "Первый шаг",
    unknown: "Событие",
  },
} satisfies Record<PublicLanguage, Record<string, string>>;

export function eventTypeLabel(value: string | undefined, language: PublicLanguage) {
  const normalized = (value ?? "").toLowerCase();

  if (normalized.includes("qyz") || normalized.includes("қыз") || normalized.includes("кыз") || normalized.includes("uzatu") || normalized.includes("ұзату")) {
    return eventTypeCopy[language].qyzUzatu;
  }

  if (normalized.includes("kudalyk") || normalized.includes("qudalyk") || normalized.includes("құдалық") || normalized.includes("кудалык")) {
    return eventTypeCopy[language].kudalyk;
  }

  if (normalized.includes("besik") || normalized.includes("бесік") || normalized.includes("бесик")) {
    return eventTypeCopy[language].besikToi;
  }

  if (normalized.includes("birthday") || normalized.includes("туған") || normalized.includes("туган") || normalized.includes("день рождения")) {
    return eventTypeCopy[language].birthday;
  }

  if (normalized.includes("mereytoy") || normalized.includes("мерейтой") || normalized.includes("юбилей")) {
    return eventTypeCopy[language].mereytoy;
  }

  if (normalized.includes("sundet") || normalized.includes("сүндет") || normalized.includes("сундет") || normalized.includes("обрез")) {
    return eventTypeCopy[language].sundetToi;
  }

  if (normalized.includes("tusau") || normalized.includes("тұсау") || normalized.includes("тусау") || normalized.includes("перв")) {
    return eventTypeCopy[language].tusaukeser;
  }

  if (normalized.includes("wedding") || normalized.includes("свад") || normalized.includes("үйлен") || normalized.includes("уилен")) {
    return eventTypeCopy[language].wedding;
  }

  return value || eventTypeCopy[language].unknown;
}

export const templateDisplayNames: Record<string, Record<PublicLanguage, string>> = {
  "wedding-emerald-envelope": {
    kz: "Жасыл конверт",
    ru: "Изумрудный конверт",
  },
  "qyz-uzatu-anel": {
    kz: "Әнел қыз ұзату",
    ru: "Проводы невесты Анель",
  },
  "wedding-classic-gold": {
    kz: "Алтын өрнек",
    ru: "Классическое золото",
  },
  "wedding-emerald-card": {
    kz: "Жасыл салтанат",
    ru: "Изумрудная карточка",
  },
  "wedding-editorial-istara": {
    kz: "Бақ қақпасы",
    ru: "Садовые ворота",
  },
  "kudalyk-gold-mobile": {
    kz: "Алтын құдалық",
    ru: "Золотое сватовство",
  },
  "besik-amanat": {
    kz: "Аманат бесік той",
    ru: "Аманат: праздник колыбели",
  },
  "besik-stitch-heritage": {
    kz: "Мұра бесік той",
    ru: "Наследие колыбели",
  },
  "birthday-gold-ornament": {
    kz: "Алтын туған күн",
    ru: "Золотой день рождения",
  },
  "birthday-emerald-jubilee": {
    kz: "Жасыл туған күн",
    ru: "Изумрудный день рождения",
  },
  "mereytoy-gold-jubilee": {
    kz: "Алтын мерейтой",
    ru: "Золотой юбилей",
  },
  "sundet-blue-royal": {
    kz: "Көк сүндет той",
    ru: "Синий торжественный",
  },
  "tusaukeser-gold-baby": {
    kz: "Алтын тұсаукесер",
    ru: "Первый шаг в золоте",
  },
};

export function templateName(templateId: string | undefined, language: PublicLanguage, fallback?: string) {
  if (!templateId) {
    return fallback ?? labels[language].templateFallback;
  }

  return templateDisplayNames[templateId]?.[language] ?? fallback ?? templateId;
}

export const months = {
  kz: {
    lower: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
    title: ["Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым", "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан"],
    weekdays: ["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"],
    weekdaysLower: ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"],
    weekdaysShort: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"],
  },
  ru: {
    lower: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    title: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    weekdaysLower: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    weekdaysShort: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"],
  },
} satisfies Record<PublicLanguage, Record<string, string[]>>;

export function parseEventDate(value: string): Date | undefined {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 0, 0, 0);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function formatDateLong(value: string, language: PublicLanguage) {
  const date = parseEventDate(value);

  if (!date) {
    return value;
  }

  const day = date.getDate();
  const month = months[language].lower[date.getMonth()];
  const year = date.getFullYear();

  return language === "kz" ? `${day} ${month} ${year} жыл` : `${day} ${month} ${year}`;
}

export function dateParts(value: string, language: PublicLanguage, fallbackDay = 20, fallbackMonthIndex = 6, fallbackYear = 2026) {
  const date = parseEventDate(value);
  const day = date ? date.getDate() : fallbackDay;
  const monthIndex = date ? date.getMonth() : fallbackMonthIndex;
  const year = date ? date.getFullYear() : fallbackYear;
  const weekdayIndex = date ? date.getDay() : 5;

  return {
    date,
    day,
    monthIndex,
    monthLower: months[language].lower[monthIndex],
    monthTitle: months[language].title[monthIndex],
    year,
    weekday: months[language].weekdays[weekdayIndex],
    weekdayLower: months[language].weekdaysLower[weekdayIndex],
  };
}

export function pad2(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-KZ").format(price) + " ₸";
}

export const labels = {
  kz: {
    htmlLang: "kk",
    navSection: "Онлайн шақырулар",
    navDemo: "Үлгілер",
    navPrimary: "Негізгі мәзір",
    openMenu: "Мәзірді ашу",
    closeMenu: "Мәзірді жабу",
    demoMetaTitle: "Шақыру үлгілері — Toi",
    demoEyebrow: "MVP каталогы",
    demoTitle: "Шақыру үлгілері",
    demoLead: (price: string) => `Той түрін таңдаңыз, үлгіні ашыңыз және клиентке сілтеме жіберіңіз. Қазір дайын үлгілер және тұрақты баға: ${price} ₸.`,
    demoWhatsappText: "Шақыру үлгілерін қараңыз",
    demoFilterAria: "Той түрі бойынша сүзгі",
    eventType: "Той түрі",
    showByCategory: "Санат бойынша үлгілер",
    all: "Барлығы",
    view: "Көру",
    emptyEyebrow: "Бос",
    emptyTitle: "Үлгілер жоқ",
    emptyText: "Бұл санатқа арналған үлгілер әлі қосылған жоқ.",
    backToDemos: "Барлық үлгілер",
    orderThisDesign: "Осы үлгіге тапсырыс беру",
    templateFallback: "Үлгі",
    draftPreview: "Алдын ала көру",
    date: "Күні",
    dateTime: "Күні мен уақыты",
    time: "Уақыты",
    venue: "Өтетін орны",
    address: "Мекенжай",
    location: "Орны",
    openMap: "Картаны ашу",
    program: "Бағдарлама",
    eveningProgram: "Кеш бағдарламасы",
    gallery: "Фото",
    music: "Әуен",
    musicReady: "Әуен дайын",
    musicAtmosphere: "Әуенді сүйемелдеу",
    musicReadyText: "Қонақтар шақыруды әуенмен ашады.",
    musicMissingText: "Бұл жерге клиент таңдаған әуен қосылады.",
    musicLabel: "Шақыру әуені",
    confirmAttendance: "Қатысуыңызды растаңыз",
    confirmAttendanceLong: "Келетініңізді алдын ала хабарлаңыз.",
    guestName: "Аты-жөніңіз",
    guestNamePlaceholder: "Аты-жөніңізді жазыңыз",
    guestCount: "Қонақ саны",
    wish: "Тілек",
    wishPlaceholder: "Жылы тілегіңіз",
    send: "Жіберу",
    share: "Бөлісу",
    shareWhatsapp: "WhatsApp арқылы бөлісу",
    waitForYou: "Сізді асыға күтеміз",
    countdownTitle: "Тойға дейін",
    countdownUnits: ["күн", "сағат", "минут", "секунд"],
    scrollDown: "Төмен сырғытыңыз",
    menu: "Мәзір",
    click: "Басыңыз",
    invited: "Шақыру",
    weddingInvite: "Үйлену тойына шақыру",
    dearGuests: "Құрметті қонақтар!",
    dearRelatives: "Құрметті ағайын-туыс, достар!",
    weddingStory: "Сіздерді қуанышымызға ортақтасып, ақ тілектеріңізді білдіруге шақырамыз.",
    qyzCoverTitle: "Қыз ұзату",
    qyzCoverSubtitle: "Шақыру",
    qyzDear: "Құрметті ағайын-туыс, бауырлар!",
    qyzTextExtra: "Осы қуанышты күнде төрімізден орын алып, ақ тілегіңізді білдіруіңізді сұраймыз.",
    nationalDress: "Ұлттық киім үлгісі",
    dressExamples: "Ұлттық киімге арналған ұсыныстар",
    female: "Әйел",
    male: "Ер",
    photo: "сурет",
    beginningAt: "Басталуы",
    familyBride: "Қыз жақ",
    familyGroom: "Ұл жақ",
    daughter: "Қызымыз",
    son: "Ұлымыз",
    dressCode: "Киім үлгісі",
    traditionalDress: "Дәстүрлі немесе ұлттық киімде келулеріңізді сұраймыз",
    qudalykMoments: "Құдалық сәттері",
    previous: "Алдыңғы",
    next: "Келесі",
    attendByWhatsapp: "Қатысатыныңызды хабарлаңыз",
    gratitude: "Ақ дастарханымыздан ауыз тигендеріңізге мың алғыс!",
    weMarry: "Біз үйленеміз!",
    weddingNote: "Сіздерді осы ерекше күннің құрметті қонағы болуға шақырамыз.",
    ceremonyLocation: "Өтетін орны",
    quoteWedding: "Екі жүрек, бір шаңырақ",
    quoteWeddingText: "Ақ тілектеріңіз жаңа өміріміздің ең әдемі бастамасы болады.",
    seeYou: "Тойда жүздескенше",
    dayProgram: "Күн бағдарламасы",
    wishes: "Тілектер",
    envelopeNote: "Бұл шақыру сізге арнайы жолданды. Біз үшін маңызды күні сізді жанымыздан көргіміз келеді.",
    happyNews: "Қуанышты жаңалықты жеткізуге асықпыз: біз үйленеміз.",
    ourMonth: "Біздің айымыз",
    schedule: "Кеш кестесі",
    finale: "Қорытынды",
    quoteLife: "Өмір — әдемі сапар. Оны сүйіспеншілікке арнаған дұрыс.",
    wishesOne: "Ізгі тілектеріңіз біз үшін ерекше бағалы.",
    wishesTwo: "Мерекеміз ересектерге арналған форматта өтеді, сондықтан балалар бойынша алдын ала жоспарлауды сұраймыз.",
    wishesThree: "Мереке чатына қосылып, қосымша ақпарат алып, фото мен бейнелермен бөлісе аласыз.",
    contactOrganizer: "Той күні сұрақтарыңызды ұйымдастырушыға жолдай аласыз.",
    sayYesThrough: "Біз айтатын күнге дейін",
    shareLink: "Сілтемені бөлісу",
    besikDateTitle: "Той күні",
    besikProgramTitle: "Кеш бағдарламасы",
    answerFormTitle: "Жауап беру",
    areYouComing: "Келесіз бе?",
    yesComing: "Иә, әрине",
    noComing: "Өкінішке орай, келе алмаймын",
    openWithNavigator: "Навигатормен ашу",
  },
  ru: {
    htmlLang: "ru",
    navSection: "Онлайн-приглашения",
    navDemo: "Демо",
    navPrimary: "Основная навигация",
    openMenu: "Мәзірді ашу",
    closeMenu: "Закрыть меню",
    demoMetaTitle: "Демо шаблоны — Toi",
    demoEyebrow: "Каталог MVP",
    demoTitle: "Дизайны приглашений",
    demoLead: (price: string) => `Выберите тип события, откройте дизайн и отправьте клиенту ссылку. Сейчас в запуске готовые дизайны и фиксированная цена ${price} ₸.`,
    demoWhatsappText: "Посмотрите демо шаблоны приглашений",
    demoFilterAria: "Фильтр по типу события",
    eventType: "Тип события",
    showByCategory: "Показать дизайны по категории",
    all: "Все",
    view: "Посмотреть",
    emptyEyebrow: "Пусто",
    emptyTitle: "Шаблонов нет",
    emptyText: "Для этой категории пока нет готовых дизайнов.",
    backToDemos: "Все демо",
    orderThisDesign: "Заказать этот дизайн",
    templateFallback: "Шаблон",
    draftPreview: "Предпросмотр",
    date: "Дата",
    dateTime: "Дата и время",
    time: "Время",
    venue: "Место проведения",
    address: "Адрес",
    location: "Локация",
    openMap: "Открыть карту",
    program: "Программа",
    eveningProgram: "Программа вечера",
    gallery: "Фото",
    music: "Музыка",
    musicReady: "Музыка готова",
    musicAtmosphere: "Музыкальная атмосфера",
    musicReadyText: "Гости откроют приглашение с музыкой.",
    musicMissingText: "Сюда будет добавлена выбранная клиентом мелодия.",
    musicLabel: "Музыка приглашения",
    confirmAttendance: "Подтвердите участие",
    confirmAttendanceLong: "Пожалуйста, сообщите заранее, сможете ли вы прийти.",
    guestName: "Ваше имя",
    guestNamePlaceholder: "Имя и фамилия",
    guestCount: "Количество гостей",
    wish: "Пожелание",
    wishPlaceholder: "Ваше пожелание",
    send: "Отправить",
    share: "Поделиться",
    shareWhatsapp: "Поделиться в WhatsApp",
    waitForYou: "Будем ждать вас",
    countdownTitle: "До торжества осталось",
    countdownUnits: ["дней", "часов", "минут", "секунд"],
    scrollDown: "Листайте вниз",
    menu: "Меню",
    click: "Нажмите",
    invited: "Приглашение",
    weddingInvite: "Свадебное приглашение",
    dearGuests: "Дорогие гости!",
    dearRelatives: "Дорогие родные и друзья!",
    weddingStory: "Будем рады видеть вас рядом в день, когда начинается наша семейная история.",
    qyzCoverTitle: "Проводы невесты",
    qyzCoverSubtitle: "Приглашение",
    qyzDear: "Дорогие друзья и родные!",
    qyzTextExtra: "Приглашаем вас разделить с нами этот праздник и стать дорогими гостями трепетного события.",
    nationalDress: "Национальный костюм",
    dressExamples: "Рекомендации по образам",
    female: "Женский",
    male: "Мужской",
    photo: "фото",
    beginningAt: "Начало",
    familyBride: "Сторона невесты",
    familyGroom: "Сторона жениха",
    daughter: "Наша дочь",
    son: "Наш сын",
    dressCode: "Дресс-код",
    traditionalDress: "Просим прийти в традиционной или национальной одежде",
    qudalykMoments: "Моменты сватовства",
    previous: "Предыдущий",
    next: "Следующий",
    attendByWhatsapp: "Сообщите о присутствии",
    gratitude: "Благодарим за ваше присутствие и тёплые пожелания!",
    weMarry: "Мы женимся!",
    weddingNote: "Будем счастливы видеть вас рядом в этот особенный день.",
    ceremonyLocation: "Место проведения",
    quoteWedding: "Две судьбы, одна семья",
    quoteWeddingText: "Ваши добрые пожелания станут красивым началом нашей новой жизни.",
    seeYou: "До встречи на торжестве",
    dayProgram: "Программа дня",
    wishes: "Пожелания",
    envelopeNote: "Это приглашение отправлено специально вам. В важный для нас день мы очень хотим видеть вас рядом.",
    happyNews: "Спешим сообщить радостную новость: мы женимся.",
    ourMonth: "Наш месяц",
    schedule: "Расписание вечера",
    finale: "Завершение",
    quoteLife: "Жизнь — прекрасное путешествие. Важно провести его рядом с любовью.",
    wishesOne: "Мы будем благодарны за ваши добрые пожелания.",
    wishesTwo: "Праздник проходит в формате для взрослых, поэтому просим заранее продумать вопрос с детьми.",
    wishesThree: "В чате праздника можно узнать детали и поделиться фото и видео.",
    contactOrganizer: "В день торжества все вопросы можно направить организатору.",
    sayYesThrough: "Мы скажем «да» через",
    shareLink: "Поделиться ссылкой",
    besikDateTitle: "Дата праздника",
    besikProgramTitle: "Программа вечера",
    answerFormTitle: "Ответ гостя",
    areYouComing: "Вы придёте?",
    yesComing: "Да, конечно",
    noComing: "К сожалению, не смогу",
    openWithNavigator: "Открыть в навигаторе",
  },
} satisfies Record<PublicLanguage, Record<string, string | string[] | ((value: string) => string)>>;

export function copyFor(language: PublicLanguage) {
  return labels[language];
}
