// Locale-aware formatting shared by server and client components.
const LOCALES: Record<string, string> = {
  en: "en-GB", ru: "ru-RU", es: "es-ES", fr: "fr-FR", de: "de-DE",
  it: "it-IT", ja: "ja-JP", zh: "zh-CN", ko: "ko-KR", pt: "pt-PT",
};

export const localeFor = (language: string) => LOCALES[language] ?? "en-GB";

/** Formats a YYYY-MM-DD date without shifting it across time zones. */
export function formatDate(date: string, language: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat(localeFor(language), { ...opts, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function formatDateRange(start: string, end: string, language: string) {
  return `${formatDate(start, language)} – ${formatDate(end, language, { day: "numeric", month: "short", year: "numeric" })}`;
}

export function formatMoney(amount: number, currency: string, language: string) {
  return new Intl.NumberFormat(localeFor(language), { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDuration(minutes: number, t: (key: string, vars?: Record<string, number>) => string) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return t("durationHM", { h, m });
  if (h) return t("durationH", { h });
  return t("durationM", { m });
}

/** Whole days from today (UTC) until the given date; negative when in the past. */
export function daysUntil(date: string, today = new Date().toISOString().slice(0, 10)) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

/** Deterministic gradient so each destination gets its own recognisable cover. */
export function coverGradient(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const hue = h % 360;
  return `linear-gradient(160deg, hsl(${hue} 85% 64%) 0%, hsl(${(hue + 32) % 360} 78% 46%) 100%)`;
}
