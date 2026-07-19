"use client";

import { Calendar, Heart, MapPin, MessageCircle, Music2, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PublicInviteView } from "@/components/invitation-renderer";

const OPEN_DURATION = 1650;

const monthNamesRu = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const weekdaysRu = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

function parseDate(value: string): Date | undefined {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 0, 0, 0);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function splitNames(value: string) {
  const parts = value.split(/\s*[&+]\s*|\s+(?:и|және)\s+/i).map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? { first: parts[0], second: parts.slice(1).join(" ") } : { first: value, second: "" };
}

function splitProgramItem(item: string) {
  const match = item.match(/^([^–—-]+)\s*[–—-]\s*(.+)$/);
  return match ? { time: match[1].trim(), title: match[2].trim() } : { time: "", title: item };
}

function useReveal(active: boolean) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [active]);

  return rootRef;
}

function GateHalf({ side }: { side: "left" | "right" }) {
  return (
    <svg className="ew-gate-art" viewBox="0 0 180 430" aria-hidden="true">
      <g transform={side === "right" ? "translate(180 0) scale(-1 1)" : undefined}>
        <path className="ew-gate-line strong" d="M170 388V156C156 94 120 54 90 31C60 54 24 94 10 156V388" />
        <path className="ew-gate-line" d="M21 388V170C40 124 64 89 90 64C116 89 140 124 159 170V388" />
        <path className="ew-gate-line" d="M90 64V388" />
        <path className="ew-gate-line" d="M34 177V388M58 128V388M122 128V388M146 177V388" />
        <path className="ew-gate-line" d="M17 235H166M17 333H166" />
        <path className="ew-gate-line ornate" d="M26 150C45 136 58 115 60 90C71 104 82 113 99 116C83 128 74 144 72 166C61 153 47 148 26 150Z" />
        <path className="ew-gate-line ornate" d="M92 30C100 54 120 67 147 65C129 82 122 103 128 128C110 113 91 105 70 113C87 94 93 70 92 30Z" />
        <path className="ew-gate-line ornate" d="M30 293C53 266 83 266 100 293C73 282 51 290 38 314C37 305 35 299 30 293Z" />
        <path className="ew-gate-line ornate" d="M154 292C132 267 103 269 87 296C111 284 134 291 147 314C147 305 150 298 154 292Z" />
        <path className="ew-gate-line" d="M24 388C49 362 74 362 90 388C106 362 131 362 156 388" />
        <circle className="ew-gate-dot" cx="90" cy="211" r="5" />
      </g>
    </svg>
  );
}

function DoveIcon({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`ew-dove ew-dove-${side}`} viewBox="0 0 88 58" aria-hidden="true">
      <path d="M12 34c19-24 34-29 55-16c-13 0-23 6-31 18c17-8 30-10 42-4c-20 10-38 14-55 9c-7-2-11-4-11-7Z" />
      <path d="M20 29C17 18 20 10 31 5c0 11 6 20 17 28" />
      <path d="M23 40c-2 7-7 11-15 12c4-6 5-12 4-18" />
    </svg>
  );
}

function BowIcon() {
  return (
    <svg className="ew-bow" viewBox="0 0 160 92" aria-hidden="true">
      <path d="M80 39C58 8 26 5 18 30c-8 26 29 26 62 9Zm0 0c22-31 54-34 62-9c8 26-29 26-62 9Z" />
      <path d="M80 39c-13 18-26 30-42 36M80 39c13 18 26 30 42 36" />
      <path d="M67 35c7-9 19-9 26 0c-4 10-22 10-26 0Z" />
    </svg>
  );
}

function FrameFlourish({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`ew-frame-flourish ew-frame-flourish-${side}`} viewBox="0 0 130 420" aria-hidden="true">
      <g transform={side === "right" ? "translate(130 0) scale(-1 1)" : undefined}>
        <path d="M100 10C42 55 22 111 37 178c14 63 1 114-27 153" />
        <path d="M45 83c-27-11-39-29-35-54c22 5 34 22 35 54Z" />
        <path d="M37 149c-25-4-39-18-43-42c23-2 38 12 43 42Z" />
        <path d="M44 218c-25 2-42-9-52-31c22-7 40 4 52 31Z" />
        <path d="M31 286c-24 9-43 3-59-16c19-13 40-7 59 16Z" />
        <path d="M34 107c20-20 40-25 61-14c-11 20-32 25-61 14Z" />
        <path d="M41 183c19-16 38-18 57-6c-12 17-31 19-57 6Z" />
        <path d="M35 254c20-12 39-10 56 5c-14 14-32 13-56-5Z" />
        <circle cx="32" cy="164" r="5" />
        <circle cx="42" cy="230" r="4" />
        <circle cx="24" cy="303" r="4" />
      </g>
    </svg>
  );
}

function TinyFlourish() {
  return (
    <svg className="ew-tiny-flourish" viewBox="0 0 160 32" aria-hidden="true">
      <path d="M8 16c26 0 29-14 44-14c13 0 18 9 28 14c10-5 15-14 28-14c15 0 18 14 44 14c-26 0-29 14-44 14c-13 0-18-9-28-14c-10 5-15 14-28 14C37 30 34 16 8 16Z" />
    </svg>
  );
}

export function EditorialWeddingInvite({ invite }: { invite: PublicInviteView }) {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const rootRef = useReveal(opened);
  const program = invite.program.length
    ? invite.program
    : ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Ужин", "22:30 - Завершение"];
  const eventDate = useMemo(() => parseDate(invite.date), [invite.date]);
  const names = splitNames(invite.names);
  const day = eventDate ? eventDate.getDate() : 20;
  const month = eventDate ? monthNamesRu[eventDate.getMonth()] : "июля";
  const weekday = eventDate ? weekdaysRu[eventDate.getDay()] : "пятница";
  const year = eventDate ? eventDate.getFullYear() : 2026;
  const shareText = encodeURIComponent(`Свадебное приглашение: ${invite.names} — ${invite.venue}`);
  const gallery = invite.galleryUrls?.filter(Boolean) ?? [];

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  function handleOpen() {
    if (opening) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpened(true);
      return;
    }

    setOpening(true);
    window.setTimeout(() => setOpened(true), OPEN_DURATION);
  }

  return (
    <main className={`ew ${opening ? "is-gate-opening" : ""} ${opened ? "is-open" : ""}`} ref={rootRef}>
      {!opened ? (
        <section className="ew-gate-cover" aria-label="Открыть приглашение">
          <div className="ew-gate-mist" aria-hidden="true" />
          <div className="ew-gate-frame">
            <div className="ew-corner ew-corner-tl" />
            <div className="ew-corner ew-corner-tr" />
            <div className="ew-corner ew-corner-bl" />
            <div className="ew-corner ew-corner-br" />

            <div className="ew-gate-paper">
              <div className="ew-gate-preview">
                <DoveIcon side="left" />
                <DoveIcon side="right" />
                <BowIcon />
                <span>МЫ ЖЕНИМСЯ</span>
                <strong>{invite.names}</strong>
                <p>{day} {month} {year}</p>
              </div>

              <div className="ew-gate-leaf ew-gate-leaf-left">
                <GateHalf side="left" />
              </div>
              <div className="ew-gate-leaf ew-gate-leaf-right">
                <GateHalf side="right" />
              </div>

              <button className="ew-gate-button" type="button" onClick={handleOpen} aria-label="Открыть приглашение">
                <span className="ew-play" aria-hidden="true" />
                Нажмите
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <div className="ew-content" aria-hidden={!opened}>
        <header className="ew-header">
          <a href="#hero">Amanat</a>
          <nav aria-label="Wedding navigation">
            <a href="#hero">Басы</a>
            <a href="#program">Program</a>
            <a href="#rsvp">RSVP</a>
            <a href="#share">Share</a>
          </nav>
        </header>

        <section className="ew-hero" id="hero">
          <div className="ew-forest" aria-hidden="true" />
          <article className="ew-invite-card" data-reveal>
            <div className="ew-brand">
              <span>Amanat</span>
              <small>сайт-приглашение</small>
            </div>

            <DoveIcon side="left" />
            <DoveIcon side="right" />
            <BowIcon />
            <FrameFlourish side="left" />
            <FrameFlourish side="right" />

            <span className="ew-kicker">МЫ ЖЕНИМСЯ</span>
            <h1>
              <span>{names.first}</span>
              {names.second ? <em>и</em> : null}
              {names.second ? <span>{names.second}</span> : null}
            </h1>
            <p className="ew-hero-note">Будем счастливы видеть вас рядом в этот особенный день</p>

            <div className="ew-date-stack">
              <span>{weekday}</span>
              <strong>{day}</strong>
              <span>{month}</span>
            </div>

            <TinyFlourish />
            <a href="#details" className="ew-scroll-link">Смотреть детали</a>
          </article>
        </section>

        <section className="ew-story" data-reveal="left">
          <span>Дорогие гости!</span>
          <p>{invite.text}</p>
          <p>
            В этот день мы скажем друг другу «да» и хотим разделить радость с самыми близкими людьми.
          </p>
        </section>

        <section className="ew-details" id="details">
          <article className="ew-detail-card ew-detail-date" data-reveal="left">
            <Calendar size={24} />
            <span>Дата и время</span>
            <h2>{day} {month}</h2>
            <p>{weekday}, начало в {invite.time}</p>
            <small>{year}</small>
          </article>

          <article className="ew-detail-card ew-detail-place" data-reveal="right">
            <MapPin size={24} />
            <span>Локация</span>
            <h2>{invite.venue}</h2>
            <p>{invite.address}</p>
            {invite.mapLink ? <a href={invite.mapLink}>Открыть карту</a> : null}
          </article>
        </section>

        <section className="ew-program" id="program" data-reveal>
          <span>Программа дня</span>
          <h2>Той бағдарламасы</h2>
          <div>
            {program.map((item, index) => {
              const row = splitProgramItem(item);
              return (
                <article key={`${item}-${index}`} data-reveal={index % 2 ? "right" : "left"} style={{ "--i": index } as CSSProperties}>
                  <strong>{row.time || String(index + 1).padStart(2, "0")}</strong>
                  <p>{row.title}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ew-quote" data-reveal="right">
          <Sparkles size={24} />
          <blockquote>«Екі жүрек, бір шаңырақ»</blockquote>
          <p>Сіздердің ақ тілектеріңіз біздің жаңа өміріміздің ең әдемі бастамасы болады.</p>
        </section>

        {(invite.heroPhotoUrl || gallery.length) ? (
          <section className="ew-gallery" data-reveal>
            <span>Фото</span>
            <div>
              {[invite.heroPhotoUrl, ...gallery].filter(Boolean).slice(0, 3).map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={`${invite.names} ${index + 1}`} key={src} />
              ))}
            </div>
          </section>
        ) : null}

        {invite.musicUrl ? (
          <section className="ew-music" data-reveal="left">
            <Music2 size={24} />
            <span>Музыка</span>
            <p>Приглашение можно открыть с музыкальным сопровождением.</p>
          </section>
        ) : null}

        {invite.rsvpEnabled ? (
          <section className="ew-rsvp" id="rsvp" data-reveal>
            <MessageCircle size={28} />
            <h2>Қатысуыңызды растаңыз</h2>
            <label>
              <span>Имя</span>
              <input placeholder="Имя и фамилия" />
            </label>
            <label>
              <span>Количество гостей</span>
              <input defaultValue="2" type="number" />
            </label>
            <button type="button">
              <Send size={16} />
              Подтвердить участие
            </button>
          </section>
        ) : null}

        <footer className="ew-footer" id="share">
          <Heart size={18} />
          <strong>{invite.names}</strong>
          <p>Сізді асыға күтеміз</p>
          <a href={`https://wa.me/?text=${shareText}`}>Поделиться</a>
        </footer>
      </div>
    </main>
  );
}
