/**
 * Generates an optimized Cloudinary image URL with dynamic transformation flags.
 * If the provided URL is not a valid Cloudinary URL, returns the original URL.
 *
 * @param url Original image URL
 * @param options Transformation parameters (width, height, crop, quality)
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "limit" | "thumb";
    quality?: "auto" | "good" | "eco" | "low";
  }
): string {
  if (!url || typeof url !== "string") return "";

  // Only apply transformations to Cloudinary hosted image URLs
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // Prevent double-applying transformations
  if (url.includes("/upload/c_") || url.includes("/upload/w_")) {
    return url;
  }

  const { width = 200, height = 200, crop = "fill", quality = "auto" } = options || {};

  const transformSegment = `c_${crop},w_${width},h_${height},g_face,q_${quality},f_auto`;

  // Insert transformation segment right after /upload/
  return url.replace("/upload/", `/upload/${transformSegment}/`);
}
