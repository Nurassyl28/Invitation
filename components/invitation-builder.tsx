"use client";

import {
  Check,
  Copy,
  CreditCard,
  Eye,
  ImagePlus,
  Languages,
  MapPin,
  Music,
  Save,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { invitation } from "@/lib/data";

type DraftField = Exclude<keyof typeof invitation, "program">;
type BuilderStep = "event" | "media" | "rsvp" | "payment";
type BuilderLanguage = "RU" | "KZ";

const steps: Array<{ id: BuilderStep; label: string }> = [
  { id: "event", label: "Событие" },
  { id: "media", label: "Медиа" },
  { id: "rsvp", label: "RSVP" },
  { id: "payment", label: "Оплата" },
];

const nextStep: Record<BuilderStep, BuilderStep> = {
  event: "media",
  media: "rsvp",
  rsvp: "payment",
  payment: "payment",
};

const invitationText: Record<BuilderLanguage, string> = {
  RU: "С уважением приглашаем вас разделить с нами этот важный день.",
  KZ: "Құрметті қонақтар, сіздерді қуанышымызға ортақ болуға шақырамыз.",
};

export function InvitationBuilder() {
  const [draft, setDraft] = useState(invitation);
  const [activeStep, setActiveStep] = useState<BuilderStep>("event");
  const [language, setLanguage] = useState<BuilderLanguage>("RU");
  const [rsvpEnabled, setRsvpEnabled] = useState(true);
  const [wishesEnabled, setWishesEnabled] = useState(true);
  const [mapEnabled, setMapEnabled] = useState(true);
  const [privateAccess, setPrivateAccess] = useState(false);
  const [musicAdded, setMusicAdded] = useState(false);
  const [galleryAdded, setGalleryAdded] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl = `http://localhost:3000/invite/${draft.slug}`;

  function updateDraft(field: DraftField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function changeLanguage(nextLanguage: BuilderLanguage) {
    setLanguage(nextLanguage);
    setDraft((current) => ({ ...current, text: invitationText[nextLanguage] }));
  }

  async function copyPublicLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="builder-grid">
      <main className="workspace">
        <div className="builder-head">
          <div>
            <span className="eyebrow">{saved ? "Saved draft" : "Draft"}</span>
            <h1>Новое приглашение</h1>
          </div>
          <div className="button-row">
            <button className="icon-button" type="button" title="Сохранить" onClick={() => setSaved(true)}>
              {saved ? <Check size={18} /> : <Save size={18} />}
            </button>
            <Link className="button secondary" href={`/invite/${draft.slug}`}>
              <Eye size={16} />
              Preview
            </Link>
            <button className="button primary" type="button" onClick={() => setActiveStep("payment")}>
              <Send size={16} />
              Publish
            </button>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Разделы редактора">
          {steps.map((step) => (
            <button
              className={activeStep === step.id ? "is-active" : ""}
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        {activeStep === "event" ? (
          <section className="panel">
            <div className="form-grid">
              <label className="field">
                <span>Тип события</span>
                <select value={draft.type} onChange={(event) => updateDraft("type", event.target.value)}>
                  <option>Свадьба</option>
                  <option>Қыз ұзату</option>
                  <option>Бесік той</option>
                  <option>Тұсаукесер</option>
                  <option>Юбилей</option>
                </select>
              </label>
              <label className="field">
                <span>Имена</span>
                <input value={draft.names} onChange={(event) => updateDraft("names", event.target.value)} />
              </label>
              <label className="field">
                <span>Дата</span>
                <input value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
              </label>
              <label className="field">
                <span>Время</span>
                <input value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} />
              </label>
              <label className="field">
                <span>Зал</span>
                <input value={draft.venue} onChange={(event) => updateDraft("venue", event.target.value)} />
              </label>
              <label className="field">
                <span>Slug</span>
                <input value={draft.slug} onChange={(event) => updateDraft("slug", event.target.value)} />
              </label>
              <label className="field full">
                <span>Адрес</span>
                <input value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} />
              </label>
              <div className="field full">
                <span>Язык приглашения</span>
                <div className="button-row">
                  <button className={`button ${language === "RU" ? "primary" : "secondary"}`} type="button" onClick={() => changeLanguage("RU")}>
                    <Languages size={16} />
                    RU
                  </button>
                  <button className={`button ${language === "KZ" ? "primary" : "secondary"}`} type="button" onClick={() => changeLanguage("KZ")}>
                    KZ
                  </button>
                </div>
              </div>
              <label className="field full">
                <span>Текст приглашения</span>
                <textarea value={draft.text} onChange={(event) => updateDraft("text", event.target.value)} />
              </label>
            </div>
          </section>
        ) : null}

        {activeStep === "media" ? (
          <section className="settings-grid">
            <article className="panel">
              <h2>Медиа</h2>
              <button className="button secondary" type="button" onClick={() => setMusicAdded((value) => !value)}>
                <Music size={16} />
                {musicAdded ? "Музыка добавлена" : "Добавить музыку"}
              </button>
              <button className="button secondary" type="button" onClick={() => setGalleryAdded((value) => !value)}>
                <ImagePlus size={16} />
                {galleryAdded ? "Галерея добавлена" : "Добавить фото"}
              </button>
              <button className="button secondary" type="button" onClick={() => setMapEnabled((value) => !value)}>
                <MapPin size={16} />
                {mapEnabled ? "Карта включена" : "Включить карту"}
              </button>
            </article>
            <article className="panel">
              <h2>Preview-блоки</h2>
              <p>{musicAdded ? "Музыкальный блок будет показан гостям." : "Музыка пока не добавлена."}</p>
              <p>{galleryAdded ? "Галерея будет отображаться в приглашении." : "Фото можно добавить позже."}</p>
              <p>{mapEnabled ? "Карта будет видна на публичной странице." : "Карта скрыта."}</p>
            </article>
          </section>
        ) : null}

        {activeStep === "rsvp" ? (
          <section className="settings-grid">
            <article className="panel">
              <h2>Блоки страницы</h2>
              <label className="switch"><input type="checkbox" checked={rsvpEnabled} onChange={(event) => setRsvpEnabled(event.target.checked)} /> RSVP</label>
              <label className="switch"><input type="checkbox" checked={wishesEnabled} onChange={(event) => setWishesEnabled(event.target.checked)} /> Пожелания гостей</label>
              <label className="switch"><input type="checkbox" checked={mapEnabled} onChange={(event) => setMapEnabled(event.target.checked)} /> Карта</label>
              <label className="switch"><input type="checkbox" checked={privateAccess} onChange={(event) => setPrivateAccess(event.target.checked)} /> Приватный доступ</label>
            </article>
            <article className="panel">
              <h2>Что увидит гость</h2>
              <p>{rsvpEnabled ? "Форма подтверждения участия включена." : "RSVP будет скрыт."}</p>
              <p>{wishesEnabled ? "Гости смогут оставить пожелание." : "Пожелания отключены."}</p>
              <p>{privateAccess ? "Доступ будет по паролю." : "Ссылка будет открытой после публикации."}</p>
            </article>
          </section>
        ) : null}

        {activeStep === "payment" ? (
          <section className="panel compact">
            <h2>Публикация и оплата</h2>
            <p>Для платных тарифов приглашение становится публичным после проверки Kaspi-чека админом.</p>
            <label className="switch">
              <input type="checkbox" checked={receiptUploaded} onChange={(event) => setReceiptUploaded(event.target.checked)} />
              Kaspi чек загружен
            </label>
            <div className="button-row">
              <button className="button secondary" type="button" onClick={copyPublicLink}>
                <Copy size={16} />
                {copied ? "Ссылка скопирована" : "Копировать ссылку"}
              </button>
              <Link className="button secondary" href={`/invite/${draft.slug}`}>
                <Eye size={16} />
                Preview
              </Link>
              <button className="button primary" type="button">
                <CreditCard size={16} />
                {receiptUploaded ? "Отправить на проверку" : "Загрузить чек"}
              </button>
            </div>
          </section>
        ) : null}

        <div className="builder-next">
          {activeStep !== "payment" ? (
            <button className="button primary" type="button" onClick={() => setActiveStep(nextStep[activeStep])}>
              Далее: {steps.find((step) => step.id === nextStep[activeStep])?.label}
            </button>
          ) : (
            <p>После проверки оплаты статус станет `active`, и ссылка будет готова для WhatsApp.</p>
          )}
        </div>
      </main>

      <aside className="preview-column">
        <div className="phone-preview">
          <div className="phone-bar" />
          <div className="phone-screen">
            <span>{draft.type} · {language}</span>
            <h2>{draft.names}</h2>
            <p>{draft.text}</p>
            <div className="phone-meta">
              <strong>{draft.date}</strong>
              <strong>{draft.time}</strong>
            </div>
            {mapEnabled ? (
              <div className="phone-location">
                <small>{draft.address}</small>
                <strong>{draft.venue}</strong>
              </div>
            ) : null}
            {musicAdded ? <div className="phone-location"><small>Музыка</small><strong>Включена</strong></div> : null}
            {rsvpEnabled ? <div className="phone-rsvp">RSVP</div> : null}
          </div>
        </div>
        <div className="panel compact">
          <strong>toi-invite.kz/invite/{draft.slug}</strong>
          <p>Текущий шаг: {steps.find((step) => step.id === activeStep)?.label}</p>
          <button className="button secondary" type="button" onClick={copyPublicLink}>
            <Copy size={16} />
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </aside>
    </section>
  );
}
