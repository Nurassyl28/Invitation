"use client";

import Link from "next/link";
import { Globe2, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/templates", label: "Шаблоны" },
  { href: "/partners", label: "Партнёрам" },
  { href: "/login", label: "Войти" },
];

export function SiteNav({ section = "Онлайн-приглашения" }: { section?: string }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"RU" | "KZ">("RU");

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Toi Invite">
        <span className="brand-mark">T</span>
        <span>
          <strong>Toi</strong>
          <small>{section}</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Основная навигация">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <button
          className="button secondary"
          type="button"
          aria-label="Переключить язык"
          onClick={() => setLanguage((current) => (current === "RU" ? "KZ" : "RU"))}
        >
          <Globe2 size={15} />
          {language}
        </button>
        <Link className="button primary" href="/builder">
          Создать
        </Link>
      </nav>

      <button
        className="icon-button mobile-only"
        type="button"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <nav className="mobile-nav" aria-label="Мобильная навигация">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <button
            className="button secondary"
            type="button"
            onClick={() => setLanguage((current) => (current === "RU" ? "KZ" : "RU"))}
          >
            <Globe2 size={15} />
            {language}
          </button>
          <Link className="button primary" href="/builder" onClick={() => setOpen(false)}>
            Создать
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
