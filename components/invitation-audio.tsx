import { copyFor, toPublicLanguage, type StoredLanguage } from "@/lib/i18n";

type InvitationAudioProps = {
  src?: string;
  label?: string;
  className?: string;
  language?: StoredLanguage;
};

export function InvitationAudio({ src, label, className, language: languageInput }: InvitationAudioProps) {
  if (!src) {
    return null;
  }

  const language = toPublicLanguage(languageInput);
  const copy = copyFor(language);

  return (
    <div className={["invite-audio", className].filter(Boolean).join(" ")}>
      <span>{label ?? (copy.musicLabel as string)}</span>
      <audio controls preload="metadata" src={src} />
    </div>
  );
}
