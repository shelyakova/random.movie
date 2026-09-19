"use server";

import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE_MAX_AGE_SECONDS, LOCALE_COOKIE_NAME } from "./config";

export async function setLocale(locale: string) {
  if (!isLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  (await cookies()).set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
  });
}
