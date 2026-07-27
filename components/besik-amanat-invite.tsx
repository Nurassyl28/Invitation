"use client";

import {
  Baby,
  CalendarPlus,
  ChevronDown,
  Heart,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Music2,
  PartyPopper,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useEffect, useMemo, useRef, type CSSProperties, type ComponentType } from "react";
import { InvitationAudio } from "@/components/invitation-audio";
import type { PublicInviteView } from "@/components/invitation-renderer";
import { copyFor, dateParts, toPublicLanguage } from "@/lib/i18n";

const monthTitleKz = [
  "Қаңтар", "Ақпан", "Наурыз", "Сәуір", "Мамыр", "Маусым",
  "Шілде", "Тамыз", "Қыркүйек", "Қазан", "Қараша", "Желтоқсан",
];
const weekdaysKz = ["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"];

const programIcons: ComponentType<{ size?: number }>[] = [Utensils, Baby, PartyPopper];

function parseDate(value: string): Date | undefined {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 0, 0, 0);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function splitProgramItem(item: string) {
  const match = item.match(/^([^–—-]+)\s*[–—-]\s*(.+)$/);
  return match ? { time: match[1].trim(), title: match[2].trim() } : { time: "", title: item };
}

/** Parses "Ата-анасы: X, Y; Әже-атасы: A, B" into two labelled groups. */
function splitFamily(value?: string) {
  if (!value) return [] as { label: string; names: string }[];
  return value
    .split(/\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [label, names] = part.split(/\s*:\s*/);
      return names ? { label: label.trim(), names: names.trim() } : { label: "", names: part };
    });
}

function useReveal() {
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
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return rootRef;
}

export function BesikAmanatInvite({ invite }: { invite: PublicInviteView }) {
  const language = toPublicLanguage(invite.language);
  const copy = copyFor(language);
  const rootRef = useReveal();
  const eventDate = useMemo(() => parseDate(invite.date), [invite.date]);
  const { day, monthIndex, monthTitle, year, weekday } = dateParts(invite.date, language, 25, 8, 2026);

  const program = invite.program.length
    ? invite.program
    : language === "kz"
      ? ["18:00 - Қонақтарды қарсы алу", "19:30 - Бесікке салу", "20:30 - Мерекелік дастархан"]
      : ["18:00 - Встреча гостей", "19:30 - Семейная церемония", "20:30 - Праздничный ужин"];
  const family = splitFamily(invite.parentsNames);
  const gallery = (invite.galleryUrls ?? []).filter(Boolean);
  const heroPhoto = invite.heroPhotoUrl || invite.previewImage;
  const shareText = encodeURIComponent(language === "kz" ? `Бесік той: ${invite.names} — ${invite.venue}` : `Праздник колыбели: ${invite.names} — ${invite.venue}`);
  const whatsappHref = `https://wa.me/?text=${shareText}`;

  return (
    <main className="bt" ref={rootRef}>
      <div className="bt-grain" aria-hidden="true" />

      <header className="bt-header">
        <span className="bt-brand">Amanat</span>
        <a className="bt-header-music" href="#music" aria-label={copy.music as string}><Music2 size={20} /></a>
      </header>

      {/* HERO */}
      <section className="bt-hero" id="hero" data-reveal>
        <div className="bt-glass bt-hero-card">
          <p className="bt-kicker">{language === "kz" ? "Бесік той" : "Праздник колыбели"}</p>
          <h1 className="bt-title">{invite.names}</h1>
          <div className="bt-hero-photo">
            {heroPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroPhoto} alt={invite.names} />
            ) : (
              <div className="bt-hero-photo-ph"><Baby size={44} /></div>
            )}
          </div>
          <p className="bt-quote">{invite.text || "«Бала — көңілдің гүлі, көздің нұры»"}</p>
          <a className="bt-hero-scroll" href="#date" aria-label={copy.scrollDown as string}><ChevronDown size={26} /></a>
        </div>
      </section>

      {/* FAMILY */}
      {family.length ? (
        <section className="bt-family" data-reveal>
          <div className="bt-family-grid">
            {family.slice(0, 2).map((group, index) => (
              <article className="bt-glass bt-family-card" key={`${group.label}-${index}`}>
                <p className="bt-label">{group.label || (index === 0 ? (language === "kz" ? "Ата-анасы" : "Родители") : (language === "kz" ? "Әже-атасы" : "Бабушка и дедушка"))}</p>
                <p className="bt-family-names">{group.names}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* DATE & TIME */}
      <section className="bt-date" id="date" data-reveal>
        <div className="bt-glass bt-date-card">
          <h2 className="bt-section-title">{copy.besikDateTitle as string}</h2>
          <div className="bt-date-row">
            <div className="bt-date-col">
              <p className="bt-label">{language === "kz" ? monthTitleKz[monthIndex] : monthTitle}</p>
              <p className="bt-date-day">{day}</p>
              <p className="bt-date-sub">{year}</p>
            </div>
            <div className="bt-date-sep" aria-hidden="true" />
            <div className="bt-date-col">
              <p className="bt-label">{copy.time as string}</p>
              <p className="bt-date-time">{invite.time}</p>
              <p className="bt-date-sub">{weekday}</p>
            </div>
          </div>
          {invite.dressCode ? (
            <p className="bt-dresscode"><span>{copy.dressCode as string}:</span> {invite.dressCode}</p>
          ) : null}
          {invite.mapLink ? (
            <a className="bt-btn bt-btn-primary" href={invite.mapLink}>
              <CalendarPlus size={18} />
              {copy.openMap as string}
            </a>
          ) : null}
        </div>
      </section>

      {/* PROGRAM */}
      <section className="bt-program" id="program" data-reveal>
        <div className="bt-section-head">
          <Sparkles size={26} />
          <h2 className="bt-section-title">{copy.besikProgramTitle as string}</h2>
          <div className="bt-hline" aria-hidden="true" />
        </div>
        <div className="bt-program-grid">
          {program.map((item, index) => {
            const row = splitProgramItem(item);
            const Icon = programIcons[index % programIcons.length];
            return (
              <article className="bt-glass bt-program-card" key={`${item}-${index}`} data-reveal style={{ "--i": index } as CSSProperties}>
                <div className="bt-program-icon"><Icon size={24} /></div>
                <p className="bt-program-time">{row.time || String(index + 1).padStart(2, "0")}</p>
                <p className="bt-program-title">{row.title}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* GALLERY */}
      {gallery.length ? (
        <section className="bt-gallery" id="gallery" data-reveal>
          <div className="bt-gallery-grid">
            {gallery.slice(0, 4).map((src, index) => (
              <div className={`bt-gallery-item ${index === 0 ? "bt-gallery-lead" : ""}`} key={src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${invite.names} ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* MUSIC */}
      {invite.musicUrl ? (
        <section className="bt-music" id="music" data-reveal>
          <Music2 size={26} />
          <h2 className="bt-section-title">{copy.music as string}</h2>
          <InvitationAudio src={invite.musicUrl} language={language} />
        </section>
      ) : null}

      {/* RSVP */}
      {invite.rsvpEnabled ? (
        <section className="bt-rsvp" id="rsvp" data-reveal>
          <div className="bt-glass bt-rsvp-card">
            <h2 className="bt-section-title">{copy.answerFormTitle as string}</h2>
            <p className="bt-rsvp-note">{copy.confirmAttendanceLong as string}</p>
            <form action={`/api/invite/${invite.slug}/rsvp`} method="post" className="bt-form">
              <label className="bt-field">
                <span className="bt-label">{copy.guestName as string}</span>
                <input name="guest_name" placeholder={copy.guestNamePlaceholder as string} required />
              </label>

              <fieldset className="bt-field">
                <span className="bt-label">{copy.areYouComing as string}</span>
                <label className="bt-radio">
                  <input type="radio" name="answer" value="yes" defaultChecked />
                  <span>{copy.yesComing as string}</span>
                </label>
                <label className="bt-radio">
                  <input type="radio" name="answer" value="no" />
                  <span>{copy.noComing as string}</span>
                </label>
              </fieldset>

              <label className="bt-field">
                <span className="bt-label">{copy.guestCount as string}</span>
                <input defaultValue="2" min="1" name="guest_count" type="number" />
              </label>

              <button className="bt-btn bt-btn-primary bt-btn-block" type="submit">
                <Send /> {copy.send as string}
              </button>
            </form>
            <a className="bt-rsvp-whatsapp" href={whatsappHref}>{language === "kz" ? "WhatsApp арқылы жазу" : "Написать в WhatsApp"}</a>
          </div>
        </section>
      ) : null}

      {/* VENUE */}
      <section className="bt-venue" id="venue" data-reveal>
        <div className="bt-glass bt-venue-panel">
          <span className="bt-venue-icon"><MapPin size={26} /></span>
          <p className="bt-label">{copy.address as string}</p>
          <h2 className="bt-venue-name">{invite.venue}</h2>
          <p className="bt-venue-address">{invite.address}</p>
          {invite.mapLink ? (
            <a className="bt-venue-link" href={invite.mapLink}>
              <MapIcon size={18} />
              {copy.openWithNavigator as string}
            </a>
          ) : null}
        </div>
      </section>

      <footer className="bt-footer">
        <div className="bt-brand bt-footer-brand">Amanat</div>
        <p className="bt-footer-note">{copy.gratitude as string}</p>
        <div className="bt-footer-icons"><Heart size={18} /><Sparkles size={18} /></div>
      </footer>
    </main>
  );
}

function Send() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
    </svg>
  );
}
