"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/demo", label: "Демо" },
];

export function SiteNav({ section = "Онлайн-приглашения" }: { section?: string }) {
  const [open, setOpen] = useState(false);
  const whatsappHref = "https://wa.me/?text=%D0%A5%D0%BE%D1%87%D1%83%20%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D1%82%D1%8C%20%D0%BE%D0%BD%D0%BB%D0%B0%D0%B9%D0%BD-%D0%BF%D1%80%D0%B8%D0%B3%D0%BB%D0%B0%D1%88%D0%B5%D0%BD%D0%B8%D0%B5";

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
        <a className="button primary" href={whatsappHref}>
          <MessageCircle size={15} />
          WhatsApp
        </a>
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
          <a className="button primary" href={whatsappHref} onClick={() => setOpen(false)}>
            <MessageCircle size={15} />
            WhatsApp
          </a>
        </nav>
      ) : null}
    </header>
  );
}
