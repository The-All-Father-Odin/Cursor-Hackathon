"use client";

import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { Search, MapPin, BarChart3, Bookmark, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { t, getLocalePath, getAltLocalePath, altLocale, locale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const switchLanguageLabel =
    locale === "fr"
      ? `Passer à ${altLocale === "fr" ? "français" : "anglais"}`
      : `Switch to ${altLocale === "fr" ? "French" : "English"}`;

  const navItems = [
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/map", label: t("nav.map"), icon: MapPin },
    { href: "/tariffs", label: t("nav.tariffs"), icon: BarChart3 },
    { href: "/shortlists", label: t("nav.shortlists"), icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={getLocalePath("/")} className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 bg-maple rounded-xl text-white group-hover:bg-maple-dark transition-colors">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                Source<span className="text-maple">Local</span>
              </span>
              <span className="text-[10px] text-slate-400 leading-none -mt-0.5 tracking-wider uppercase">Canada</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={getLocalePath(item.href)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href={getAltLocalePath()}
              className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {altLocale.toUpperCase()}
            </Link>
            <Link
              href={getLocalePath("/search")}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-maple rounded-xl hover:bg-maple-dark transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              {t("hero.cta")}
            </Link>
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 mt-2 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={getLocalePath(item.href)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                {item.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <Link
                href={getAltLocalePath()}
                className="flex items-center px-3 py-2.5 text-sm text-slate-500"
                onClick={() => setMobileOpen(false)}
              >
                {switchLanguageLabel}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
