"use client";

import { Calendar, Heart, MapPin, MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import type { PublicInviteView } from "@/components/invitation-renderer";

const EDITORIAL_IMAGE = "/istara/assets/reference.jpg";

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
  }, []);

  return rootRef;
}

export function EditorialWeddingInvite({ invite }: { invite: PublicInviteView }) {
  const rootRef = useReveal();
  const program = invite.program.length
    ? invite.program
    : ["16:30 - Сбор гостей", "17:00 - Церемония", "18:00 - Ужин", "22:30 - Завершение"];
  const photo = invite.heroPhotoUrl || EDITORIAL_IMAGE;
  const shareText = encodeURIComponent(`Свадебное приглашение: ${invite.names} — ${invite.venue}`);

  return (
    <main className="ew" ref={rootRef}>
      <header className="ew-header">
        <a href="#hero">A&A</a>
        <nav aria-label="Wedding navigation">
          <a href="#details">Детали</a>
          <a href="#program">Program</a>
          <a href="#rsvp">RSVP</a>
        </nav>
      </header>

      <section className="ew-hero" id="hero">
        <div className="ew-hero-image" style={{ "--photo": `url(${photo})` } as CSSProperties} aria-hidden="true" />
        <div className="ew-hero-shade" aria-hidden="true" />
        <div className="ew-hero-copy" data-reveal>
          <span>Wedding invitation</span>
          <h1>{invite.names}</h1>
          <p>Біз сіздерді үйлену тойымыздың қадірлі қонағы болуға шақырамыз</p>
          <a href="#details">Смотреть детали</a>
        </div>
      </section>

      <section className="ew-story" data-reveal>
        <span>Құрметті қонақтар</span>
        <h2>Бізбен бірге осы қуанышты бөлісіңіз</h2>
        <p>{invite.text}</p>
      </section>

      <section className="ew-details" id="details">
        <article className="ew-photo-card" data-reveal style={{ "--photo": `url(${photo})` } as CSSProperties}>
          <div>
            <span>Үйлену той</span>
            <strong>{invite.date}</strong>
            <p>Один день, одна семья, одна история.</p>
          </div>
        </article>

        <article className="ew-paper-card" data-reveal>
          <Sparkles size={24} />
          <span>Details</span>
          <h2>{invite.venue}</h2>
          <p>{invite.address}</p>
          <div className="ew-meta">
            <div>
              <Calendar size={18} />
              <strong>{invite.date}</strong>
            </div>
            <div>
              <MapPin size={18} />
              <strong>{invite.time}</strong>
            </div>
          </div>
          {invite.mapLink ? <a href={invite.mapLink}>Открыть карту</a> : null}
        </article>
      </section>

      <section className="ew-program" id="program" data-reveal>
        <span>Program</span>
        <h2>Программа вечера</h2>
        <div>
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

      <section className="ew-quote" data-reveal>
        <span>Amanat</span>
        <blockquote>«Екі жүрек, бір шаңырақ»</blockquote>
        <p>Сіздердің ақ тілектеріңіз біздің жаңа өміріміздің ең әдемі бастамасы болады.</p>
      </section>

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

      <footer className="ew-footer">
        <Heart size={18} />
        <strong>{invite.names}</strong>
        <a href={`https://wa.me/?text=${shareText}`}>Поделиться</a>
      </footer>
    </main>
  );
}
