import type { Metadata } from "next";
import "./globals.css";
import { LocaleHtmlSync } from "@/components/LocaleHtmlSync";

export const metadata: Metadata = {
  title: "SourceLocal — Find Canadian Suppliers",
  description: "Discover, evaluate, and connect with Canadian suppliers. Replace the default reflex of sourcing internationally with a fast, data-driven path to buying Canadian.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
