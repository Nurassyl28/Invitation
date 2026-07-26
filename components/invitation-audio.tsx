type InvitationAudioProps = {
  src?: string;
  label?: string;
  className?: string;
};

export function InvitationAudio({ src, label = "Музыка приглашения", className }: InvitationAudioProps) {
  if (!src) {
    return null;
  }

  return (
    <div className={["invite-audio", className].filter(Boolean).join(" ")}>
      <span>{label}</span>
      <audio controls preload="metadata" src={src} />
    </div>
  );
}
