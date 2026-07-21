"use client";

import { Calendar, Heart, MapPin, MessageCircle, Music2, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { PublicInviteView } from "@/components/invitation-renderer";

const OPEN_DURATION = 1900;
const BOTANICAL_BASE = "/images/istara-botanical";

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

function BotanicalAsset({ className, file }: { className: string; file: string }) {
  return <img className={`ew-botanical ${className}`} src={`${BOTANICAL_BASE}/${file}`} alt="" aria-hidden="true" draggable={false} />;
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

function GatePanel({ side }: { side: "left" | "right" }) {
  return (
    <svg className="ew-gate-panel" viewBox="0 0 240 520" preserveAspectRatio="none" aria-hidden="true">
      <g transform={side === "right" ? "translate(240 0) scale(-1 1)" : undefined}>
        <rect className="ew-gp-fill" x="0" y="0" width="240" height="520" />
        <path className="ew-gp-arch-fill" d="M18 486V176C27 108 78 55 120 30C162 55 213 108 222 176V486Z" />
        <path className="ew-gp-frame" d="M18 486V176C27 108 78 55 120 30C162 55 213 108 222 176V486Z" />
        <path className="ew-gp-frame soft" d="M43 486V182C52 126 88 84 120 64C152 84 188 126 197 182V486Z" />
        <path className="ew-gp-post" d="M20 148V504M220 148V504" />
        <path className="ew-gp-line" d="M48 190V504M76 142V504M104 94V504M132 94V504M160 142V504M188 190V504" />
        <path className="ew-gp-line strong" d="M30 252H210M30 354H210M30 468H210" />
        <path className="ew-gp-line" d="M38 420C66 386 96 386 120 420C144 386 174 386 202 420" />
        <path className="ew-gp-scroll" d="M52 208C72 172 102 166 121 190C95 185 76 197 67 222C64 216 59 211 52 208Z" />
        <path className="ew-gp-scroll" d="M188 208C168 172 138 166 119 190C145 185 164 197 173 222C176 216 181 211 188 208Z" />
        <path className="ew-gp-scroll" d="M48 312C76 276 109 281 124 313C96 297 72 306 59 338C57 327 53 318 48 312Z" />
        <path className="ew-gp-scroll" d="M192 312C164 276 131 281 116 313C144 297 168 306 181 338C183 327 187 318 192 312Z" />
        <path className="ew-gp-scroll crown" d="M120 32C126 70 154 86 191 80C166 103 158 133 169 168C143 146 119 136 88 150C113 121 123 84 120 32Z" />
        <path className="ew-gp-line strong" d="M72 98C88 72 105 55 120 47C135 55 152 72 168 98" />
        <circle className="ew-gp-dot" cx="120" cy="252" r="5" />
        <circle className="ew-gp-dot" cx="120" cy="354" r="4" />
        <circle className="ew-gp-dot" cx="120" cy="468" r="4" />
        <path className="ew-gp-finial" d="M14 148C20 125 31 112 47 107C41 124 32 137 14 148ZM226 148C220 125 209 112 193 107C199 124 208 137 226 148Z" />
        <rect className="ew-gp-seam" x="230" y="20" width="6" height="482" rx="3" />
      </g>
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
  const publicUrl = invite.slug.startsWith("demo-")
    ? "https://dellover.live/demo/wedding-editorial-istara"
    : `https://dellover.live/invite/${invite.slug}`;
  const shareText = encodeURIComponent(`Свадебное приглашение: ${invite.names} — ${invite.venue}. ${publicUrl}`);
  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${shareText}`;
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
              {/* Invitation revealed behind the gates */}
              <div className="ew-gate-reveal" aria-hidden="true">
                <BotanicalAsset className="ew-gate-dove-img ew-gate-dove-left-img" file="dove-left.png" />
                <BotanicalAsset className="ew-gate-dove-img ew-gate-dove-right-img" file="dove-right.png" />
                <BotanicalAsset className="ew-gate-bow-img" file="bow.png" />
                <span>МЫ ЖЕНИМСЯ</span>
                <BotanicalAsset className="ew-gate-divider-img" file="divider-wide.png" />
                <strong>{invite.names}</strong>
                <p>{day} {month} {year}</p>
              </div>

              {/* Two solid ornate gates that swing open */}
              <div className="ew-gate-leaf ew-gate-leaf-left" aria-hidden="true">
                <GatePanel side="left" />
              </div>
              <div className="ew-gate-leaf ew-gate-leaf-right" aria-hidden="true">
                <GatePanel side="right" />
              </div>

              <button className="ew-gate-button" type="button" onClick={handleOpen} aria-label="Открыть приглашение">
                <span className="ew-gate-button-ring">Нажмите</span>
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

            <BotanicalAsset className="ew-card-bow-img" file="bow.png" />
            <BotanicalAsset className="ew-card-dove-img ew-card-dove-left-img" file="dove-left.png" />
            <BotanicalAsset className="ew-card-dove-img ew-card-dove-right-img" file="dove-right.png" />
            <BotanicalAsset className="ew-card-flower-img ew-card-flower-left-img" file="flowers-left.png" />
            <BotanicalAsset className="ew-card-flower-img ew-card-flower-right-img" file="flowers-right.png" />
            <FrameFlourish side="left" />
            <FrameFlourish side="right" />

            <span className="ew-kicker">МЫ ЖЕНИМСЯ</span>
            <h1>
              <span>{names.first}</span>
              {names.second ? <em>и</em> : null}
              {names.second ? <span>{names.second}</span> : null}
            </h1>
            <BotanicalAsset className="ew-card-divider-img" file="divider-wide.png" />
            <p className="ew-hero-note">Будем счастливы видеть вас рядом в этот особенный день</p>

            <div className="ew-date-stack">
              <span>{weekday}</span>
              <div className="ew-date-medallion">
                <BotanicalAsset className="ew-date-frame-img" file="date-frame.png" />
                <strong>{day}</strong>
              </div>
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

        <footer className="ew-footer" id="share" data-reveal>
          <div className="ew-footer-card">
            <div className="ew-footer-envelope" aria-hidden="true">
              <span />
              <i />
            </div>
            <BotanicalAsset className="ew-footer-flourish" file="flourish-center.png" />
            <Heart size={18} />
            <span className="ew-footer-kicker">До встречи на торжестве</span>
            <strong>{invite.names}</strong>
            <p>Сізді асыға күтеміз. Бұл күннің ең әдемі бөлігі — жақын адамдарымыздың жанымызда болуы.</p>
            <div className="ew-share-actions">
              <a href={`https://wa.me/?text=${shareText}`}>WhatsApp</a>
              <a href={telegramHref}>Telegram</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
