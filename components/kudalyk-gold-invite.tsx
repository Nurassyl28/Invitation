"use client";

import { CalendarDays, Clock3, MapPin, Menu, MessageCircle, Music2, Shirt } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { InvitationAudio } from "@/components/invitation-audio";
import type { PublicInviteView } from "@/components/invitation-renderer";
import { copyFor, dateParts, toPublicLanguage } from "@/lib/i18n";

const fallbackGallery = [
  "/images/kazakh-ornament-yurt.jpg",
  "/images/gold-fern-ornament.png",
  "/images/qyz-hero.jpg",
  "/images/ill-rings.png",
];

const monthsKz = [
  "қаңтар",
  "ақпан",
  "наурыз",
  "сәуір",
  "мамыр",
  "маусым",
  "шілде",
  "тамыз",
  "қыркүйек",
  "қазан",
  "қараша",
  "желтоқсан",
];

const weekdaysKz = [
  "Жексенбі",
  "Дүйсенбі",
  "Сейсенбі",
  "Сәрсенбі",
  "Бейсенбі",
  "Жұма",
  "Сенбі",
];

function parseDate(value: string): Date | undefined {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 0, 0, 0);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function splitNames(value: string) {
  const parts = value.split(/\s*[&+]\s*|\s+(?:и|және|мен)\s+/i).map((part) => part.trim()).filter(Boolean);
  return {
    bride: parts[0] || value || "Айдана",
    groom: parts[1] || "Нұрсұлтан",
  };
}

function splitParents(value?: string) {
  if (!value) {
    return {
      brideParents: ["Асанова Болатбек", "Асанова Гүлнар"],
      groomParents: ["Төлегенов Серік", "Төлегенова Райхан"],
    };
  }

  const groups = value.split(/\s*;\s*/).map((part) => part.trim()).filter(Boolean);
  return {
    brideParents: (groups[0] || value).replace(/^(қыз жақ|сторона невесты)[:\s-]*/i, "").split(/\s*,\s*/).filter(Boolean).slice(0, 2),
    groomParents: (groups[1] || "").replace(/^(ұл жақ|сторона жениха)[:\s-]*/i, "").split(/\s*,\s*/).filter(Boolean).slice(0, 2),
  };
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

  if (!target || now === null) return { days: "00", hours: "00", minutes: "00", seconds: "00" };

  const total = Math.max(0, Math.floor((target.getTime() - now) / 1000));
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor((total % 86400) / 3600)),
    minutes: pad(Math.floor((total % 3600) / 60)),
    seconds: pad(total % 60),
  };
}

function useReveal() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-kg-reveal]"));

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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return rootRef;
}

function TopFlourish() {
  return (
    <svg className="kg-top-flourish" viewBox="0 0 210 72" aria-hidden="true">
      <path d="M105 6c11 20 23 29 44 33c-19 3-33 11-44 27c-11-16-25-24-44-27c21-4 33-13 44-33Z" />
      <path d="M105 17c6 11 13 17 25 21c-12 4-19 10-25 20c-6-10-13-16-25-20c12-4 19-10 25-21Z" />
      <path d="M77 40C50 14 27 18 14 45c28-9 49-10 63-5Zm56 0c27-26 50-22 63 5c-28-9-49-10-63-5Z" />
      <path d="M77 40c-15 17-35 22-60 15m116-15c15 17 35 22 60 15" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="kg-divider" aria-hidden="true">
      <span />
      <i>♥</i>
      <span />
    </div>
  );
}

function RingsIllustration() {
  return (
    <div className="kg-rings" aria-hidden="true">
      <div className="kg-bowl kg-bowl-left">
        <i />
      </div>
      <div className="kg-bowl kg-bowl-right">
        <i />
      </div>
      <div className="kg-pillow">
        <span />
      </div>
    </div>
  );
}

function SideFlowers({ side }: { side: "left" | "right" }) {
  return (
    <div className={`kg-flowers kg-flowers-${side}`} aria-hidden="true">
      <span className="kg-flower big" />
      <span className="kg-flower small" />
      <span className="kg-leaf leaf-one" />
      <span className="kg-leaf leaf-two" />
      <span className="kg-leaf leaf-three" />
      <span className="kg-stem" />
    </div>
  );
}

function OrnaIcon() {
  return (
    <svg className="kg-orna-icon" viewBox="0 0 74 74" aria-hidden="true">
      <path d="M37 6c5 13 13 21 31 31c-18 10-26 18-31 31c-5-13-13-21-31-31C24 27 32 19 37 6Z" />
      <path d="M37 19c4 8 10 13 20 18c-10 5-16 10-20 18c-4-8-10-13-20-18c10-5 16-10 20-18Z" />
      <path d="M25 37c7-9 17-9 24 0c-7 9-17 9-24 0Z" />
    </svg>
  );
}

export function KudalykGoldInvite({ invite }: { invite: PublicInviteView }) {
  const language = toPublicLanguage(invite.language);
  const copy = copyFor(language);
  const rootRef = useReveal();
  const eventDate = useMemo(() => parseDate(invite.date), [invite.date]);
  const countdown = useCountdown(eventDate);
  const names = splitNames(invite.names);
  const parents = splitParents(invite.parentsNames);
  const gallery = (invite.galleryUrls?.filter(Boolean).length ? invite.galleryUrls.filter(Boolean) : fallbackGallery).slice(0, 4);
  const { day, monthLower: month, year, weekday } = dateParts(invite.date, language, 25, 4, 2026);
  const whatsapp = invite.whatsappPhone || invite.contactPhone || "";
  const whatsappMessage = language === "kz" ? `Қатысамын: ${invite.names}` : `Буду присутствовать: ${invite.names}`;
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  const countdownUnits = copy.countdownUnits as string[];

  return (
    <main className="kg" ref={rootRef}>
      <section className="kg-card">
        <header className="kg-nav" data-kg-reveal>
          <button type="button" aria-label={copy.menu as string}>
            <Menu size={28} />
          </button>
          <button type="button" aria-label={copy.music as string}>
            <Music2 size={24} />
          </button>
        </header>

        <section className="kg-hero" data-kg-reveal>
          <TopFlourish />
          <SideFlowers side="left" />
          <SideFlowers side="right" />
          <p className="kg-kicker">{language === "kz" ? "ҚҰДАЛЫҚ ТОЙЫНА" : "НА СВАТОВСТВО"}</p>
          <h1>{language === "kz" ? "ШАҚЫРАМЫЗ!" : "ПРИГЛАШАЕМ!"}</h1>
          <Divider />
          <p className="kg-intro">{invite.text}</p>
          <RingsIllustration />
        </section>

        <section className="kg-families" data-kg-reveal>
          <div className="kg-heart-badge" aria-hidden="true">♡</div>
          <article>
            <span>{(copy.familyBride as string).toUpperCase()}</span>
            <Divider />
            {parents.brideParents.map((parent) => <p key={parent}>{parent}</p>)}
            <small>{copy.daughter as string}</small>
            <strong>{names.bride}</strong>
          </article>
          <div className="kg-family-line">
            <span />
            <OrnaIcon />
            <span />
          </div>
          <article>
            <span>{(copy.familyGroom as string).toUpperCase()}</span>
            <Divider />
            {parents.groomParents.map((parent) => <p key={parent}>{parent}</p>)}
            <small>{copy.son as string}</small>
            <strong>{names.groom}</strong>
          </article>
        </section>

        <section className="kg-info" data-kg-reveal>
          <h2>{copy.eventType as string}</h2>
          <Divider />
          <div className="kg-info-grid">
            <article className="kg-info-date">
              <CalendarDays size={30} />
              <span>{(copy.date as string).toUpperCase()}</span>
              <p>{language === "kz" ? `${day} ${month} ${year} жыл` : `${day} ${month} ${year}`}</p>
              <small>{weekday}</small>
            </article>
            <article className="kg-info-time">
              <Clock3 size={30} />
              <span>{(copy.time as string).toUpperCase()}</span>
              <p>{invite.time}</p>
            </article>
            <article className="kg-info-place">
              <MapPin size={32} />
              <span>{(copy.venue as string).toUpperCase()}</span>
              <p>{invite.address}</p>
              <small>{invite.venue}</small>
            </article>
            <article className="kg-info-dress">
              <Shirt size={30} />
              <span>{(copy.dressCode as string).toUpperCase()}</span>
              <p>{invite.dressCode || (copy.traditionalDress as string)}</p>
            </article>
          </div>
        </section>

        <section className="kg-countdown" data-kg-reveal>
          <h2>{(copy.countdownTitle as string).toUpperCase()}</h2>
          <Divider />
          <div className="kg-count-grid">
            {[
              [countdownUnits[0], countdown.days],
              [countdownUnits[1], countdown.hours],
              [countdownUnits[2], countdown.minutes],
              [countdownUnits[3], countdown.seconds],
            ].map(([label, value], index) => (
              <article key={label} style={{ "--i": index } as CSSProperties}>
                <strong>{value}</strong>
                <span>{label.toUpperCase()}</span>
              </article>
            ))}
          </div>
        </section>

        {invite.musicUrl ? (
          <section className="kg-music" data-kg-reveal>
            <Music2 size={28} />
            <h2>{(copy.music as string).toUpperCase()}</h2>
            <Divider />
            <p>{copy.musicReadyText as string}</p>
            <InvitationAudio src={invite.musicUrl} language={language} />
          </section>
        ) : null}

        <section className="kg-gallery" data-kg-reveal>
          <h2>{(copy.qudalykMoments as string).toUpperCase()}</h2>
          <Divider />
          <button className="kg-gallery-arrow left" type="button" aria-label={copy.previous as string}>‹</button>
          <div>
            {gallery.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={`Құдалық сәттері ${index + 1}`} key={src} />
            ))}
          </div>
          <button className="kg-gallery-arrow right" type="button" aria-label={copy.next as string}>›</button>
        </section>

        {invite.rsvpEnabled ? (
          <section className="kg-rsvp" data-kg-reveal>
            <h2>{(copy.confirmAttendance as string).toUpperCase()}</h2>
            <Divider />
            <form action={`/api/invite/${invite.slug}/rsvp`} method="post">
              <input name="answer" type="hidden" value="yes" />
              <input name="guest_name" placeholder={copy.guestNamePlaceholder as string} required />
              <input defaultValue="2" min="1" name="guest_count" type="number" />
              <button type="submit">
                <MessageCircle size={24} />
                {(copy.attendByWhatsapp as string).toUpperCase()}
              </button>
            </form>
            <a className="kg-rsvp-whatsapp" href={whatsappHref}>{language === "kz" ? "WhatsApp арқылы жазу" : "Написать в WhatsApp"}</a>
            <p>{language === "kz" ? "Сіздің жауаптарыңыз біз үшін маңызды" : "Ваш ответ очень важен для нас"} ♥</p>
          </section>
        ) : null}

        <footer className="kg-footer" data-kg-reveal>
          <p>{(copy.gratitude as string).toUpperCase()}</p>
          <Divider />
        </footer>
      </section>
    </main>
  );
}
