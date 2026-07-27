"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { copyFor, toPublicLanguage, withLanguage, type PublicLanguage } from "@/lib/i18n";

const linkItems = [{ href: "/demo", key: "navDemo" }] as const;

export function SiteNav({ section, language: languageInput = "kz" }: { section?: string; language?: PublicLanguage }) {
  const language = toPublicLanguage(languageInput);
  const copy = copyFor(language);
  const [open, setOpen] = useState(false);
  const whatsappText = language === "kz" ? "Онлайн шақыру жасатқым келеді" : "Хочу сделать онлайн-приглашение";
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Toi Invite">
        <span className="brand-mark">T</span>
        <span>
          <strong>Toi</strong>
          <small>{section ?? (copy.navSection as string)}</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label={copy.navPrimary as string}>
        {linkItems.map((link) => (
          <Link key={link.href} href={withLanguage(link.href, language)}>
            {copy[link.key] as string}
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
        aria-label={open ? (copy.closeMenu as string) : (copy.openMenu as string)}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <nav className="mobile-nav" aria-label={copy.navPrimary as string}>
          {linkItems.map((link) => (
            <Link key={link.href} href={withLanguage(link.href, language)} onClick={() => setOpen(false)}>
              {copy[link.key] as string}
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
