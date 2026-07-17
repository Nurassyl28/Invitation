import { Calendar, Camera, Heart, MapPin, MessageCircle, Music2, Send, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { QyzUzatuInvite } from "@/components/qyz-uzatu-invite";
import { EmeraldEnvelopeInvite } from "@/components/emerald-envelope-invite";
import { EmeraldCardInvite } from "@/components/emerald-card-invite";
import { EditorialWeddingInvite } from "@/components/editorial-wedding-invite";

export type PublicInviteView = {
  slug: string;
  templateId?: string;
  type: string;
  names: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  text: string;
  program: string[];
  status?: string;
  mapLink?: string;
  musicUrl?: string;
  heroPhotoUrl?: string;
  galleryUrls?: string[];
  rsvpEnabled?: boolean;
  wishesEnabled?: boolean;
};

type InviteTheme = {
  className: string;
  eventLabel: string;
  storyTitle: string;
  visualLabel: string;
  quote: string;
};

const themes: Record<string, InviteTheme> = {
  "wedding-classic-gold": {
    className: "template-wedding-classic-gold",
    eventLabel: "Үйлену тойына шақыру",
    storyTitle: "Құрметті ағайын-туыс, достар!",
    visualLabel: "Classic gold ceremony",
    quote: "Екі жүрек, бір аманат",
  },
  "velvet-arch": {
    className: "template-wedding-modern-emerald",
    eventLabel: "Үйлену тойына шақыру",
    storyTitle: "Бізбен бірге қуанышымызды бөлісіңіз",
    visualLabel: "Modern emerald",
    quote: "A modern toi with heritage soul",
  },
  "royal-silk": {
    className: "template-qyz-uzatu-saukele-luxury",
    eventLabel: "Қыз ұзату",
    storyTitle: "Ақ босағаға арналған салтанат",
    visualLabel: "Saukele luxury",
    quote: "Салт-дәстүр мен нәзіктіктің кеші",
  },
  "warm-story": {
    className: "template-besik-toi-soft-cream",
    eventLabel: "Бесік той",
    storyTitle: "Сәбидің қуанышына шақыру",
    visualLabel: "Soft cream",
    quote: "Береке мен мейірімге толы күн",
  },
  "bright-steps": {
    className: "template-tusau-kesu-bright-steps",
    eventLabel: "Тұсаукесер",
    storyTitle: "Алғашқы қадамға шақырамыз",
    visualLabel: "Bright steps",
    quote: "Қадамы құтты болсын",
  },
  "heritage-day": {
    className: "template-sundet-toi-heritage-green",
    eventLabel: "Сүндет той",
    storyTitle: "Ұлымыздың қуанышына шақырамыз",
    visualLabel: "Heritage green",
    quote: "Ел дәстүрі, отбасы мерейі",
  },
  "golden-night": {
    className: "template-jubilee-golden-night",
    eventLabel: "Мерейтой",
    storyTitle: "Қадірлі кештің құрметті қонағы болыңыз",
    visualLabel: "Golden night",
    quote: "A night of legacy and gratitude",
  },
};

const fallbackTheme = themes["wedding-classic-gold"];

export function InvitationRenderer({ invite }: { invite: PublicInviteView }) {
  const theme = themes[invite.templateId ?? ""] ?? fallbackTheme;
  const gallery = invite.galleryUrls?.filter(Boolean) ?? [];

  if (invite.templateId === "qyz-uzatu-anel") {
    return <QyzUzatuInvite invite={invite} />;
  }

  if (invite.templateId === "wedding-emerald-envelope") {
    return <EmeraldEnvelopeInvite invite={invite} />;
  }

  if (invite.templateId === "wedding-emerald-card") {
    return <EmeraldCardInvite invite={invite} />;
  }

  if (invite.templateId === "wedding-editorial-istara") {
    return <EditorialWeddingInvite invite={invite} />;
  }

  if (invite.templateId === "wedding-classic-gold") {
    return <WeddingClassicGoldInvite invite={invite} />;
  }

  return (
    <main className={`toi-invite-canvas ${theme.className}`}>
      <div className="toi-fixed-language">KZ / RU</div>
      <section className="toi-hero">
        <div className="toi-grain" />
        <div className="toi-floating-orb orb-one" />
        <div className="toi-floating-orb orb-two" />
        <div className="toi-hero-ornament" aria-hidden="true" />
        <div className="toi-hero-content">
          {invite.status === "draft" ? <span className="toi-pill">Draft preview</span> : null}
          <span className="toi-kicker">{theme.eventLabel}</span>
          <h1>{invite.names}</h1>
          <p className="toi-quote">{theme.quote}</p>
          <div className="toi-date-card">
            <Calendar size={18} />
            <strong>{invite.date}</strong>
            <span>{invite.time}</span>
          </div>
        </div>
      </section>

      <section className="toi-section toi-story toi-reveal">
        <Sparkles size={24} />
        <h2>{theme.storyTitle}</h2>
        <p>{invite.text}</p>
        <p>Бұл күні қуанышымызға ортақ болып, ақ батаңызды беруге шақырамыз.</p>
      </section>

      <section className="toi-section toi-details toi-reveal delay-one">
        <div className="toi-section-label">When & where</div>
        <div className="toi-detail-grid">
          <article>
            <Calendar size={20} />
            <span>Күні мен уақыты</span>
            <strong>{invite.date}</strong>
            <p>{invite.time}</p>
          </article>
          <article>
            <MapPin size={20} />
            <span>Өтетін орны</span>
            <strong>{invite.venue}</strong>
            <p>{invite.address}</p>
          </article>
        </div>
        {invite.mapLink ? (
          <a className="toi-action secondary" href={invite.mapLink}>
            <MapPin size={17} />
            Картаны ашу
          </a>
        ) : null}
      </section>

      <section className="toi-section toi-visual toi-reveal delay-two">
        <div className="toi-photo-arch">
          {invite.heroPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={invite.heroPhotoUrl} alt={invite.names} />
          ) : (
            <div className="toi-photo-placeholder">
              <Camera size={34} />
              <span>{theme.visualLabel}</span>
            </div>
          )}
        </div>
      </section>

      <section className="toi-section toi-program toi-reveal delay-three">
        <div className="toi-section-label">Program</div>
        <h2>Той бағдарламасы</h2>
        <div className="toi-timeline">
          {invite.program.map((item, index) => (
            <div className="toi-timeline-item" key={`${item}-${index}`} style={{ "--item-delay": `${index * 120}ms` } as CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="toi-section toi-gallery toi-reveal delay-four">
        <div className="toi-section-label">Gallery</div>
        <div className="toi-gallery-grid">
          {[0, 1, 2].map((index) => (
            <div className="toi-gallery-card" key={index}>
              {gallery[index] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={gallery[index]} alt={`${invite.names} gallery ${index + 1}`} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="toi-section toi-music toi-reveal delay-five">
        <Music2 size={22} />
        <div>
          <span className="toi-section-label">Music</span>
          <h2>{invite.musicUrl ? "Музыка дайын" : "Музыкалық атмосфера"}</h2>
          <p>{invite.musicUrl ? "Қонақтар шақыруды музыкамен ашады." : "Тарифке қарай музыка қосуға болады."}</p>
        </div>
        <div className="toi-equalizer" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      {invite.rsvpEnabled ? (
        <section className="toi-section toi-rsvp toi-reveal delay-six" id="rsvp">
          <MessageCircle size={24} />
          <h2>Қатысуыңызды растаңыз</h2>
          <div className="toi-rsvp-grid">
            <label>
              <span>Имя</span>
              <input placeholder="Ваше имя" />
            </label>
            <label>
              <span>Гостей</span>
              <input defaultValue="2" type="number" />
            </label>
            <label className="full">
              <span>Пожелание</span>
              <textarea placeholder="Жылы тілегіңіз..." />
            </label>
          </div>
          <button className="toi-action" type="button">
            <Send size={17} />
            Жіберу
          </button>
        </section>
      ) : null}

      <section className="toi-section toi-footer">
        <Heart size={20} />
        <p>Сізді асыға күтеміз</p>
        <a className="toi-action secondary" href={`https://wa.me/?text=toi-invite.kz/invite/${invite.slug}`}>
          WhatsApp арқылы бөлісу
        </a>
      </section>
    </main>
  );
}

const weddingFallbackImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0EHduWy7cA2Ng-cfaCj9URjaiFURzjuVJB_OU0Lj25EIn6mt0iW9kZJHWnhkX1SQh84UT4Je9rYvirloHAP9vmttTP70wxP8FCeHpNzGGzH5pdzfZJO9eBOSva8P85NhvrGddbgYk1hv_TCWIeQ75NH-rtW_fDSoIrIvvrpKjyCts5tIjm4B82XsKO5w-Xp8vGmVTDeuyZIP5vKGmppgtJ0suayUwHXEWKAvUnnN3cKQJsKb1F17zFfIbb7282as2HS5xo7nk1ds",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDCNWGdUF3ApoHfOQw5UtGg4ck697DfOmqBYmfSPuQlbAQG2H7PwrArb7uTK-R5pBZZ4xyDKlga8f7YXOuoCqhMxKrcDhiZr43uQdT56BaMZ_t89ZahkJ2tLQ4S3pPnaHF4FZFFCdmkIBpjKOfMpZfYlGLvWZRRNYx9EfI-PvckxsPuuHXnnehfBbissLls3EJi1c6njngDeGyXnaR1VuAPwPHvo6xbRIFFnNwv5vWWc-cFFga301SoV1RLlKmVAvpaTJwy_i8_sAc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDAMZySc3J0EhJpedbAPPQTCli30pWY8O5pelTm34G9yjSfJxP-RoOgA2Bqx3zs9b7kUhQricdcQ7OfLNEdT3mwKBxQ6FhhjhDHFVGP_pzypLE7Ud4A5L3pmfN99B-37kGHwhlot48pNZV39BSIA8axD_HPeQHAlTvLP8u_FSBA5F7TNYg22LdZHW9kiPv-5gLAlY3vXgp_10MlWWu6g9rj6IwtAOYt58ecVtPb9NacBjlaWWc5ow_6BihIBNz0OKZI269klJoxN4k",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGZ8K56fN19fb2YXbUfpcAgqXT4NC5a3tkeD_fPlyvqS5b4xTXK-nkzq65rw5KaGyujmC3X39bCBFKDuCdbC5N8Y4HxNt_-cXwS2xUItK35ovlgdvpuX7uP2d7ecAzHjiUI4QOUphmx-ZYr61RTjFtxt9a4X7YTlqgNnQEyXDfbgIypKA3Lk7ym80rKsdz77cEvR6cXmt1nRALM5_pm--BnGLH0fUZeoqQvOVYR9MQY8-A3QtmnhYMajkoRPBtkdHEF4jCyGxX9t4",
];

function WeddingClassicGoldInvite({ invite }: { invite: PublicInviteView }) {
  const date = splitInviteDate(invite.date);
  const names = splitInviteNames(invite.names);
  const gallery = [invite.heroPhotoUrl, ...(invite.galleryUrls ?? []), ...weddingFallbackImages].filter(Boolean);
  const shareText = encodeURIComponent(`Сізді тойымызға шақырамыз: https://dellover.live/invite/${invite.slug}`);

  return (
    <main className="amanat-wedding">
      <header className="amanat-topbar">
        <a aria-label="Бағдарламаға өту" href="#program">
          <span />
          <span />
          <span />
        </a>
        <strong>Amanat</strong>
        <a aria-label="Музыка" href="#music">
          <Music2 size={22} />
        </a>
      </header>

      <section className="amanat-hero" id="hero">
        <div className="amanat-hero-pattern" />
        <div className="amanat-oyu-rail left" aria-hidden="true" />
        <div className="amanat-oyu-rail right" aria-hidden="true" />
        <div className="amanat-hero-card">
          <div className="amanat-mini-oyu top" aria-hidden="true" />
          <div className="amanat-mark" aria-hidden="true">
            <span />
          </div>
          {invite.status === "draft" ? <p className="amanat-status">Draft preview</p> : null}
          <p className="amanat-kicker">Қошқар мүйіз өрнегімен</p>
          <p className="amanat-script">Үйлену той</p>
          <h1>
            <span>{names.first}</span>
            <em>&amp;</em>
            <span>{names.second}</span>
          </h1>
          <div className="amanat-divider">
            <Sparkles size={18} />
          </div>
          <p className="amanat-hero-date">{invite.date}</p>
          <p className="amanat-hero-copy">Екі жүрек, бір шаңырақ. Сіздерді қуанышымыздың қадірлі қонағы болуға шақырамыз.</p>
          <div className="amanat-mini-oyu bottom" aria-hidden="true" />
        </div>
        <a className="amanat-scroll" href="#invitation" aria-label="Төмен өту">
          ↓
        </a>
      </section>

      <div className="amanat-oyu-band" aria-hidden="true" />

      <section className="amanat-invitation amanat-reveal amanat-from-left" id="invitation">
        <div className="amanat-section-inner">
          <Sparkles className="amanat-section-icon" size={38} />
          <h2>Құрметті ағайын-туыс, достар!</h2>
          <p>{invite.text}</p>
          <div className="amanat-divider slim">
            <Heart size={16} />
          </div>
          <h2>Дорогие родные и друзья!</h2>
          <p>Будем рады видеть вас рядом в день, когда начинается наша семейная история. Ваше присутствие и добрые пожелания станут для нас большой честью.</p>
        </div>
      </section>

      <section className="amanat-date-grid amanat-reveal" id="details">
        <article className="amanat-info-card amanat-slide-card left">
          <span>Дата / Күні</span>
          <strong>{date.day}</strong>
          <p>{date.month}</p>
          <small>{date.year}</small>
        </article>
        <article className="amanat-photo-card amanat-slide-card center" style={{ "--photo-url": `url(${gallery[0]})` } as CSSProperties}>
          <div>
            <Camera size={20} />
            <span>{invite.names}</span>
          </div>
        </article>
        <article className="amanat-info-card amanat-slide-card right">
          <span>Время / Уақыты</span>
          <strong>{invite.time}</strong>
          <p>Қонақтарды қарсы алу</p>
          <small>Банкет / Той дастарханы</small>
        </article>
      </section>

      <section className="amanat-venue amanat-reveal amanat-from-right" id="venue">
        <div>
          <span className="amanat-kicker">Мекен-жайы / Адрес</span>
          <h2>{invite.venue}</h2>
          <p>{invite.address}</p>
          {invite.mapLink ? (
            <a className="amanat-primary-action" href={invite.mapLink}>
              <MapPin size={18} />
              Картаны ашу
            </a>
          ) : null}
        </div>
        <div className="amanat-venue-photo" style={{ "--photo-url": `url(${gallery[1]})` } as CSSProperties} />
      </section>

      <section className="amanat-program amanat-reveal amanat-from-left" id="program">
        <div className="amanat-section-title">
          <Sparkles size={26} />
          <h2>Кеш бағдарламасы</h2>
          <p>Программа вечера</p>
        </div>
        <div className="amanat-timeline">
          {invite.program.map((item, index) => {
            const program = splitProgramItem(item);
            return (
              <article className="amanat-timeline-item" key={`${item}-${index}`}>
                <div>
                  <strong>{program.time}</strong>
                  <p>{program.title}</p>
                </div>
                <span>{index + 1}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="amanat-gallery amanat-reveal amanat-from-right" id="gallery">
        <div className="amanat-gallery-head">
          <div>
            <h2>Фотогалерея</h2>
            <p>Beautiful moments of us</p>
          </div>
          <Camera size={28} />
        </div>
        <div className="amanat-gallery-grid">
          {[0, 1, 2, 3].map((index) => (
            <div className="amanat-gallery-photo" key={index} style={{ "--photo-url": `url(${gallery[index]})` } as CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="amanat-tradition amanat-reveal amanat-from-left">
        <div className="amanat-tradition-copy">
          <span className="amanat-kicker">Қазақы нақыш</span>
          <h2>Ұлттық өрнек пен салтанат</h2>
          <p>Шаблонда қошқар мүйіз, алтын жиек, жылы ivory фон және ұлттық той атмосферасы сақталады. Фото келген кезде осы блоктар клиенттің суреттерімен ауысады.</p>
        </div>
        <div className="amanat-ornament-cards" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="amanat-music amanat-reveal amanat-from-right" id="music">
        <Music2 size={28} />
        <div>
          <h2>{invite.musicUrl ? "Музыка дайын" : "Музыкалық атмосфера"}</h2>
          <p>{invite.musicUrl ? "Қонақтар шақыруды музыкамен ашады." : "Бұл блокқа клиент таңдаған ән қосылады."}</p>
        </div>
        <div className="amanat-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      {invite.rsvpEnabled ? (
        <section className="amanat-rsvp amanat-reveal amanat-from-left" id="rsvp">
          <MessageCircle size={34} />
          <h2>Өтінеміз, келетініңізді растаңыз</h2>
          <p>Подтвердите участие, чтобы ұйымдастырушылар қонақ санын алдын ала білсін.</p>
          <div className="amanat-rsvp-grid">
            <label>
              <span>Ваше имя / Есіміңіз</span>
              <input placeholder="Атыңызды жазыңыз" />
            </label>
            <label>
              <span>Қонақ саны</span>
              <input defaultValue="2" type="number" />
            </label>
            <label className="full">
              <span>Тілек / Пожелание</span>
              <textarea placeholder="Жылы тілегіңіз..." />
            </label>
          </div>
          <button className="amanat-primary-action" type="button">
            <Send size={18} />
            Жіберу / Отправить
          </button>
        </section>
      ) : null}

      <footer className="amanat-footer">
        <div className="amanat-divider">
          <Heart size={18} />
        </div>
        <h2>{invite.names}</h2>
        <p>Сізді асыға күтеміз</p>
      </footer>

      <nav className="amanat-bottom-nav" aria-label="Invitation navigation">
        <a href="#invitation">Шақыру</a>
        <a href="#program">Бағдарлама</a>
        <a href="#rsvp">RSVP</a>
        <a href={`https://wa.me/?text=${shareText}`}>Бөлісу</a>
      </nav>
    </main>
  );
}

function splitInviteNames(names: string) {
  const parts = names.split(/\s*[&+]\s*|\s+(?:и|және)\s+/i).filter(Boolean);

  if (parts.length >= 2) {
    return { first: parts[0], second: parts.slice(1).join(" ") };
  }

  return { first: names, second: "Той" };
}

function splitInviteDate(date: string) {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    const monthNames: Record<string, { label: string; ru: string }> = {
      "01": { label: "Қаңтар / Январь", ru: "января" },
      "02": { label: "Ақпан / Февраль", ru: "февраля" },
      "03": { label: "Наурыз / Март", ru: "марта" },
      "04": { label: "Сәуір / Апрель", ru: "апреля" },
      "05": { label: "Мамыр / Май", ru: "мая" },
      "06": { label: "Маусым / Июнь", ru: "июня" },
      "07": { label: "Шілде / Июль", ru: "июля" },
      "08": { label: "Тамыз / Август", ru: "августа" },
      "09": { label: "Қыркүйек / Сентябрь", ru: "сентября" },
      "10": { label: "Қазан / Октябрь", ru: "октября" },
      "11": { label: "Қараша / Ноябрь", ru: "ноября" },
      "12": { label: "Желтоқсан / Декабрь", ru: "декабря" },
    };
    const month = monthNames[isoMatch[2]];

    return {
      day: String(Number(isoMatch[3])),
      month: month?.label ?? isoMatch[2],
      monthRu: month?.ru,
      monthNumber: isoMatch[2],
      year: isoMatch[1],
    };
  }

  const parts = date.trim().split(/\s+/);
  const year = parts.find((part) => /\d{4}/.test(part)) ?? "";
  const day = parts[0]?.replace(/[^\d]/g, "") || parts[0] || date;
  const month = parts
    .slice(1)
    .filter((part) => part !== year)
    .join(" ");

  return {
    day,
    month: month || date,
    monthRu: month || date,
    monthNumber: undefined,
    year,
  };
}

function splitProgramItem(item: string) {
  const match = item.match(/^([^–—-]+)\s*[–—-]\s*(.+)$/);

  if (!match) {
    return { time: "", title: item };
  }

  return {
    time: match[1].trim(),
    title: match[2].trim(),
  };
}
