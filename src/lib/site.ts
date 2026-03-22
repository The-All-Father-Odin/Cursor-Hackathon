export function getSiteOrigin() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const normalized = value.startsWith("http") ? value : `https://${value}`;
    return normalized.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export function toAbsoluteUrl(path: string) {
  const origin = getSiteOrigin();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalizedPath}`;
}
