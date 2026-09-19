import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

export function getLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;

  const candidates = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { language: tag.trim().toLowerCase().split("-")[0], q, index };
    })
    .filter((candidate) => Number.isFinite(candidate.q) && candidate.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  const match = candidates.find((candidate) => isLocale(candidate.language));
  return match && isLocale(match.language) ? match.language : DEFAULT_LOCALE;
}
