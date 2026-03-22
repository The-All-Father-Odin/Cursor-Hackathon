"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n";

export function LocaleHtmlSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = getLocaleFromPath(pathname ?? "/");
    document.documentElement.lang = locale;
    document.documentElement.dir = "ltr";
  }, [pathname]);

  return null;
}
