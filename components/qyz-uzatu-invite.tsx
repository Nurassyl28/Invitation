"use client";

import { Heart, MapPin, MessageCircle, Music2, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PublicInviteView } from "@/components/invitation-renderer";

const HERO_PHOTO = "/images/qyz-hero.jpg";

const monthNamesRu = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const monthTitleRu = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const monthTitleKz = [
  "Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым",
  "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан",
];

function parseDate(value: string): Date | undefined {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 0, 0, 0);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function splitNames(names: string) {
  const parts = names.split(/\s*[&+]\s*|\s+(?:и|және)\s+/i).filter(Boolean);
  return parts.length >= 2 ? parts.join(" & ") : names;
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

  if (now === null || !target) {
    return { days: "—", hours: "—", minutes: "—", seconds: "—" };
  }
  const diff = Math.max(0, target.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: pad(Math.floor(totalSeconds / 86400)),
    hours: pad(Math.floor((totalSeconds % 86400) / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
  };
}

function useScrollReveal() {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return rootRef;
}

function Swallow({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 40" aria-hidden="true">
      <path
        d="M2 20c10-2 16-8 22-16 1 7 0 12-4 17 8-4 14-9 20-17-1 9-6 16-14 21 6 0 11-1 16-5-6 9-16 14-27 12-5-1-9-4-13-8-2-2-1-1 0-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function QyzUzatuInvite({ invite }: { invite: PublicInviteView }) {
  const rootRef = useScrollReveal();
  const eventDate = useMemo(() => parseDate(invite.date), [invite.date]);
  const countdown = useCountdown(eventDate);

  const names = splitNames(invite.names);
  const heroName = names.toUpperCase();
  const program = invite.program.length
    ? invite.program
    : ["16:00 - Қонақтарды қарсы алу", "17:00 - Сыңсу", "18:00 - Ақ бата", "19:00 - Қыз ұзату рәсімі"];
  const shareText = encodeURIComponent(`Қыз ұзату шақыруы: ${invite.venue}`);

  const day = eventDate ? eventDate.getDate() : 25;
  const monthIndex = eventDate ? eventDate.getMonth() : 3;
  const year = eventDate ? eventDate.getFullYear() : 2026;
  const dateShort = `${day}.${pad(monthIndex + 1)}.${year}`;
  const dateLong = `${day} ${monthNamesRu[monthIndex]} ${year}`;

  // Build month calendar grid (Monday-first).
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <main className="qu" ref={rootRef}>
      <div className="qu-bg" aria-hidden="true" />
      <div className="qu-bg-fade" aria-hidden="true" />

      {/* animated swallows */}
      <div className="qu-birds" aria-hidden="true">
        <Swallow className="qu-bird qu-bird-1" />
        <Swallow className="qu-bird qu-bird-2" />
        <Swallow className="qu-bird qu-bird-3" />
        <Swallow className="qu-bird qu-bird-4" />
      </div>

      <header className="qu-topbar">
        <strong>Amanat</strong>
        <a href="#music" aria-label="Музыка"><Music2 size={20} /></a>
      </header>

      {/* HERO */}
      <section className="qu-hero" id="hero">
        <div className="qu-hero-title" data-reveal>
          <p>Qyz Uzatu</p>
          <span>Shaqyru</span>
        </div>

        <div className="qu-photo-frame" data-reveal>
          <div className="qu-photo" style={{ "--photo": `url(${invite.heroPhotoUrl || HERO_PHOTO})` } as CSSProperties}>
            <div className="qu-photo-overlay">
              <strong>{heroName}</strong>
              <span>QYZ UZATU</span>
              <small>ПРОВЕДИТЕ ВВЕРХ</small>
              <em>{dateShort}</em>
            </div>
          </div>
        </div>

        <a className="qu-scroll-hint" href="#countdown" aria-label="Листайте вниз">
          <span />
        </a>
      </section>

      {/* COUNTDOWN */}
      <section className="qu-countdown" id="countdown" data-reveal>
        <p className="qu-countdown-title">До торжества осталось</p>
        <div className="qu-countdown-grid">
          <div><strong>{countdown.days}</strong><span>дней</span></div>
          <div><strong>{countdown.hours}</strong><span>часов</span></div>
          <div><strong>{countdown.minutes}</strong><span>минут</span></div>
          <div><strong>{countdown.seconds}</strong><span>секунд</span></div>
        </div>
      </section>

      {/* DATE + CALENDAR */}
      <section className="qu-card qu-date" id="date" data-reveal>
        <p className="qu-script">{dateLong}</p>
        <h2>Начало в {invite.time}</h2>
        <div className="qu-calendar">
          <div className="qu-calendar-head">
            <span>{monthTitleRu[monthIndex]} · {monthTitleKz[monthIndex]} {year}</span>
            <Swallow className="qu-calendar-bird" />
          </div>
          <div className="qu-week">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => <b key={d}>{d}</b>)}
          </div>
          <div className="qu-days">
            {cells.map((value, index) =>
              value === null
                ? <i key={`e${index}`} />
                : <em key={value} className={value === day ? "active" : ""}>{value}</em>,
            )}
          </div>
        </div>
      </section>

      {/* INVITATION TEXT */}
      <section className="qu-card qu-invitation" id="invitation" data-reveal>
        <Sparkles size={26} />
        <h2>Дорогие друзья и родные!</h2>
        <p>{invite.text}</p>
        <p>Приглашаем вас разделить с нами этот праздник и стать дорогими гостями трепетного и радостного события.</p>
      </section>

      {/* PROGRAM */}
      <section className="qu-card qu-program" id="program" data-reveal>
        <span className="qu-kicker">Той бағдарламасы</span>
        <h2>Салтанатты кеш</h2>
        <div className="qu-program-list">
          {program.map((item, index) => {
            const row = splitProgramItem(item);
            return (
              <article key={`${item}-${index}`} data-reveal style={{ "--i": index } as CSSProperties}>
                <strong>{row.time || pad(index + 1)}</strong>
                <p>{row.title}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* DRESS CODE — placeholder tiles; ждём фото нарядов от клиента */}
      <section className="qu-card qu-dress" id="dress" data-reveal>
        <span className="qu-kicker">Казахский национальный костюм</span>
        <h2>Dress code</h2>
        <p>Примеры женских и мужских нарядов</p>
        <div className="qu-dress-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="qu-dress-tile" key={index} data-reveal style={{ "--i": index } as CSSProperties}>
              <span>{index < 3 ? "Әйел" : "Ер"}</span>
              <small>фото</small>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="qu-card qu-map" id="venue" data-reveal>
        <MapPin size={28} />
        <h2>{invite.venue}</h2>
        <p>{invite.address}</p>
        {invite.mapLink ? <a href={invite.mapLink}>Открыть карту</a> : null}
      </section>

      {/* MUSIC */}
      <section className="qu-card qu-music" id="music" data-reveal>
        <Music2 size={26} />
        <div>
          <h2>Музыка</h2>
          <p>{invite.musicUrl ? "Мелодия приглашения включена." : "Здесь будет фоновая мелодия приглашения."}</p>
        </div>
        <div className="qu-eq" aria-hidden="true"><span /><span /><span /><span /></div>
      </section>

      {/* RSVP */}
      {invite.rsvpEnabled ? (
        <section className="qu-card qu-rsvp" id="rsvp" data-reveal>
          <MessageCircle size={28} />
          <h2>Растау / RSVP</h2>
          <p>Пожалуйста, сообщите заранее, сможете ли вы прийти.</p>
          <label>
            <span>Аты-жөніңіз / Ваше имя</span>
            <input placeholder="Напишите полное имя" />
          </label>
          <label>
            <span>Қонақтар саны / Гостей</span>
            <input defaultValue="2" type="number" />
          </label>
          <button type="button"><Send size={17} />Жіберу / Отправить</button>
        </section>
      ) : null}

      <footer className="qu-footer" data-reveal>
        <Heart size={18} />
        <p>Сізді асыға күтеміз</p>
        <strong>{names}</strong>
      </footer>

      <nav className="qu-nav" aria-label="Навигация">
        <a href="#hero">Басы</a>
        <a href="#program">Program</a>
        <a href="#rsvp">RSVP</a>
        <a href={`https://wa.me/?text=${shareText}`}>Share</a>
      </nav>
    </main>
  );
}
