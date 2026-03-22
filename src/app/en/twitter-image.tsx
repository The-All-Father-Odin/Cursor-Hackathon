import { createShareImageResponse, shareImageContentType, shareImageSize } from "@/lib/share-image";

export const alt = "SourceLocal — Find Canadian suppliers";
export const size = shareImageSize;
export const contentType = shareImageContentType;

export default function TwitterImage() {
  return createShareImageResponse("en");
}
