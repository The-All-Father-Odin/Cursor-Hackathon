"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { NAICS_CATEGORIES } from "@/data/mock-suppliers";
import { getStats, searchSuppliers } from "@/lib/api";
import type { StatsResponse, ApiSupplier } from "@/lib/api";
import {
  Search,
  MapPin,
  Shield,
  BarChart3,
  ArrowRight,
  Leaf,
  ChevronRight,
  CheckCircle2,
  Building2,
  Globe,
  Utensils,
  GlassWater,
  Trees,
  Package,
  Layers,
  Wrench,
  Settings2,
  Cpu,
  Zap,
  Truck,
  Sofa,
  Factory,
} from "lucide-react";

const NAICS_ICONS: Record<string, React.ElementType> = {
  "311": Utensils,
  "312": GlassWater,
  "321": Trees,
  "326": Package,
  "331": Layers,
  "332": Wrench,
  "333": Settings2,
  "334": Cpu,
  "335": Zap,
  "336": Truck,
  "337": Sofa,
  "339": Factory,
};

const FEATURE_LIST = [
  {
    icon: Search,
    titleKey: "features.search.title",
    descKey: "features.search.description",
    accent: "bg-maple-light",
    iconColor: "text-maple",
  },
  {
    icon: Shield,
    titleKey: "features.score.title",
    descKey: "features.score.description",
    accent: "bg-maple-light",
    iconColor: "text-maple",
  },
  {
    icon: MapPin,
    titleKey: "features.map.title",
    descKey: "features.map.description",
    accent: "bg-gold-light",
    iconColor: "text-gold",
  },
  {
    icon: BarChart3,
    titleKey: "features.tariff.title",
    descKey: "features.tariff.description",
    accent: "bg-gold-light",
    iconColor: "text-gold",
  },
];

const CAPACITY_TIER_STYLES: Record<string, string> = {
  Small: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Medium: "bg-blue-50 text-blue-700 border-blue-100",
  Large: "bg-purple-50 text-purple-700 border-purple-100",
};

export function LandingPage() {
  const { t, locale, getLocalePath } = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState<StatsResponse["stats"] | null>(null);
  const [featuredSuppliers, setFeaturedSuppliers] = useState<ApiSupplier[]>([]);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const statsRes = await getStats();
        setStats(statsRes.stats);
        const featured = await searchSuppliers({ limit: 6 });
        setFeaturedSuppliers(featured.rows);
      } catch {
        // Fall back to static text
      } finally {
        setStatsLoaded(true);
      }
    })();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `${getLocalePath("/search")}${query ? `?query=${encodeURIComponent(query)}` : ""}`
    );
  };

  const supplierStatValue = stats
    ? `${stats.supplier_count.toLocaleString()}`
    : t("hero.stats.suppliers");
  const supplierStatSub =
    stats
      ? locale === "fr"
        ? "fournisseurs vérifiés"
        : "Verified Suppliers"
      : locale === "fr"
      ? "dans notre base"
      : "in our database";

  const sourceStatValue = stats
    ? `${stats.source_count}`
    : t("hero.stats.provinces");
  const sourceStatSub =
    stats
      ? locale === "fr"
        ? "sources de données"
        : "Data Sources"
      : locale === "fr"
      ? "partout au Canada"
      : "across Canada";

  const browseCategoryLabel = locale === "fr" ? "Parcourir par industrie" : "Browse by Industry";
  const browseCategorySubLabel =
    locale === "fr"
      ? "Explorez les fournisseurs canadiens dans 12 grands secteurs manufacturiers."
      : "Explore Canadian suppliers across 12 major manufacturing sectors.";
  const industryStatValue = String(NAICS_CATEGORIES.length);
  const industryStatSub =
    locale === "fr" ? "grands secteurs" : "major industries";
  const ctaHeadline = locale === "fr" ? "Prêt à acheter canadien?" : "Ready to buy Canadian?";
  const ctaSubtitle =
    locale === "fr"
      ? "Rejoignez des milliers d'entreprises qui découvrent des fournisseurs canadiens."
      : "Join thousands of businesses discovering domestic suppliers and strengthening Canadian supply chains.";
  const featureSubtitle =
    locale === "fr"
      ? "Une plateforme. Toute l'intelligence dont vous avez besoin pour vous approvisionner au Canada."
      : "One platform. All the intelligence you need to source confidently within Canada.";
  const trustLabels =
    locale === "fr"
      ? [
          stats
            ? `${stats.supplier_count.toLocaleString()} fournisseurs canadiens`
            : "50 000+ fournisseurs canadiens",
          "Données hébergées au Canada",
          "Bilingue FR/EN",
        ]
      : [
          stats
            ? `${stats.supplier_count.toLocaleString()} Canadian suppliers`
            : "50,000+ Canadian suppliers",
          "Canadian data residency",
          "Bilingual EN/FR",
        ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center bg-snow overflow-hidden">
        {/* Radial maple glow top-right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 72% 18%, #fee2e2 0%, transparent 68%)",
          }}
        />

        {/* Faint dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, #1a472a 1.2px, transparent 1.2px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Decorative oversized maple leaf */}
        <svg
          className="absolute -top-16 -right-24 w-[580px] h-[580px] text-maple opacity-[0.05] pointer-events-none select-none"
          viewBox="0 0 100 100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M50 5 L53 18 C60 14 64 14 66 17 C64 20 60 22 62 27 L74 24 C73 28 70 31 72 34 C75 32 79 31 80 34 C78 37 74 39 76 43 L84 43 C82 47 78 50 80 54 C77 53 73 52 72 56 L79 61 C76 64 71 65 71 69 C68 67 65 65 63 68 L65 77 C61 75 58 72 55 74 L50 95 L45 74 C42 72 39 75 35 77 L37 68 C35 65 32 67 29 69 C29 65 24 64 21 61 L28 56 C27 52 23 53 20 54 C22 50 18 47 16 43 L24 43 C26 39 22 37 20 34 C21 31 25 32 28 34 C30 31 27 28 26 24 L38 27 C40 22 36 20 34 17 C36 14 40 14 47 18 Z" />
        </svg>

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-maple-light border border-maple/20 rounded-full text-maple text-sm font-semibold mb-8 animate-fade-in-up stagger-1">
            <Leaf className="w-3.5 h-3.5 flex-shrink-0" />
            {locale === "fr"
              ? "Plateforme de découverte de fournisseurs canadiens"
              : "Canadian Supplier Discovery Platform"}
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-7xl md:text-[5.25rem] font-black tracking-tight text-slate-900 leading-[1.05] mb-3 animate-fade-in-up stagger-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("hero.title")}
          </h1>

          {/* Subtitle in maple */}
          <p
            className="text-3xl sm:text-5xl md:text-[3.5rem] font-bold text-maple tracking-tight leading-none mb-8 animate-fade-in-up stagger-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("hero.subtitle")}
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-3">
            {t("hero.description")}
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6 animate-fade-in-up stagger-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-maple focus:border-transparent text-base"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-4 bg-maple text-white font-bold rounded-2xl hover:bg-maple-dark transition-all shadow-md hover:shadow-xl hover:shadow-maple/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Secondary CTA */}
          <div className="animate-fade-in-up stagger-5">
            <Link
              href={getLocalePath("/search")}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              {t("hero.secondary_cta")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-snow to-transparent pointer-events-none" />
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────── */}
      <section className="bg-forest text-white py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3">
            {[
              {
                value: supplierStatValue,
                icon: Building2,
                sub: supplierStatSub,
              },
              {
                value: sourceStatValue,
                icon: MapPin,
                sub: sourceStatSub,
              },
              {
                value: industryStatValue,
                icon: Globe,
                sub: industryStatSub,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center px-4 py-2 transition-opacity duration-500 ${
                  i < 2 ? "border-r border-white/15" : ""
                } ${statsLoaded ? "opacity-100" : "opacity-75"}`}
              >
                <stat.icon className="w-5 h-5 text-gold mb-3 opacity-75" />
                <div
                  className="text-3xl sm:text-4xl font-black text-white leading-none mb-1.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div className="text-[11px] text-white/45 uppercase tracking-widest">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("features.title")}
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{featureSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURE_LIST.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Hover accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-maple opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />

                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.accent} rounded-2xl mb-5`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                <h3
                  className="text-xl font-bold text-slate-900 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t(feature.titleKey)}
                </h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NAICS Category Browser ────────────────────────────── */}
      <section className="py-24 bg-snow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2
              className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {browseCategoryLabel}
            </h2>
            <p className="text-slate-500 text-lg">{browseCategorySubLabel}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {NAICS_CATEGORIES.map((category) => {
              const Icon = NAICS_ICONS[category.code] ?? Factory;
              return (
                <Link
                  key={category.code}
                  href={`${getLocalePath("/search")}?naics=${category.code}`}
                  className="group flex flex-col items-start gap-3 bg-white border border-slate-100 rounded-2xl p-5 hover:border-maple/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-50 group-hover:bg-maple-light rounded-xl transition-colors flex-shrink-0">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-maple transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {locale === "fr" ? category.nameFr : category.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{category.code}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-maple transition-colors self-end" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Businesses ───────────────────────────────── */}
      {featuredSuppliers.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2
                className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {locale === "fr" ? "Entreprises en vedette" : "Featured Businesses"}
              </h2>
              <p className="text-slate-500 text-lg">
                {locale === "fr"
                  ? "Découvrez quelques-uns des fournisseurs canadiens dans notre base de données."
                  : "A glimpse of Canadian suppliers in our database."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredSuppliers.map((supplier) => {
                const tierStyle =
                  CAPACITY_TIER_STYLES[supplier.capacity_tier ?? ""] ??
                  "bg-slate-50 text-slate-600 border-slate-100";
                return (
                  <Link
                    key={supplier.supplier_id}
                    href={`${getLocalePath("/search")}?query=${encodeURIComponent(supplier.business_name)}`}
                    className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 hover:border-maple/20 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-maple-light rounded-xl flex-shrink-0">
                        <Building2 className="w-5 h-5 text-maple" />
                      </div>
                      {supplier.capacity_tier && (
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tierStyle}`}
                        >
                          {supplier.capacity_tier}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-[15px] font-bold text-slate-900 leading-snug mb-1 group-hover:text-maple transition-colors line-clamp-2"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {supplier.business_name}
                    </h3>

                    {(supplier.city || supplier.province_code) && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>
                          {[supplier.city, supplier.province_code].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    {supplier.brief_info && (
                      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
                        {supplier.brief_info}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-xs text-maple font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {locale === "fr" ? "Voir le profil" : "View profile"}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href={getLocalePath("/search")}
                className="inline-flex items-center gap-2 text-maple font-semibold hover:text-maple-dark transition-colors text-[15px]"
              >
                {locale === "fr"
                  ? "Voir tous les fournisseurs"
                  : "See all suppliers"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ────────────────────────────────────────── */}
      <section className="relative bg-forest overflow-hidden py-24">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Gold radial glow */}
        <div
          className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(212,168,67,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/75 text-sm font-medium mb-8">
            <Leaf className="w-3.5 h-3.5" />
            {locale === "fr" ? "Gratuit — sans inscription requise" : "Free to use — no account required"}
          </div>

          <h2
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {ctaHeadline}
          </h2>

          <p className="text-white/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {ctaSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href={getLocalePath("/search")}
              className="px-8 py-4 bg-maple text-white font-bold rounded-2xl hover:bg-maple-dark transition-all shadow-xl flex items-center gap-2 text-base"
            >
              <Search className="w-5 h-5" />
              {t("hero.cta")}
            </Link>
            <Link
              href={getLocalePath("/map")}
              className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2 text-base"
            >
              <MapPin className="w-5 h-5" />
              {t("nav.map")}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/35 text-sm">
            {[CheckCircle2, Shield, Globe].map((Icon, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {trustLabels[i]}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
