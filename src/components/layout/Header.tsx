"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { Search, MapPin, BarChart3, Bookmark, Menu, X, Leaf } from "lucide-react";
import { Suspense, useState } from "react";

function LocaleSwitchLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const nextHref = query ? `${href}?${query}` : href;

  return (
    <Link href={nextHref} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export function Header() {
  const { t, getLocalePath, getAltLocalePath, altLocale, locale } = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const switchLanguageLabel =
    locale === "fr"
      ? `Passer à ${altLocale === "fr" ? "français" : "anglais"}`
      : `Switch to ${altLocale === "fr" ? "French" : "English"}`;
  const mobileMenuLabel =
    locale === "fr" ? "Ouvrir ou fermer le menu" : "Open or close menu";

  const navItems = [
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/map", label: t("nav.map"), icon: MapPin },
    { href: "/tariffs", label: t("nav.tariffs"), icon: BarChart3 },
    { href: "/shortlists", label: t("nav.shortlists"), icon: Bookmark },
  ];

  const isActivePath = (href: string) => {
    const localizedHref = getLocalePath(href);
    return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
  };
  const altLocalePath = getAltLocalePath();

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
              (() => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.href}
                    href={getLocalePath(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? "bg-maple/10 text-maple"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })()
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Suspense
              fallback={
                <Link
                  href={altLocalePath}
                  className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {altLocale.toUpperCase()}
                </Link>
              }
            >
              <LocaleSwitchLink
                href={altLocalePath}
                className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-slate-500 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {altLocale.toUpperCase()}
              </LocaleSwitchLink>
            </Suspense>
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
              aria-label={mobileMenuLabel}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div id="mobile-nav" className="md:hidden pb-4 border-t border-slate-100 mt-2 pt-3">
            {navItems.map((item) => (
              (() => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.href}
                    href={getLocalePath(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg ${
                      isActive
                        ? "bg-maple/10 text-maple"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-maple" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })()
            ))}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <Suspense
                fallback={
                  <Link
                    href={altLocalePath}
                    className="flex items-center px-3 py-2.5 text-sm text-slate-500"
                    onClick={() => setMobileOpen(false)}
                  >
                    {switchLanguageLabel}
                  </Link>
                }
              >
                <LocaleSwitchLink
                  href={altLocalePath}
                  className="flex items-center px-3 py-2.5 text-sm text-slate-500"
                  onClick={() => setMobileOpen(false)}
                >
                  {switchLanguageLabel}
                </LocaleSwitchLink>
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
