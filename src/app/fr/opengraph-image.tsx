import { createShareImageResponse, shareImageContentType, shareImageSize } from "@/lib/share-image";

export const alt = "SourceLocal — Trouver des fournisseurs canadiens";
export const size = shareImageSize;
export const contentType = shareImageContentType;

export default function OpenGraphImage() {
  return createShareImageResponse("fr");
}
