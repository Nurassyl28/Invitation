"use client";

import { Calendar, Camera, Clock, Gift, Heart, MapPin, MessageCircle, Music2, Send, Sparkles, Star, Users } from "lucide-react";
import { useEffect, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { InvitationAudio } from "@/components/invitation-audio";
import type { PublicInviteView } from "@/components/invitation-renderer";
import { copyFor, dateParts, formatDateLong, pad2, parseEventDate, templateName, toPublicLanguage, type PublicLanguage } from "@/lib/i18n";
import { isStitchTemplateId, type StitchTemplateId } from "@/lib/stitch-template-ids";

type StitchCopy = {
  eventTitle: string;
  promise: string;
  storyTitle: string;
  sectionTitle: string;
  finalNote: string;
  photoTone: string;
};

type StitchConfig = {
  className: string;
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  copy: Record<PublicLanguage, StitchCopy>;
};

const stitchConfigs: Record<StitchTemplateId, StitchConfig> = {
  "besik-stitch-heritage": {
    className: "stitch-besik",
    Icon: Gift,
    copy: {
      kz: {
        eventTitle: "Бесік тойға шақырамыз",
        promise: "Сәбидің қуанышына арналған жылы отбасылық кездесу.",
        storyTitle: "Қуанышымызға ортақ болыңыз",
        sectionTitle: "Бесік той сәттері",
        finalNote: "Ақ тілектеріңіз біз үшін қымбат.",
        photoTone: "Нәзік отбасылық фото",
      },
      ru: {
        eventTitle: "Приглашаем на праздник колыбели",
        promise: "Тёплая семейная встреча в честь малыша.",
        storyTitle: "Разделите с нами радость",
        sectionTitle: "Моменты праздника",
        finalNote: "Ваши добрые пожелания особенно важны для нас.",
        photoTone: "Нежные семейные фото",
      },
    },
  },
  "birthday-gold-ornament": {
    className: "stitch-birthday-gold",
    Icon: Star,
    copy: {
      kz: {
        eventTitle: "Туған күнге шақырамыз",
        promise: "Жақын адамдармен өтетін әдемі мерекелік кеш.",
        storyTitle: "Бізбен бірге қуаныңыз",
        sectionTitle: "Мереке сәттері",
        finalNote: "Келуіңіз кешімізді ерекше етеді.",
        photoTone: "Алтын көңіл-күй",
      },
      ru: {
        eventTitle: "Приглашаем на день рождения",
        promise: "Красивый праздничный вечер с близкими людьми.",
        storyTitle: "Будем рады видеть вас",
        sectionTitle: "Моменты праздника",
        finalNote: "Ваше присутствие сделает вечер особенным.",
        photoTone: "Золотое настроение",
      },
    },
  },
  "birthday-emerald-jubilee": {
    className: "stitch-birthday-emerald",
    Icon: Sparkles,
    copy: {
      kz: {
        eventTitle: "Туған күн кешіне шақырамыз",
        promise: "Жасыл реңктегі сәнді әрі жарқын мереке.",
        storyTitle: "Салтанатты кешке келіңіз",
        sectionTitle: "Кеш көріністері",
        finalNote: "Мерекелік көңіл-күйді бірге жасайық.",
        photoTone: "Жасыл салтанат",
      },
      ru: {
        eventTitle: "Приглашаем на праздничный вечер",
        promise: "Элегантный праздник в изумрудной палитре.",
        storyTitle: "Разделите с нами этот вечер",
        sectionTitle: "Кадры вечера",
        finalNote: "Создадим праздничную атмосферу вместе.",
        photoTone: "Изумрудная атмосфера",
      },
    },
  },
  "mereytoy-gold-jubilee": {
    className: "stitch-mereytoy",
    Icon: Users,
    copy: {
      kz: {
        eventTitle: "Мерейтойға шақырамыз",
        promise: "Өмір жолына алғыс пен құрмет арналған салтанатты кеш.",
        storyTitle: "Құрметті қонақ болыңыз",
        sectionTitle: "Мерейтой сәттері",
        finalNote: "Құрметіңіз бен ақ тілегіңізге ризамыз.",
        photoTone: "Қадірлі естеліктер",
      },
      ru: {
        eventTitle: "Приглашаем на юбилей",
        promise: "Торжественный вечер благодарности, уважения и добрых встреч.",
        storyTitle: "Будьте нашим почётным гостем",
        sectionTitle: "Моменты юбилея",
        finalNote: "Спасибо за ваше внимание и добрые слова.",
        photoTone: "Дорогие воспоминания",
      },
    },
  },
  "sundet-blue-royal": {
    className: "stitch-sundet",
    Icon: Gift,
    copy: {
      kz: {
        eventTitle: "Сүндет тойға шақырамыз",
        promise: "Ұлымыздың қуанышына арналған дәстүрлі салтанат.",
        storyTitle: "Төрімізден орын алыңыз",
        sectionTitle: "Сүндет той сәттері",
        finalNote: "Батаңыз бен ақ тілегіңізді күтеміз.",
        photoTone: "Торжественный көк стиль",
      },
      ru: {
        eventTitle: "Приглашаем на торжество",
        promise: "Традиционный семейный праздник в честь сына.",
        storyTitle: "Будем рады видеть вас",
        sectionTitle: "Моменты торжества",
        finalNote: "Будем благодарны за добрые пожелания.",
        photoTone: "Торжественный синий стиль",
      },
    },
  },
  "tusaukeser-gold-baby": {
    className: "stitch-tusau",
    Icon: Heart,
    copy: {
      kz: {
        eventTitle: "Тұсаукесерге шақырамыз",
        promise: "Балапанымыздың алғашқы қадамына арналған қуаныш.",
        storyTitle: "Қадамы құтты болсын",
        sectionTitle: "Алғашқы қадам сәттері",
        finalNote: "Балапанымызға ақ батаңызды беріңіз.",
        photoTone: "Жұмсақ отбасылық реңк",
      },
      ru: {
        eventTitle: "Приглашаем на первый шаг",
        promise: "Семейная радость в честь первых шагов малыша.",
        storyTitle: "Пусть путь будет счастливым",
        sectionTitle: "Моменты первого шага",
        finalNote: "Пусть ваши пожелания станут добрым напутствием.",
        photoTone: "Мягкое семейное настроение",
      },
    },
  },
};

const commonCopy = {
  kz: {
    menu: "Мәзір",
    top: "Шақыру",
    story: "Мәтін",
    details: "Ақпарат",
    photos: "Фото",
    answer: "Жауап",
    calendar: "Күні",
    time: "Уақыты",
    place: "Орны",
    outfit: "Киім үлгісі",
    countdown: "Тойға дейін",
    guests: "Қонақтар",
    share: "WhatsApp арқылы бөлісу",
    submit: "Жауап жіберу",
    yes: "Иә, келемін",
    no: "Келе алмаймын",
    maybe: "Мүмкін",
    wishes: "Тілек қалдыру",
    defaultDress: "Салтанатты киім",
    defaultAddress: "Мекенжай қосылады",
    defaultVenue: "Зал атауы қосылады",
    defaultPhoto: "Клиент фотосы осы жерге қойылады",
  },
  ru: {
    menu: "Меню",
    top: "Приглашение",
    story: "Текст",
    details: "Детали",
    photos: "Фото",
    answer: "Ответ",
    calendar: "Дата",
    time: "Время",
    place: "Место",
    outfit: "Стиль одежды",
    countdown: "До события",
    guests: "Гости",
    share: "Поделиться в WhatsApp",
    submit: "Отправить ответ",
    yes: "Да, приду",
    no: "Не смогу прийти",
    maybe: "Возможно",
    wishes: "Оставить пожелание",
    defaultDress: "Праздничный стиль",
    defaultAddress: "Адрес будет добавлен",
    defaultVenue: "Название зала будет добавлено",
    defaultPhoto: "Фото клиента будет здесь",
  },
} satisfies Record<PublicLanguage, Record<string, string>>;

export function StitchMobileInvite({ invite }: { invite: PublicInviteView }) {
  const language = toPublicLanguage(invite.language);
  const copy = copyFor(language);
  const common = commonCopy[language];
  const config = stitchConfigs[isStitchTemplateId(invite.templateId) ? invite.templateId : "birthday-gold-ornament"];
  const configCopy = config.copy[language];
  const parts = dateParts(invite.date, language);
  const gallery = invite.galleryUrls?.filter(Boolean) ?? [];
  const heroPhoto = invite.heroPhotoUrl || invite.previewImage || "";
  const [countdown, setCountdown] = useState(["00", "00", "00", "00"]);
  const [currentUrl, setCurrentUrl] = useState("");
  const shareText = `${templateName(invite.templateId, language)}: ${invite.names}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`.trim())}`;

  useEffect(() => {
    const tick = () => setCountdown(calculateCountdown(invite.date, invite.time));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [invite.date, invite.time]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".stitch-mobile [data-stitch-reveal]"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [invite.templateId]);

  return (
    <main className={`stitch-mobile ${config.className}`}>
      <header className="stitch-mobile__topbar">
        <button className="stitch-icon-button" type="button" aria-label={common.menu}>
          <span />
          <span />
          <span />
        </button>
        <a href="#top" className="stitch-mobile__brand">
          {templateName(invite.templateId, language)}
        </a>
        <button className="stitch-round-button" type="button" aria-label={copy.music as string}>
          <Music2 size={20} />
        </button>
      </header>

      <section className="stitch-hero" id="top">
        <div className="stitch-paper-card" data-stitch-reveal>
          <DecorativeRibbon />
          <p className="stitch-kicker">{configCopy.eventTitle}</p>
          <h1>{invite.names}</h1>
          <p className="stitch-promise">{configCopy.promise}</p>
          <div className="stitch-date-stack" aria-label={formatDateLong(invite.date, language)}>
            <span>{parts.weekday}</span>
            <strong>{pad2(parts.day)}</strong>
            <span>{parts.monthTitle}</span>
            <small>{parts.year}</small>
          </div>
          <div className="stitch-ornament-line" aria-hidden="true" />
        </div>
      </section>

      <section className="stitch-section stitch-story" data-stitch-reveal>
        <div className="stitch-section__icon">
          <config.Icon size={26} strokeWidth={1.5} />
        </div>
        <p className="stitch-section-label">{common.story}</p>
        <h2>{configCopy.storyTitle}</h2>
        <p>{invite.text}</p>
      </section>

      <section className="stitch-section stitch-photo-panel" data-stitch-reveal>
        <div className="stitch-photo-frame">
          {heroPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroPhoto} alt={invite.names} />
          ) : (
            <div className="stitch-photo-placeholder">
              <Camera size={34} />
              <span>{common.defaultPhoto}</span>
            </div>
          )}
        </div>
        <p>{configCopy.photoTone}</p>
      </section>

      <section className="stitch-section stitch-countdown" data-stitch-reveal>
        <p className="stitch-section-label">{common.countdown}</p>
        <div className="stitch-countdown__grid">
          {(copy.countdownUnits as string[]).map((unit, index) => (
            <article key={unit}>
              <strong>{countdown[index]}</strong>
              <span>{unit}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="stitch-section stitch-details" id="details" data-stitch-reveal>
        <p className="stitch-section-label">{common.details}</p>
        <div className="stitch-detail-grid">
          <DetailCard icon={<Calendar size={22} />} label={common.calendar} value={formatDateLong(invite.date, language)} />
          <DetailCard icon={<Clock size={22} />} label={common.time} value={invite.time} />
          <DetailCard icon={<MapPin size={22} />} label={common.place} value={invite.venue || common.defaultVenue} text={invite.address || common.defaultAddress} wide />
          <DetailCard icon={<Users size={22} />} label={common.outfit} value={invite.dressCode || common.defaultDress} wide />
        </div>
        {invite.mapLink ? (
          <a className="stitch-primary-link" href={invite.mapLink} target="_blank" rel="noreferrer">
            <MapPin size={18} />
            {copy.openMap as string}
          </a>
        ) : null}
      </section>

      <section className="stitch-section stitch-program" data-stitch-reveal>
        <p className="stitch-section-label">{copy.program as string}</p>
        <h2>{copy.eveningProgram as string}</h2>
        <div className="stitch-timeline">
          {invite.program.map((item, index) => {
            const [time, title] = splitProgramItem(item);
            return (
              <article key={`${item}-${index}`} style={{ "--stitch-delay": `${index * 90}ms` } as CSSProperties}>
                <span>{time}</span>
                <p>{title}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="stitch-section stitch-gallery" id="photos" data-stitch-reveal>
        <p className="stitch-section-label">{configCopy.sectionTitle}</p>
        <div className="stitch-gallery__grid">
          {[0, 1, 2, 3].map((index) => (
            <div className="stitch-gallery__item" key={index}>
              {gallery[index] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={gallery[index]} alt={`${invite.names} ${index + 1}`} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="stitch-section stitch-music" data-stitch-reveal>
        <Music2 size={25} />
        <h2>{invite.musicUrl ? (copy.musicReady as string) : (copy.musicAtmosphere as string)}</h2>
        <p>{invite.musicUrl ? (copy.musicReadyText as string) : (copy.musicMissingText as string)}</p>
        <InvitationAudio src={invite.musicUrl} language={language} />
      </section>

      {invite.rsvpEnabled !== false ? (
        <section className="stitch-section stitch-rsvp" id="answer" data-stitch-reveal>
          <p className="stitch-section-label">{copy.confirmAttendance as string}</p>
          <h2>{copy.confirmAttendanceLong as string}</h2>
          <form action={`/api/invite/${invite.slug}/rsvp`} method="post">
            <label>
              <span>{copy.guestName as string}</span>
              <input name="guest_name" placeholder={copy.guestNamePlaceholder as string} required />
            </label>
            <label>
              <span>{copy.guestCount as string}</span>
              <input name="guest_count" type="number" min="1" defaultValue="1" />
            </label>
            <div className="stitch-radio-row">
              <label><input name="status" type="radio" value="yes" defaultChecked /> {common.yes}</label>
              <label><input name="status" type="radio" value="maybe" /> {common.maybe}</label>
              <label><input name="status" type="radio" value="no" /> {common.no}</label>
            </div>
            <label>
              <span>{common.wishes}</span>
              <input name="comment" placeholder={copy.wishPlaceholder as string} />
            </label>
            <button type="submit">
              <Send size={17} />
              {common.submit}
            </button>
          </form>
        </section>
      ) : null}

      <footer className="stitch-footer" data-stitch-reveal>
        <Heart size={22} />
        <p>{configCopy.finalNote}</p>
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          {common.share}
        </a>
      </footer>

      <nav className="stitch-bottom-nav" aria-label={common.menu}>
        <a href="#top">{common.top}</a>
        <a href="#details">{common.details}</a>
        <a href="#photos">{common.photos}</a>
        <a href="#answer">{common.answer}</a>
      </nav>
    </main>
  );
}

function DetailCard({ icon, label, value, text, wide }: { icon: ReactNode; label: string; value: string; text?: string; wide?: boolean }) {
  return (
    <article className={wide ? "is-wide" : ""}>
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      {text ? <p>{text}</p> : null}
    </article>
  );
}

function DecorativeRibbon() {
  return (
    <div className="stitch-ribbon" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}

function splitProgramItem(item: string) {
  const match = item.match(/^([^—-]+)[—-]\s*(.+)$/);
  return match ? [match[1].trim(), match[2].trim()] : ["", item];
}

function calculateCountdown(dateValue: string, timeValue: string) {
  const eventDate = parseEventDate(dateValue);

  if (!eventDate) {
    return ["00", "00", "00", "00"];
  }

  const timeMatch = timeValue.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    eventDate.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0);
  }

  const totalSeconds = Math.max(0, Math.floor((eventDate.getTime() - Date.now()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [pad2(days), pad2(hours), pad2(minutes), pad2(seconds)];
}
