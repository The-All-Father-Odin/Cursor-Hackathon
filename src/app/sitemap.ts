import type { MetadataRoute } from "next";
import { toAbsoluteUrl } from "@/lib/site";

const routes = [
  { path: "/en", priority: 1, changeFrequency: "weekly" as const },
  { path: "/fr", priority: 1, changeFrequency: "weekly" as const },
  { path: "/en/search", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/fr/search", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/en/map", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/fr/map", priority: 0.8, changeFrequency: "daily" as const },
  { path: "/en/tariffs", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/fr/tariffs", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/en/shortlists", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/fr/shortlists", priority: 0.5, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: toAbsoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
