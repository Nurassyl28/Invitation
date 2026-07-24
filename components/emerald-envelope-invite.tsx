"use client";

import { Heart, MapPin, MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PublicInviteView } from "@/components/invitation-renderer";

const WAX_SEAL = "/images/wax-seal.jpg";
const ILL = {
  gazebo: "/images/ill-gazebo.png",
  candelabra: "/images/ill-candelabra.png",
  key: "/images/ill-key.png",
  rings: "/images/ill-rings.png",
  flourish: "/images/ill-flourish.png",
};
const OPEN_DURATION = 1700;

const monthNamesRu = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const monthTitleRu = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function parseDate(value: string): Date | undefined {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 0, 0, 0);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function splitNames(names: string) {
  const parts = names.split(/\s*[&+]\s*|\s+(?:и|және)\s+/i).filter(Boolean);
  return parts.length >= 2 ? { first: parts[0], second: parts.slice(1).join(" ") } : { first: names, second: "" };
}

function splitProgramItem(item: string) {
  const match = item.match(/^([^–—-]+)\s*[–—-]\s*(.+)$/);
  return match ? { time: match[1].trim(), title: match[2].trim() } : { time: "", title: item };
}

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function useCountdown(target?: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null || !target) return { days: "—", hours: "—", minutes: "—", seconds: "—" };
  const total = Math.max(0, Math.floor((target.getTime() - now) / 1000));
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

export function EmeraldEnvelopeInvite({ invite }: { invite: PublicInviteView }) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const eventDate = useMemo(() => parseDate(invite.date), [invite.date]);
  const countdown = useCountdown(eventDate);
  const names = splitNames(invite.names);
  const program = invite.program.length
    ? invite.program
    : ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Ужин", "22:30 - Завершение"];

  const day = eventDate ? eventDate.getDate() : 3;
  const monthIndex = eventDate ? eventDate.getMonth() : 9;
  const year = eventDate ? eventDate.getFullYear() : 2026;
  const shareText = encodeURIComponent(`Свадебное приглашение: ${invite.venue}`);

  // calendar grid (Monday-first)
  const startOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // lock scroll while the cover is showing
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened]);

  // scroll reveal once content is open
  useEffect(() => {
    if (!opened) return;
    const root = contentRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [opened]);

  function handleOpen() {
    if (opening) return;
    const showContent = () => {
      setOpened(true);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showContent();
      return;
    }
    setOpening(true);
    window.setTimeout(showContent, OPEN_DURATION);
  }

  return (
    <main className="ev">
      <div className="ev-bg" aria-hidden="true" />
      <div className="ev-bg-wash" aria-hidden="true" />

      {!opened ? (
        <div className={`ev-cover ${opening ? "is-opening" : ""}`}>
          <div className="ev-cover-inner">
            <span className="ev-kicker">Вы приглашены</span>
            <h1 className="ev-cover-title">на&nbsp;свадьбу</h1>

            <button className="ev-envelope" type="button" onClick={handleOpen} aria-label="Открыть приглашение">
              <div className="ev-env-back" />
              <div className="ev-env-letter">
                <span>{names.first}</span>
                <em>&amp;</em>
                <span>{names.second}</span>
              </div>
              <div className="ev-env-front" />
              <div className="ev-env-flap" />
              <div className="ev-seal" style={{ "--seal": `url(${WAX_SEAL})` } as CSSProperties}>
                <span>Нажмите</span>
              </div>
            </button>

            <p className="ev-cover-note">
              Вы не просто так получили это приглашение! В особенный для нас день мы очень хотим, чтобы вы были рядом.
            </p>
          </div>
        </div>
      ) : null}

      <div className="ev-content" ref={contentRef} aria-hidden={!opened}>
        {/* NAMES */}
        <section className="ev-names" data-reveal>
          <div className="ev-names-frame">
            <EvCartouche />
            <span className="ev-medallion">
              {(names.first[0] || "A")}<i>&amp;</i>{(names.second[0] || "K")}
            </span>
            <div className="ev-names-inner">
              <h2>{names.first}<em>&amp;</em>{names.second}</h2>
              <EvFlourish className="ev-flourish" />
              <p>Спешим сообщить радостную новость&nbsp;— мы женимся!</p>
              <div className="ev-vdate">
                <strong>{pad(day)}</strong>
                <i />
                <strong>{pad(monthIndex + 1)}</strong>
                <i />
                <strong>{String(year).slice(-2)}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* GUESTS + CALENDAR */}
        <section className="ev-guests" data-reveal>
          <h2>Дорогие гости!</h2>
          <p>{invite.text}</p>
          <div className="ev-calendar">
            <strong>Наш {monthTitleRu[monthIndex].toLowerCase()}</strong>
            <div className="ev-week">
              {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((d) => <b key={d}>{d}</b>)}
            </div>
            <div className="ev-days">
              {cells.map((value, index) => value === null
                ? <i key={`e${index}`} />
                : <em key={value} className={value === day ? "active" : ""}>
                    {value === day ? <Heart size={30} fill="currentColor" /> : value}
                    {value === day ? <b>{value}</b> : null}
                  </em>)}
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ev-ill ev-ill-gazebo" src={ILL.gazebo} alt="" aria-hidden="true" />
        </section>

        {/* PROGRAM */}
        <section className="ev-program" data-reveal>
          <span className="ev-label">Расписание вечера</span>
          <h2>Программа</h2>
          <div className="ev-timeline">
            {program.map((item, index) => {
              const row = splitProgramItem(item);
              return (
                <article key={`${item}-${index}`} data-reveal style={{ "--i": index } as CSSProperties}>
                  <span>{row.time || pad(index + 1)}</span>
                  <p>{row.title}</p>
                </article>
              );
            })}
          </div>
          <div className="ev-finale" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ev-ill ev-ill-candelabra" src={ILL.candelabra} alt="" aria-hidden="true" />
            <span className="ev-finale-title">Завершение</span>
            <strong>{splitProgramItem(program[program.length - 1]).time || "22:30"}</strong>
          </div>
        </section>

        {/* QUOTE */}
        <section className="ev-quote" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ev-ill ev-ill-flourish" src={ILL.flourish} alt="" aria-hidden="true" />
          <div className="ev-quote-card">
            <Sparkles size={22} />
            <p>Жизнь&nbsp;— прекрасное путешествие. Глупо тратить бесценное время на то, что не про любовь.</p>
          </div>
        </section>

        {/* WISHES */}
        <section className="ev-wishes" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ev-ill ev-ill-key" src={ILL.key} alt="" aria-hidden="true" />
          <h2>Пожелания</h2>
          <ol>
            <li data-reveal style={{ "--i": 0 } as CSSProperties}>
              <span>1</span>
              <p>Мы будем признательны, если вы поможете осуществить наши мечты, подарив ваши пожелания в конверте.</p>
            </li>
            <li data-reveal style={{ "--i": 1 } as CSSProperties}>
              <span>2</span>
              <p>Наш праздник имеет формат 18+, поэтому просим заранее предусмотреть, с кем останутся ваши детки.</p>
            </li>
            <li data-reveal style={{ "--i": 2 } as CSSProperties}>
              <span>3</span>
              <p>Мы создали чат праздника, где можно узнать детали и поделиться фото и видео в день свадьбы и после.</p>
            </li>
          </ol>
        </section>

        {/* VENUE */}
        <section className="ev-venue" data-reveal>
          <MapPin size={26} />
          <h2>{invite.venue}</h2>
          <p>{invite.address}</p>
          {invite.mapLink ? <a href={invite.mapLink}>Открыть карту</a> : null}
        </section>

        {/* CONTACT — real open-envelope illustration with text on the letter */}
        <section className="ev-contact" data-reveal>
          <div className="ev-envelope-img-scene">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ev-envelope-img" src="/images/envelope-open.png" alt="Конверт" />
            <div className="ev-envelope-text">
              <p>Мы будем очень волноваться на свадьбе, поэтому все вопросы доверили в руки нашего организатора Ольги.</p>
              <div className="ev-oe-icons">
                <a href="https://t.me/" aria-label="Telegram"><Send size={15} /></a>
                <a href="https://wa.me/" aria-label="WhatsApp"><MessageCircle size={15} /></a>
              </div>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="ev-countdown" data-reveal>
          <h2>Мы скажем «Да» через…</h2>
          <div className="ev-count-grid">
            <div><strong>{countdown.days}</strong><span>дней</span></div>
            <i>:</i>
            <div><strong>{countdown.hours}</strong><span>часов</span></div>
            <i>:</i>
            <div><strong>{countdown.minutes}</strong><span>минут</span></div>
            <i>:</i>
            <div><strong>{countdown.seconds}</strong><span>секунд</span></div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ev-ill ev-ill-rings" src={ILL.rings} alt="" aria-hidden="true" />
        </section>

        {/* RSVP */}
        {invite.rsvpEnabled ? (
          <section className="ev-rsvp" data-reveal>
            <MessageCircle size={26} />
            <h2>Подтвердите участие</h2>
            <form action={`/api/invite/${invite.slug}/rsvp`} method="post">
              <input name="answer" type="hidden" value="yes" />
              <label>
                <span>Ваше имя</span>
                <input name="guest_name" placeholder="Имя и фамилия" required />
              </label>
              <label>
                <span>Количество гостей</span>
                <input defaultValue="2" min="1" name="guest_count" type="number" />
              </label>
              <button type="submit"><Send size={16} />Отправить</button>
            </form>
          </section>
        ) : null}

        <footer className="ev-footer" data-reveal>
          <Heart size={18} />
          <strong>{names.first} &amp; {names.second}</strong>
          <p>Ждём вас на нашем празднике</p>
          <a className="ev-share" href={`https://wa.me/?text=${shareText}`}>Поделиться</a>
        </footer>
      </div>
    </main>
  );
}

/* ---- decorative SVG ornaments ---- */
function EvFlourish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 22" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M100 11 C112 11 112 4 122 5 C134 6 132 17 144 15 C155 13 159 8 170 12" />
        <path d="M100 11 C88 11 88 4 78 5 C66 6 68 17 56 15 C45 13 41 8 30 12" />
      </g>
      <circle cx="100" cy="11" r="3.4" fill="currentColor" />
      <circle cx="100" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="170" cy="12" r="1.8" fill="currentColor" />
      <circle cx="30" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

const CART_PATH =
  "M150 10 C176 12 194 22 210 34 C244 56 262 74 262 122 C262 158 244 168 244 200 C244 232 262 240 262 262 C262 300 262 300 260 340 C258 380 244 392 244 420 C244 452 262 462 262 500 C262 534 240 550 206 562 C186 569 166 580 150 588 C134 580 114 569 94 562 C60 550 38 534 38 500 C38 462 56 452 56 420 C56 392 42 380 40 340 C38 300 38 300 38 262 C38 240 56 232 56 200 C56 168 38 158 38 122 C38 74 56 56 90 34 C106 22 124 12 150 10 Z";

function EvCartouche() {
  return (
    <svg className="ev-cartouche" viewBox="0 0 300 600" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="evEm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26493a" />
          <stop offset="0.6" stopColor="#1f3d2f" />
          <stop offset="1" stopColor="#1a3427" />
        </linearGradient>
      </defs>
      {/* rose outer ring */}
      <path
        d={CART_PATH}
        fill="none"
        stroke="#c65f78"
        strokeWidth="6"
        vectorEffect="non-scaling-stroke"
        transform="translate(150 300) scale(1.03) translate(-150 -300)"
      />
      {/* green fill */}
      <path d={CART_PATH} fill="url(#evEm)" />
      {/* thin white inner line */}
      <path d={CART_PATH} fill="none" stroke="#f5efe3" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
