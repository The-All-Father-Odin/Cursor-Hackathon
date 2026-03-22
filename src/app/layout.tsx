import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleHtmlSync } from "@/components/LocaleHtmlSync";
import { getSiteOrigin } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "SourceLocal — Find Canadian Suppliers",
    template: "%s",
  },
  description: "Discover, evaluate, and connect with Canadian suppliers. Replace the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.",
  applicationName: "SourceLocal",
  alternates: {
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  openGraph: {
    type: "website",
    siteName: "SourceLocal",
    title: "SourceLocal — Find Canadian Suppliers",
    description:
      "Discover, evaluate, and connect with Canadian suppliers. Replace the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.",
    url: "/en",
    locale: "en_CA",
    alternateLocale: ["fr_CA"],
  },
  twitter: {
    card: "summary",
    title: "SourceLocal — Find Canadian Suppliers",
    description:
      "Discover, evaluate, and connect with Canadian suppliers. Replace the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="bg-snow text-slate-900 antialiased">
        <LocaleHtmlSync />
        {children}
      </body>
    </html>
  );
}
