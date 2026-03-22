const LOCALE_PREFIX_RE = /^\/(en|fr)(?=\/|$)/;

export function buildReturnToPath(path: string, queryString?: string | null) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return queryString ? `${normalizedPath}?${queryString}` : normalizedPath;
}

export function normalizeReturnToPath(returnTo?: string | null) {
  if (!returnTo) return null;

  const trimmed = returnTo.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) return null;

  const normalized = trimmed.replace(LOCALE_PREFIX_RE, "") || "/";
  const [pathname] = normalized.split("?");
  const allowedPrefixes = ["/search", "/map", "/shortlists"];

  if (
    pathname !== "/" &&
    !allowedPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return null;
  }

  return normalized;
}

export function buildSupplierProfilePath(supplierId: string, returnTo?: string | null) {
  const basePath = `/suppliers/${encodeURIComponent(supplierId)}`;
  const normalizedReturnTo = normalizeReturnToPath(returnTo);

  if (!normalizedReturnTo) return basePath;

  const params = new URLSearchParams();
  params.set("returnTo", normalizedReturnTo);
  return `${basePath}?${params.toString()}`;
}
