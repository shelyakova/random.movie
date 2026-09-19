import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { isLocale, LOCALE_COOKIE_NAME, type Locale } from "./config";
import { getLocaleFromAcceptLanguage } from "./resolve-locale";

async function loadMessages(locale: Locale) {
  if (process.env.NODE_ENV === "production") {
    return (await import(`../messages/${locale}.json`)).default;
  }

  const file = path.join(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(await readFile(file, "utf8"));
}

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : getLocaleFromAcceptLanguage((await headers()).get("accept-language"));

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
