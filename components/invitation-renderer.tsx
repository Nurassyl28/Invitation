import { Calendar, Camera, Gift, Heart, MapPin, MessageCircle, Music2, Send, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";

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
  "wedding-modern-emerald": {
    className: "template-wedding-modern-emerald",
    eventLabel: "Wedding celebration",
    storyTitle: "Бізбен бірге қуанышымызды бөлісіңіз",
    visualLabel: "Modern emerald",
    quote: "A modern toi with heritage soul",
  },
  "qyz-uzatu-saukele-luxury": {
    className: "template-qyz-uzatu-saukele-luxury",
    eventLabel: "Қыз ұзату",
    storyTitle: "Ақ босағаға арналған салтанат",
    visualLabel: "Saukele luxury",
    quote: "Салт-дәстүр мен нәзіктіктің кеші",
  },
  "qyz-uzatu-silk-minimal": {
    className: "template-qyz-uzatu-silk-minimal",
    eventLabel: "Қыз ұзату кеші",
    storyTitle: "Нәзік қуанышқа шақырамыз",
    visualLabel: "Silk minimal",
    quote: "Pearl light, family warmth",
  },
  "besik-toi-soft-cream": {
    className: "template-besik-toi-soft-cream",
    eventLabel: "Бесік той",
    storyTitle: "Сәбидің қуанышына шақыру",
    visualLabel: "Soft cream",
    quote: "Береке мен мейірімге толы күн",
  },
  "besik-toi-heritage-cradle": {
    className: "template-besik-toi-heritage-cradle",
    eventLabel: "Бесікке салу",
    storyTitle: "Ұрпақ қуанышы, отбасы мерекесі",
    visualLabel: "Heritage cradle",
    quote: "Бесіктен басталған береке",
  },
  "tusau-kesu-bright-steps": {
    className: "template-tusau-kesu-bright-steps",
    eventLabel: "Тұсаукесер",
    storyTitle: "Алғашқы қадамға шақырамыз",
    visualLabel: "Bright steps",
    quote: "Қадамы құтты болсын",
  },
  "tusau-kesu-modern-pastel": {
    className: "template-tusau-kesu-modern-pastel",
    eventLabel: "Tusau kesu",
    storyTitle: "Кішкентай қуаныштың үлкен күні",
    visualLabel: "Modern pastel",
    quote: "Soft colors, joyful steps",
  },
  "sundet-toi-heritage-green": {
    className: "template-sundet-toi-heritage-green",
    eventLabel: "Сүндет той",
    storyTitle: "Ұлымыздың қуанышына шақырамыз",
    visualLabel: "Heritage green",
    quote: "Ел дәстүрі, отбасы мерейі",
  },
  "sundet-toi-royal-blue": {
    className: "template-sundet-toi-royal-blue",
    eventLabel: "Сүндет тойына шақыру",
    storyTitle: "Салтанатты кешке қош келдіңіз",
    visualLabel: "Royal blue",
    quote: "A proud family celebration",
  },
  "jubilee-golden-night": {
    className: "template-jubilee-golden-night",
    eventLabel: "Мерейтой",
    storyTitle: "Қадірлі кештің құрметті қонағы болыңыз",
    visualLabel: "Golden night",
    quote: "A night of legacy and gratitude",
  },
  "jubilee-warm-family": {
    className: "template-jubilee-warm-family",
    eventLabel: "Юбилей / Мерейтой",
    storyTitle: "Отбасылық мерекеге шақырамыз",
    visualLabel: "Warm family",
    quote: "Жылдар жылуы, отбасы төрі",
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
    return <QyzUzatuAnelInvite invite={invite} />;
  }

  if (invite.templateId === "wedding-emerald-envelope") {
    return <EmeraldEnvelopeWeddingInvite invite={invite} />;
  }

  if (invite.templateId === "wedding-soft-arch") {
    return <SoftArchWeddingInvite invite={invite} />;
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

const qyzUzatuFallbackImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBZGHPTEk5x56xP4U3ZRCY3-R3zuv_m127Jj7oHPtpeUZv42_oH6hc2CdHvDMTt8K9d4eHmp0iz3almMZ7kHVNwNoUgy7ZEdn2cKExpsmxnqLXRevNk2V8FH13ZaCdSNc-5WOKiSE6vuJ00PMF-N1lAARs10SpnqvTpsCuZMc7-R1DZY7b1XuR6Wly-TotxbQP4hpO7ZbWN-omudk49kuX-Z_4dAvtQBr-JbC0bG6RmdBa1B_hJU4GRCNg5ZM41E-BwJ5wUNrjpU9I",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAEkDdd3tVhwN5pGQ8VLLlA_AxXhX2mgzCcHvutebCNlpY4nTcLwpx3jdbH9j-siDQLhZT5clW9zedOJ08XNRVS20d4OB2jXULPlluMXPhJfiW_RUOLh9WNJ3wcpr3JsCDkzlYQj3vqRzNWKSiQ5ffBPAewrna9DBJX3vl8jUKtZw-ml9IVYzhvPtwPLssLaYJlv5UMo8D3Iw4OvMzFo4W4exT-5wS2OJ2KFcnnIChzmqY-3FhCrgMPcZMBMClCGmuEeRNLHGoZOvE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAh7G70tZMXDPfEm5xqzJm2DT5r5Q07KFE7Ljv7izzDuCIR2s0iTY4xxlUiiFsnzOPTPiKXISWYSTR7yNfhAKJBCz0gb29yGNfS_eHKBd0UTuZNWGFLifwK37ZzC7Yre1tDVhK50zrNsBkPv8D6gXBSiNIwLecjFnvuvbVGDgLDzYJb44yQdPzpPGccpjXVBR6MRUKiPeQe76vjUftFL1Fs4oSGv-OzjVdJawR7uoaFKwrAW6PvVHW6aNJgnS7ifn4E8hTeBPnaMQU",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmW6bO9UWFcqn7Bz0eT4x6W3alKo_TEy6ivYiv8a2BQiT5ivEuSsH-W0THqkOpCKOBE5ttnrhu2kragJ1qWTxxkRfjs5ZDC64kGsjZvU9Wr5c6WK8SRBrgRsUGiVrWnf6ZU4QXBbERSL9MKTuUDMlx1ahxEJ-35E8kyvtT7fd2lnIe4NE3fXSjJkPSywcManE2UIZOcF5CHMXlZAFE_lEwyoHRsEesaO0kF746zXM2YeN7onrZI_lMqdZ8FtnToPP9SxMC97HJYPY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBKYOFMNzT8IQdEOYTr0Tz33zAUFJeE3g8lkMbK96jg2vWfUC9r8ADVwxORaKUK-H9meYLYDHkNjKPAt7IU5bicrbJ_FRwcQOwXspSHditYSDpLj4H68uU8leVc1thSz1QODvEaH9ju2Cs4hVLvFImhTcf1KCMcjOkkeQ8RBoJ-NZxD8BCsIJ5FZMfOu-OccOTlwv0P8gljDXO3rVqqwtM1Njv9av-wDMQyRuV_-R-6-bZoaO_MXvGpfizVwWhTRrQFKHZOp9w3xdQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMCCwy3z7GhBKEYRPF9jwWnyDXPuMubGP2nv57nj21JkcvL6dRHUzI97ADK2BQ4PuU0J2rbhZQYGVHBujSHWZn-En7ufvMZTFuXoPkJDmjrZ4RjkhK9-nEr5toCjBhB8pxYUSDyHX6GLyoQrPe3ooNhkRw9EoKhT4lceLAW1CzEwhS-pxSaChqToJFbKDjQm5dClA-B3-u4rdJ0LquJVw3p6xc_cyrGjLRWiu4KZ3hFHSmXWi69BmmFlwTiTV9GIVASZRDm4K9Zro",
];

function QyzUzatuAnelInvite({ invite }: { invite: PublicInviteView }) {
  const date = splitInviteDate(invite.date);
  const countdown = countdownParts(invite.date);
  const gallery = [invite.heroPhotoUrl, ...(invite.galleryUrls ?? []), ...qyzUzatuFallbackImages].filter(Boolean);
  const program = invite.program.length ? invite.program : ["16:00 - Қонақтарды қарсы алу", "17:00 - Сыңсу", "18:00 - Ақ бата", "19:00 - Қыз ұзату рәсімі"];
  const shareText = encodeURIComponent(`Қыз ұзату шақыруы: https://dellover.live/invite/${invite.slug}`);

  return (
    <main className="qyz-template">
      <div className="qyz-blur-bg" style={{ "--photo-url": `url(${gallery[0]})` } as CSSProperties} />
      <header className="qyz-topbar">
        <a href="#invitation" aria-label="Шақыру">
          <span />
          <span />
        </a>
        <strong>Amanat</strong>
        <a href="#music" aria-label="Музыка">
          <Music2 size={21} />
        </a>
      </header>

      <section className="qyz-hero" id="hero">
        <div className="qyz-hero-title qyz-reveal-down">
          <p>Qyz Uzatu</p>
          <span>Shaqyru</span>
        </div>
        <div className="qyz-phone qyz-reveal-up" style={{ "--photo-url": `url(${gallery[0]})` } as CSSProperties}>
          <div className="qyz-phone-notch" />
          <div className="qyz-phone-overlay">
            <strong>{invite.names}</strong>
            <span>QYZ UZATU</span>
            <small>ПРОВЕДИТЕ ВВЕРХ</small>
            <em>{formatDateShort(date)}</em>
          </div>
        </div>
        <div className="qyz-hero-oyu left" aria-hidden="true" />
        <div className="qyz-hero-oyu right" aria-hidden="true" />
      </section>

      <section className="qyz-countdown qyz-section qyz-slide-right" style={{ "--photo-url": `url(${gallery[1]})` } as CSSProperties}>
        <div className="qyz-countdown-glass">
          <p>До торжества осталось:</p>
          <div>
            <strong>{countdown.days}</strong>
            <span>дней</span>
          </div>
          <div>
            <strong>{countdown.hours}</strong>
            <span>часов</span>
          </div>
          <div>
            <strong>{countdown.minutes}</strong>
            <span>минут</span>
          </div>
          <div>
            <strong>{countdown.seconds}</strong>
            <span>секунд</span>
          </div>
        </div>
      </section>

      <section className="qyz-date-card qyz-section qyz-slide-left" id="date">
        <p className="qyz-script-date">{formatDateLong(date)}</p>
        <h2>Начало в {invite.time}</h2>
        <div className="qyz-calendar">
          <span>{date.month || "Сәуір / Апрель"} {date.year}</span>
          <div className="qyz-week">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
              <b key={day}>{day}</b>
            ))}
          </div>
          <div className="qyz-days">
            {Array.from({ length: 30 }, (_, index) => {
              const day = index + 1;
              return <em className={day === Number(date.day) ? "active" : ""} key={day}>{day}</em>;
            })}
          </div>
        </div>
      </section>

      <section className="qyz-invitation qyz-section qyz-slide-right" id="invitation">
        <div className="qyz-red-oyu" aria-hidden="true" />
        <Sparkles size={28} />
        <h2>Дорогие друзья и родные!</h2>
        <p>{invite.text}</p>
        <p>И хотим провести этот торжественный момент в кругу близких людей. Приглашаем разделить с нами этот праздник, став хорошими гостями прекрасного и радостного события.</p>
      </section>

      <section className="qyz-dress qyz-section qyz-slide-left">
        <span className="qyz-kicker">қазақский национальный костюм</span>
        <h2>Dress code</h2>
        <p>Примеры женских и мужских нарядов</p>
        <div className="qyz-dress-grid">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div className="qyz-dress-photo" key={index} style={{ "--photo-url": `url(${gallery[index % gallery.length]})` } as CSSProperties}>
              <span>{index < 3 ? "Әйел" : "Ер"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="qyz-program qyz-section qyz-slide-right" id="program">
        <span className="qyz-kicker">Той бағдарламасы</span>
        <h2>Салтанатты кеш</h2>
        <div className="qyz-program-list">
          {program.map((item, index) => {
            const row = splitProgramItem(item);
            return (
              <article key={`${item}-${index}`}>
                <strong>{row.time || String(index + 1).padStart(2, "0")}</strong>
                <p>{row.title}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="qyz-map qyz-section qyz-slide-left" id="venue">
        <MapPin size={30} />
        <h2>{invite.venue}</h2>
        <p>{invite.address}</p>
        {invite.mapLink ? (
          <a href={invite.mapLink}>
            Картаны ашу
          </a>
        ) : null}
      </section>

      <section className="qyz-music qyz-section qyz-slide-right" id="music">
        <Music2 size={28} />
        <div>
          <h2>Музыка</h2>
          <p>{invite.musicUrl ? "Клиент таңдаған ән қосылады." : "Мұнда қыз ұзату әні немесе фон музыкасы болады."}</p>
        </div>
        <div className="qyz-bars" aria-hidden="true"><span /><span /><span /><span /></div>
      </section>

      {invite.rsvpEnabled ? (
        <section className="qyz-rsvp qyz-section qyz-slide-left" id="rsvp">
          <MessageCircle size={30} />
          <h2>Растау / RSVP</h2>
          <p>Өтініш, келетініңізді алдын ала хабарлаңыз.</p>
          <label>
            <span>Аты-жөніңіз / Ваше имя</span>
            <input placeholder="Толық атыңызды жазыңыз" />
          </label>
          <label>
            <span>Қонақтар саны</span>
            <input defaultValue="2" type="number" />
          </label>
          <button type="button">
            <Send size={17} />
            Жіберу / Отправить
          </button>
        </section>
      ) : null}

      <footer className="qyz-footer">
        <Heart size={18} />
        <p>Сізді асыға күтеміз</p>
        <strong>{invite.names}</strong>
      </footer>

      <nav className="qyz-bottom-nav" aria-label="Qyz uzatu navigation">
        <a href="#hero">Басы</a>
        <a href="#program">Program</a>
        <a href="#rsvp">RSVP</a>
        <a href={`https://wa.me/?text=${shareText}`}>Share</a>
      </nav>
    </main>
  );
}

function EmeraldEnvelopeWeddingInvite({ invite }: { invite: PublicInviteView }) {
  const names = splitInviteNames(invite.names);
  const date = splitInviteDate(invite.date);
  const countdown = countdownParts(invite.date);
  const program = invite.program.length ? invite.program : ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Ужин", "22:30 - Завершение"];
  const shareText = encodeURIComponent(`Свадебное приглашение: https://dellover.live/invite/${invite.slug}`);
  const activeDay = Number(date.day);

  return (
    <main className="emerald-wedding">
      <header className="emerald-topbar">
        <a href="#invitation" aria-label="Открыть приглашение">
          <span />
          <span />
        </a>
        <strong>Amanat Wedding</strong>
        <a href="#rsvp" aria-label="RSVP">
          <Heart size={20} />
        </a>
      </header>

      <section className="emerald-envelope-hero" id="hero">
        <div className="emerald-castle-bg" aria-hidden="true" />
        <div className="emerald-brand-strip">SÄUKELE INVITATIONS</div>
        <div className="emerald-envelope-card">
          <div className="emerald-envelope-lines" aria-hidden="true" />
          <span className="emerald-kicker">Вы приглашены</span>
          <h1>на свадьбу</h1>
          <a className="emerald-wax" href="#invitation">
            нажмите
          </a>
          <p>Это приглашение создано персонально для вас. Будем рады видеть вас рядом в наш особенный день.</p>
        </div>
      </section>

      <section className="emerald-name-frame emerald-reveal" id="invitation">
        <div className="emerald-frame-inner">
          <span className="emerald-monogram">{date.day}</span>
          <h2>
            {names.first}
            <em>&amp;</em>
            {names.second}
          </h2>
          <p>{formatDateShort(date)}</p>
        </div>
      </section>

      <section className="emerald-story emerald-reveal emerald-from-left" id="story">
        <div className="emerald-letter-mark" aria-hidden="true" />
        <h2>Дорогие гости!</h2>
        <p>{invite.text}</p>
        <p>В этот день мы скажем друг другу «Да» и соединим наши сердца в окружении самых близких и родных людей.</p>
        <div className="emerald-calendar" aria-label="Календарь события">
          <strong>{date.month || "Октябрь"} {date.year}</strong>
          <div>
            {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((day) => (
              <b key={day}>{day}</b>
            ))}
            {Array.from({ length: 35 }, (_, index) => {
              const day = index - 1;
              return day > 0 && day <= 31 ? <em className={day === activeDay ? "active" : ""} key={index}>{day}</em> : <i key={index} />;
            })}
          </div>
        </div>
      </section>

      <section className="emerald-details emerald-reveal emerald-from-right" id="details">
        <article>
          <Calendar size={22} />
          <span>Дата и время</span>
          <strong>{formatDateLong(date)}</strong>
          <p>{invite.time}</p>
        </article>
        <article>
          <MapPin size={22} />
          <span>Локация</span>
          <strong>{invite.venue}</strong>
          <p>{invite.address}</p>
        </article>
      </section>

      <section className="emerald-venue emerald-reveal emerald-from-left" id="venue">
        <div className="emerald-door-art" aria-hidden="true" />
        <span className="emerald-label">Наш октябрь</span>
        <h2>{invite.venue}</h2>
        <p>{invite.address}</p>
        {invite.mapLink ? (
          <a href={invite.mapLink}>
            <MapPin size={17} />
            Открыть карту
          </a>
        ) : null}
      </section>

      <section className="emerald-program emerald-reveal emerald-from-left" id="program">
        <span className="emerald-label">Расписание вечера</span>
        <h2>Программа</h2>
        <div>
          {program.map((item, index) => {
            const row = splitProgramItem(item);
            return (
              <article key={`${item}-${index}`}>
                <span>{row.time || String(index + 1).padStart(2, "0")}</span>
                <p>{row.title}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="emerald-wishes emerald-reveal emerald-from-right">
        <Sparkles size={30} />
        <h2>Пожелания</h2>
        <p>Мы будем благодарны, если вместо цветов вы поможете осуществить нашу маленькую семейную мечту.</p>
        <ol>
          <li>Праздник имеет взрослый формат.</li>
          <li>Подтвердите участие заранее.</li>
          <li>Сохраняйте ссылку, чтобы быстро открыть карту и программу.</li>
        </ol>
      </section>

      <section className="emerald-contact emerald-reveal emerald-from-left">
        <div className="emerald-open-envelope" aria-hidden="true" />
        <h2>По вопросам дня</h2>
        <p>Организатор поможет с локацией, таймингом и любыми уточнениями перед праздником.</p>
        <div>
          <a href="https://t.me/">Telegram</a>
          <a href="https://wa.me/">WhatsApp</a>
        </div>
      </section>

      <section className="emerald-countdown emerald-reveal">
        <h2>Мы скажем «Да» через...</h2>
        <div>
          <strong>{countdown.days}<span>дней</span></strong>
          <strong>{countdown.hours}<span>часов</span></strong>
          <strong>{countdown.minutes}<span>минут</span></strong>
          <strong>{countdown.seconds}<span>секунд</span></strong>
        </div>
      </section>

      {invite.rsvpEnabled ? (
        <section className="emerald-rsvp emerald-reveal" id="rsvp">
          <MessageCircle size={30} />
          <h2>RSVP</h2>
          <label>
            <span>Ваше имя</span>
            <input placeholder="Напишите имя" />
          </label>
          <label>
            <span>Гостей</span>
            <input defaultValue="2" type="number" />
          </label>
          <button type="button">
            <Send size={17} />
            Отправить
          </button>
        </section>
      ) : null}

      <footer className="emerald-footer">
        <p>Ждём вас на нашем празднике</p>
        <strong>{invite.names}</strong>
      </footer>

      <nav className="emerald-bottom-nav" aria-label="Wedding navigation">
        <a href="#hero">Обложка</a>
        <a href="#program">Программа</a>
        <a href="#rsvp">RSVP</a>
        <a href={`https://wa.me/?text=${shareText}`}>Share</a>
      </nav>
    </main>
  );
}

function SoftArchWeddingInvite({ invite }: { invite: PublicInviteView }) {
  const names = splitInviteNames(invite.names);
  const date = splitInviteDate(invite.date);
  const program = invite.program.length ? invite.program : ["15:00 - Сбор гостей", "16:00 - Церемония", "17:00 - Банкет", "21:30 - Торт"];
  const shareText = encodeURIComponent(`Свадебное приглашение: https://dellover.live/invite/${invite.slug}`);

  return (
    <main className="soft-arch-wedding">
      <header className="soft-arch-topbar">
        <a href="#program" aria-label="Меню">
          <span />
          <span />
        </a>
        <strong>Amanat</strong>
        <a href="#music" aria-label="Музыка">
          <Music2 size={20} />
        </a>
      </header>

      <section className="soft-arch-hero" id="hero">
        <aside className="soft-arch-intro">
          <strong>VIBE INVITATIONS</strong>
          <span>Сайт-приглашение</span>
          <h1>для вашей свадьбы</h1>
          <p>Вся информация для гостей на одной красивой mobile-странице.</p>
          <ul>
            <li>Программа дня</li>
            <li>Dress code</li>
            <li>Карта и RSVP</li>
          </ul>
        </aside>

        <div className="soft-paper">
          <div className="soft-arch-illustration" aria-hidden="true" />
          <div className="soft-flower left" aria-hidden="true" />
          <div className="soft-flower right" aria-hidden="true" />
          <span>Приглашение на свадьбу</span>
          <h2>
            {names.first}
            <em>&amp;</em>
            {names.second}
          </h2>
          <p>{formatDateLong(date)}</p>
          <Heart size={18} />
          <h3>Дорогие гости!</h3>
          <p>{invite.text}</p>
          <div className="soft-mini-program">
            {program.slice(0, 3).map((item, index) => {
              const row = splitProgramItem(item);
              return (
                <article key={`${item}-${index}`}>
                  <span>{row.time}</span>
                  <p>{row.title}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="soft-phone">
          <div className="soft-phone-screen">
            <span>11:30</span>
            <strong>{names.first}</strong>
            <em>&amp;</em>
            <strong>{names.second}</strong>
            <p>{formatDateLong(date)}</p>
            <small>Дорогие гости!</small>
          </div>
        </div>
      </section>

      <section className="soft-story soft-arch-reveal" id="story">
        <span className="soft-kicker">Наша история</span>
        <h2>Ваше присутствие сделает этот день теплее</h2>
        <p>Мы создаём праздник в спокойной, светлой эстетике: арки, мягкие тени, цветы, семейное тепло и понятная навигация для гостей.</p>
      </section>

      <section className="soft-arch-program soft-arch-reveal" id="program">
        <span className="soft-kicker">Программа дня</span>
        <h2>Свадебный день</h2>
        <div>
          {program.map((item, index) => {
            const row = splitProgramItem(item);
            return (
              <article key={`${item}-${index}`}>
                <span>{row.time || String(index + 1).padStart(2, "0")}</span>
                <p>{row.title}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="soft-dress soft-arch-reveal">
        <span className="soft-kicker">Dress code</span>
        <h2>Будем рады видеть вас в этих оттенках</h2>
        <div className="soft-palette" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="soft-dress-grid">
          {["Silk", "Beige", "Taupe", "Champagne", "Ivory", "Mocha"].map((item) => (
            <div key={item}>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="soft-location soft-arch-reveal" id="venue">
        <MapPin size={28} />
        <span className="soft-kicker">Локация</span>
        <h2>{invite.venue}</h2>
        <p>{invite.address}</p>
        <div className="soft-map" aria-hidden="true">
          <span />
        </div>
        {invite.mapLink ? <a href={invite.mapLink}>Открыть карту</a> : null}
      </section>

      <section className="soft-note soft-arch-reveal">
        <div className="soft-note-card">
          <Gift size={24} />
          <h2>Пожелания</h2>
          <p>Если вы хотите сделать подарок, мы будем рады вкладу в нашу будущую семейную мечту.</p>
        </div>
        <div className="soft-note-card">
          <Heart size={24} />
          <h2>Формат</h2>
          <p>Праздник проходит в камерном формате. Просим заранее подтвердить участие.</p>
        </div>
      </section>

      <section className="soft-music soft-arch-reveal" id="music">
        <Music2 size={28} />
        <div>
          <h2>Музыкальное настроение</h2>
          <p>Здесь будет песня пары или спокойный фон для открытия приглашения.</p>
        </div>
      </section>

      {invite.rsvpEnabled ? (
        <section className="soft-rsvp soft-arch-reveal" id="rsvp">
          <MessageCircle size={30} />
          <h2>Подтвердите участие</h2>
          <label>
            <span>Ваше имя</span>
            <input placeholder="Имя и фамилия" />
          </label>
          <label>
            <span>Количество гостей</span>
            <input defaultValue="2" type="number" />
          </label>
          <button type="button">
            <Send size={17} />
            Отправить
          </button>
        </section>
      ) : null}

      <footer className="soft-footer">
        <Heart size={18} />
        <p>Ваш день — в центре внимания</p>
        <strong>{invite.names}</strong>
      </footer>

      <nav className="soft-bottom-nav" aria-label="Wedding navigation">
        <a href="#hero">Главная</a>
        <a href="#program">Program</a>
        <a href="#rsvp">RSVP</a>
        <a href={`https://wa.me/?text=${shareText}`}>Share</a>
      </nav>
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
  const parts = names.split(/\s*(?:&|и|және|\+)\s*/i).filter(Boolean);

  if (parts.length >= 2) {
    return { first: parts[0], second: parts.slice(1).join(" ") };
  }

  return { first: names, second: "Той" };
}

function parseInviteDate(date: string) {
  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]), 0, 0, 0);
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function countdownParts(date: string) {
  const eventDate = parseInviteDate(date);
  const diff = eventDate ? Math.max(0, eventDate.getTime() - Date.now()) : 0;
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return {
    days: String(days || 59).padStart(2, "0"),
    hours: String(hours || 17).padStart(2, "0"),
    minutes: String(minutes || 15).padStart(2, "0"),
    seconds: "12",
  };
}

function formatDateShort(date: ReturnType<typeof splitInviteDate>) {
  return `${date.day}.${date.monthNumber ?? "04"}.${date.year}`;
}

function formatDateLong(date: ReturnType<typeof splitInviteDate>) {
  return `${date.day} ${date.monthRu ?? date.month} ${date.year}`;
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
