"use client";

import { Calendar, Clock, Heart, MapPin, MessageCircle, Music2, Send } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { InvitationAudio } from "@/components/invitation-audio";
import type { PublicInviteView } from "@/components/invitation-renderer";

function splitProgramItem(item: string) {
  const match = item.match(/^([^–—-]+)\s*[–—-]\s*(.+)$/);
  return match ? { time: match[1].trim(), title: match[2].trim() } : { time: "", title: item };
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
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      }),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return rootRef;
}

export function EmeraldCardInvite({ invite }: { invite: PublicInviteView }) {
  const rootRef = useReveal();
  const program = invite.program.length
    ? invite.program
    : ["18:30 - Сбор гостей", "19:00 - Церемония", "20:00 - Праздничный ужин", "22:30 - Завершение"];
  const shareText = encodeURIComponent(`Приглашение: ${invite.venue}`);

  return (
    <main className="ecard" ref={rootRef}>
      <header className="ecard-topbar">
        <strong>Toi</strong>
        <span>{invite.type}</span>
      </header>

      {/* HERO CARD */}
      <section className="ecard-hero" id="hero">
        <div className="ecard-frame" data-reveal>
          <span className="ecard-kicker">{invite.type}</span>
          <h1 className="ecard-names">{invite.names}</h1>
          <p className="ecard-text">{invite.text}</p>

          <div className="ecard-meta">
            <div>
              <Calendar size={15} />
              <span>Дата</span>
              <strong>{invite.date}</strong>
            </div>
            <div>
              <Clock size={15} />
              <span>Время</span>
              <strong>{invite.time}</strong>
            </div>
          </div>

          <div className="ecard-venue">
            <small>{invite.address}</small>
            <strong>{invite.venue}</strong>
          </div>

          {invite.rsvpEnabled ? <a className="ecard-rsvp-btn" href="#rsvp">RSVP</a> : null}
        </div>
        <a className="ecard-scroll" href="#program" aria-label="Листайте вниз"><span /></a>
      </section>

      {/* PROGRAM */}
      <section className="ecard-section ecard-program" id="program" data-reveal>
        <span className="ecard-label">Программа</span>
        <h2>Той бағдарламасы</h2>
        <div className="ecard-timeline">
          {program.map((item, index) => {
            const row = splitProgramItem(item);
            return (
              <article key={`${item}-${index}`} data-reveal style={{ "--i": index } as CSSProperties}>
                <strong>{row.time || String(index + 1).padStart(2, "0")}</strong>
                <p>{row.title}</p>
              </article>
            );
          })}
        </div>
      </section>

      {invite.musicUrl ? (
        <section className="ecard-section ecard-music" id="music" data-reveal>
          <Music2 size={26} />
          <span className="ecard-label">Музыка</span>
          <h2>Музыка приглашения</h2>
          <p>Мелодия будет доступна гостям прямо на странице.</p>
          <InvitationAudio src={invite.musicUrl} />
        </section>
      ) : null}

      {/* VENUE / MAP */}
      <section className="ecard-section ecard-place" id="venue" data-reveal>
        <MapPin size={26} />
        <span className="ecard-label">Место проведения</span>
        <h2>{invite.venue}</h2>
        <p>{invite.address}</p>
        {invite.mapLink ? <a className="ecard-map-link" href={invite.mapLink}>Открыть карту</a> : null}
      </section>

      {/* RSVP */}
      {invite.rsvpEnabled ? (
        <section className="ecard-section ecard-rsvp" id="rsvp" data-reveal>
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

      <footer className="ecard-footer" data-reveal>
        <Heart size={18} />
        <strong>{invite.names}</strong>
        <p>Сізді асыға күтеміз</p>
        <a className="ecard-share" href={`https://wa.me/?text=${shareText}`}>Поделиться</a>
      </footer>
    </main>
  );
}
