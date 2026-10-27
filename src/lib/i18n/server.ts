import { cookies } from "next/headers";
import { LANG_COOKIE, translate, translations, type Language } from "./translations";

export async function getServerLanguage(): Promise<Language> {
  const value = (await cookies()).get(LANG_COOKIE)?.value as Language | undefined;
  return value && translations[value] ? value : "en";
}

export async function getServerT() {
  const language = await getServerLanguage();
  return (key: string, vars?: Record<string, string | number>) => translate(language, key, vars);
}
