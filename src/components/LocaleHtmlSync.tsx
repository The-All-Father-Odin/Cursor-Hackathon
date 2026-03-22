"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/lib/i18n";

export function LocaleHtmlSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = getLocaleFromPath(pathname);
  }, [pathname]);

  return null;
}
