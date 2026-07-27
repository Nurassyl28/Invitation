export const stitchTemplateIds = [
  "besik-stitch-heritage",
  "birthday-gold-ornament",
  "birthday-emerald-jubilee",
  "mereytoy-gold-jubilee",
  "sundet-blue-royal",
  "tusaukeser-gold-baby",
] as const;

export type StitchTemplateId = (typeof stitchTemplateIds)[number];

export function isStitchTemplateId(templateId: string | undefined): templateId is StitchTemplateId {
  return Boolean(templateId && stitchTemplateIds.includes(templateId as StitchTemplateId));
}
