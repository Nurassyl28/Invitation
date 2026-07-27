"use client";

import { Heart, MapPin, MessageCircle, Music2, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { InvitationAudio } from "@/components/invitation-audio";
import type { PublicInviteView } from "@/components/invitation-renderer";
import { copyFor, dateParts, months, parseEventDate, toPublicLanguage } from "@/lib/i18n";

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
  return parseEventDate(value);
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
  const language = toPublicLanguage(invite.language);
  const copy = copyFor(language);
  const rootRef = useScrollReveal();
  const eventDate = useMemo(() => parseDate(invite.date), [invite.date]);
  const countdown = useCountdown(eventDate);

  const names = splitNames(invite.names);
  const heroName = names.toUpperCase();
  const program = invite.program.length
    ? invite.program
    : language === "kz"
      ? ["16:00 - Қонақтарды қарсы алу", "17:00 - Сыңсу", "18:00 - Ақ бата", "19:00 - Қыз ұзату рәсімі"]
      : ["16:00 - Встреча гостей", "17:00 - Традиционная церемония", "18:00 - Благословение", "19:00 - Проводы невесты"];
  const shareText = encodeURIComponent(language === "kz" ? `Қыз ұзату шақыруы: ${invite.venue}` : `Приглашение на проводы невесты: ${invite.venue}`);

  const { day, monthIndex, year } = dateParts(invite.date, language, 25, 3, 2026);
  const dateShort = `${day}.${pad(monthIndex + 1)}.${year}`;
  const dateLong = language === "kz" ? `${day} ${months.kz.lower[monthIndex]} ${year} жыл` : `${day} ${months.ru.lower[monthIndex]} ${year}`;
  const countdownUnits = copy.countdownUnits as string[];
  const weekLabels = months[language].weekdaysShort;

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
        <strong>{copy.qyzCoverTitle as string}</strong>
        <a href="#music" aria-label={copy.music as string}><Music2 size={20} /></a>
      </header>

      {/* HERO */}
      <section className="qu-hero" id="hero">
        <div className="qu-hero-title" data-reveal>
          <p>{copy.qyzCoverTitle as string}</p>
          <span>{copy.qyzCoverSubtitle as string}</span>
        </div>

        <div className="qu-photo-frame" data-reveal>
          <div className="qu-photo" style={{ "--photo": `url(${invite.heroPhotoUrl || HERO_PHOTO})` } as CSSProperties}>
            <div className="qu-photo-overlay">
              <strong>{heroName}</strong>
              <span>{(copy.qyzCoverTitle as string).toUpperCase()}</span>
              <small>{(copy.scrollDown as string).toUpperCase()}</small>
              <em>{dateShort}</em>
            </div>
          </div>
        </div>

        <a className="qu-scroll-hint" href="#countdown" aria-label={copy.scrollDown as string}>
          <span />
        </a>
      </section>

      {/* COUNTDOWN */}
      <section className="qu-countdown" id="countdown" data-reveal>
        <p className="qu-countdown-title">{copy.countdownTitle as string}</p>
        <div className="qu-countdown-grid">
          <div><strong>{countdown.days}</strong><span>{countdownUnits[0]}</span></div>
          <div><strong>{countdown.hours}</strong><span>{countdownUnits[1]}</span></div>
          <div><strong>{countdown.minutes}</strong><span>{countdownUnits[2]}</span></div>
          <div><strong>{countdown.seconds}</strong><span>{countdownUnits[3]}</span></div>
        </div>
      </section>

      {/* DATE + CALENDAR */}
      <section className="qu-card qu-date" id="date" data-reveal>
        <p className="qu-script">{dateLong}</p>
        <h2>{copy.beginningAt as string}: {invite.time}</h2>
        <div className="qu-calendar">
          <div className="qu-calendar-head">
            <span>{months[language].title[monthIndex]} {year}</span>
            <Swallow className="qu-calendar-bird" />
          </div>
          <div className="qu-week">
            {weekLabels.map((d) => <b key={d}>{d}</b>)}
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
        <h2>{copy.qyzDear as string}</h2>
        <p>{invite.text}</p>
        <p>{copy.qyzTextExtra as string}</p>
      </section>

      {/* PROGRAM */}
      <section className="qu-card qu-program" id="program" data-reveal>
        <span className="qu-kicker">{copy.program as string}</span>
        <h2>{copy.eveningProgram as string}</h2>
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

      {/* Placeholder tiles until the client provides dress reference photos. */}
      <section className="qu-card qu-dress" id="dress" data-reveal>
        <span className="qu-kicker">{copy.nationalDress as string}</span>
        <h2>{copy.dressCode as string}</h2>
        <p>{copy.dressExamples as string}</p>
        <div className="qu-dress-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="qu-dress-tile" key={index} data-reveal style={{ "--i": index } as CSSProperties}>
              <span>{index < 3 ? (copy.female as string) : (copy.male as string)}</span>
              <small>{copy.photo as string}</small>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="qu-card qu-map" id="venue" data-reveal>
        <MapPin size={28} />
        <h2>{invite.venue}</h2>
        <p>{invite.address}</p>
        {invite.mapLink ? <a href={invite.mapLink}>{copy.openMap as string}</a> : null}
      </section>

      {/* MUSIC */}
      <section className="qu-card qu-music" id="music" data-reveal>
        <Music2 size={26} />
        <div>
          <h2>{copy.music as string}</h2>
          <p>{invite.musicUrl ? (copy.musicReadyText as string) : (copy.musicMissingText as string)}</p>
          <InvitationAudio src={invite.musicUrl} language={language} />
        </div>
        <div className="qu-eq" aria-hidden="true"><span /><span /><span /><span /></div>
      </section>

      {/* RSVP */}
      {invite.rsvpEnabled ? (
        <section className="qu-card qu-rsvp" id="rsvp" data-reveal>
          <MessageCircle size={28} />
          <h2>{copy.confirmAttendance as string}</h2>
          <p>{copy.confirmAttendanceLong as string}</p>
          <form action={`/api/invite/${invite.slug}/rsvp`} method="post">
            <input name="answer" type="hidden" value="yes" />
            <label>
              <span>{copy.guestName as string}</span>
              <input name="guest_name" placeholder={copy.guestNamePlaceholder as string} required />
            </label>
            <label>
              <span>{copy.guestCount as string}</span>
              <input defaultValue="2" min="1" name="guest_count" type="number" />
            </label>
            <button type="submit"><Send size={17} />{copy.send as string}</button>
          </form>
        </section>
      ) : null}

      <footer className="qu-footer" data-reveal>
        <Heart size={18} />
        <p>{copy.waitForYou as string}</p>
        <strong>{names}</strong>
      </footer>

      <nav className="qu-nav" aria-label={copy.navPrimary as string}>
        <a href="#hero">{copy.invited as string}</a>
        <a href="#program">{copy.program as string}</a>
        <a href="#rsvp">{copy.confirmAttendance as string}</a>
        <a href={`https://wa.me/?text=${shareText}`}>{copy.share as string}</a>
      </nav>
    </main>
  );
}
