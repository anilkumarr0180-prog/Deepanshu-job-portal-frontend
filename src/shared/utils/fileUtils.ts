/**
 * Resolves full URL for files/resumes and triggers direct browser download.
 */
export function getFileUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return "";

  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }

  const baseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5000").replace(/\/api\/?$/, "").replace(/\/$/, "");
  const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  
  return `${baseUrl}${cleanPath}`;
}

export function downloadFile(url?: string, defaultFileName = "resume.pdf") {
  if (!url) return;

  const fullUrl = getFileUrl(url);

  const link = document.createElement("a");
  link.href = fullUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("download", defaultFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
