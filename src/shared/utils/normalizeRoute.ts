/**
 * Normalizes legacy or misconfigured route links to ensure click navigation never 404s.
 */
export const normalizeNotificationLink = (
  link?: string,
  userRole?: string
): string | null => {
  if (!link || link.trim() === "") return null;

  let cleanLink = link.trim();

  // Normalize recruiter applications link to applicants route
  if (cleanLink === "/recruiter/applications" || cleanLink.startsWith("/recruiter/applications/")) {
    return "/recruiter/applicants";
  }

  // Normalize candidate applications link to candidate/applied route
  if (
    cleanLink === "/candidate/applications" ||
    cleanLink === "/applications" ||
    cleanLink.startsWith("/candidate/applications/")
  ) {
    return "/candidate/applied";
  }

  // Handle generic /applications fallback based on role
  if (cleanLink === "/applications") {
    return userRole?.toLowerCase() === "recruiter"
      ? "/recruiter/applicants"
      : "/candidate/applied";
  }

  return cleanLink;
};
