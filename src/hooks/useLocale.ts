"use client";

import { usePathname } from "next/navigation";
import { Locale, t as translate } from "@/lib/i18n";

export function useLocale() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/fr") ? "fr" : "en";
  const altLocale: Locale = locale === "en" ? "fr" : "en";

  function t(key: string): string {
    return translate(locale, key);
  }

  function getLocalePath(path: string): string {
    return `/${locale}${path}`;
  }

  function getAltLocalePath(): string {
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "");
    return `/${altLocale}${pathWithoutLocale}`;
  }

  return { locale, altLocale, t, getLocalePath, getAltLocalePath };
}
