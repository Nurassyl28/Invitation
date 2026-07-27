import { redirect } from "next/navigation";
import { toPublicLanguage } from "@/lib/i18n";

export default async function IstaraAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  const paramsValue = await searchParams;
  const language = toPublicLanguage(Array.isArray(paramsValue.lang) ? paramsValue.lang[0] : paramsValue.lang);

  redirect(`/demo/wedding-editorial-istara?lang=${language}`);
}
