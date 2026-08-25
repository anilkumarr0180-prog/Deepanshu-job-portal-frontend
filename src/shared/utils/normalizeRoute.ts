/**
 * Normalizes legacy or misconfigured route links to ensure click navigation never 404s
 * and always keeps the user in their role-appropriate dashboard context.
 */
export const normalizeNotificationLink = (
  link?: string,
  userRole?: string,
  type?: string
): string | null => {
  const role = userRole?.toLowerCase() === "recruiter" ? "recruiter" : "candidate";

  // Type-first normalization for high-fidelity routing
  if (type === "CONNECTION_REQUEST") {
    return `/${role}/networking?tab=invitations`;
  }
  if (type === "CONNECTION_ACCEPTED") {
    return `/${role}/networking?tab=connections`;
  }
  if (
    type === "POST_LIKED" ||
    type === "POST_COMMENTED" ||
    type === "COMMENT_REPLIED" ||
    type === "POST_REPOSTED"
  ) {
    if (link) {
      const postMatch = link.match(/\/posts(?:#post-|\/)([a-f0-9]{24}|\w+)/i);
      if (postMatch && postMatch[1]) {
        return `/${role}/posts/${postMatch[1]}`;
      }
    }
    return `/${role}/networking`;
  }

  if (!link || link.trim() === "") return null;

  const cleanLink = link.trim();

  // Post detail deep links (e.g., /posts#post-123 or /posts/123)
  const postMatch = cleanLink.match(/^\/?posts(?:#post-|\/)([a-f0-9]{24}|\w+)/i);
  if (postMatch && postMatch[1]) {
    return `/${role}/posts/${postMatch[1]}`;
  }

  // Networking tab normalization
  if (cleanLink.includes("/networking") || cleanLink === "/candidate/networking" || cleanLink === "/recruiter/networking") {
    if (cleanLink.includes("tab=invitations") || cleanLink.includes("invitation")) {
      return `/${role}/networking?tab=invitations`;
    }
    if (cleanLink.includes("tab=connections") || cleanLink.includes("connection")) {
      return `/${role}/networking?tab=connections`;
    }
    return `/${role}/networking`;
  }

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
    return role === "recruiter"
      ? "/recruiter/applicants"
      : "/candidate/applied";
  }

  return cleanLink;
};

