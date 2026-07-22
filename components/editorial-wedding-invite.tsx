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

  useEffect(() => {
    if (!opened) return;

    const resetToTop = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetToTop();
    const frame = window.requestAnimationFrame(resetToTop);
    const timeout = window.setTimeout(resetToTop, 120);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [opened]);

  function handleOpen() {
    if (opening) return;

    const resetToTop = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetToTop();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpened(true);
      return;
    }

    setOpening(true);
    window.setTimeout(() => {
      resetToTop();
      setOpened(true);
    }, OPEN_DURATION);
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
                <span>Приглашаем на свадьбу</span>
                <BotanicalAsset className="ew-gate-divider-img" file="divider-wide.png" />
                <strong>{invite.names}</strong>
                <p>{day} {month} {year}</p>
              </div>

              {/* Two solid ornate gates that swing open */}
              <div className="ew-gate-leaf ew-gate-leaf-left" aria-hidden="true">
                <BotanicalAsset className="ew-gate-image ew-gate-image-left" file="gate-left.png" />
              </div>
              <div className="ew-gate-leaf ew-gate-leaf-right" aria-hidden="true">
                <BotanicalAsset className="ew-gate-image ew-gate-image-right" file="gate-right.png" />
              </div>

              <button className="ew-gate-button" type="button" onClick={handleOpen} aria-label="Открыть приглашение">
                <span className="ew-gate-button-ring">Нажмите</span>
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <div className="ew-content" aria-hidden={!opened}>
        <section className="ew-hero" id="hero">
          <div className="ew-forest" aria-hidden="true" />
          <article className="ew-invite-card" data-reveal>
            <BotanicalAsset className="ew-card-bow-img" file="bow.png" />
            <BotanicalAsset className="ew-card-dove-img ew-card-dove-left-img" file="dove-left.png" />
            <BotanicalAsset className="ew-card-dove-img ew-card-dove-right-img" file="dove-right.png" />
            <BotanicalAsset className="ew-card-arch-img ew-card-arch-left-img" file="arch-left.png" />
            <BotanicalAsset className="ew-card-arch-img ew-card-arch-right-img" file="arch-right.png" />
            <BotanicalAsset className="ew-card-sprig-img ew-card-sprig-left-img" file="upper-sprig-left.png" />
            <BotanicalAsset className="ew-card-sprig-img ew-card-sprig-right-img" file="upper-sprig-right.png" />
            <BotanicalAsset className="ew-card-flower-img ew-card-flower-left-img" file="flowers-left.png" />
            <BotanicalAsset className="ew-card-flower-img ew-card-flower-right-img" file="flowers-right.png" />

            <span className="ew-kicker">Мы женимся!</span>
            <h1 aria-label={names.second ? `${names.first} и ${names.second}` : names.first}>
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

            <BotanicalAsset className="ew-date-lower-flourish-img" file="flourish-center.png" />
            <BotanicalAsset className="ew-card-bottom-bow-img" file="bottom-bow.png" />
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
