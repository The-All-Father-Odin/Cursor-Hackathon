"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { Leaf } from "lucide-react";

export function Footer() {
  const { t, getLocalePath } = useLocale();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-maple rounded-lg text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">
                Source<span className="text-maple">Local</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{t("footer.product")}</h3>
            <ul className="space-y-2.5">
              <li><Link href={getLocalePath("/search")} className="text-sm hover:text-white transition-colors">{t("nav.search")}</Link></li>
              <li><Link href={getLocalePath("/map")} className="text-sm hover:text-white transition-colors">{t("nav.map")}</Link></li>
              <li><Link href={getLocalePath("/tariffs")} className="text-sm hover:text-white transition-colors">{t("nav.tariffs")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{t("footer.company")}</h3>
            <ul className="space-y-2.5">
              <li><Link href={getLocalePath("/")} className="text-sm hover:text-white transition-colors">{t("footer.about")}</Link></li>
              <li><Link href={getLocalePath("/")} className="text-sm hover:text-white transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">{t("footer.legal")}</h3>
            <ul className="space-y-2.5">
              <li><Link href={getLocalePath("/")} className="text-sm hover:text-white transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href={getLocalePath("/")} className="text-sm hover:text-white transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
