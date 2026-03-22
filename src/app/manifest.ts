import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SourceLocal",
    short_name: "SourceLocal",
    description:
      "Discover, evaluate, and connect with Canadian suppliers through a bilingual search, map, and tariff-awareness workflow.",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: "#fafbfc",
    theme_color: "#d80621",
    lang: "en-CA",
    categories: ["business", "productivity", "navigation"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Search suppliers",
        short_name: "Search",
        url: "/en/search",
      },
      {
        name: "Supplier map",
        short_name: "Map",
        url: "/en/map",
      },
      {
        name: "Tariff calculator",
        short_name: "Tariffs",
        url: "/en/tariffs",
      },
    ],
  };
}
