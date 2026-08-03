export type UserRole = "candidate" | "recruiter" | "admin";

export function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== "string") {
    return null;
  }

  const normalizedRole = role.trim().toLowerCase();

  if (normalizedRole === "candidate" || normalizedRole === "recruiter" || normalizedRole === "admin") {
    return normalizedRole;
  }

  return null;
}

export function getPostLoginPath(role: unknown): string {
  switch (normalizeRole(role)) {
    case "admin":
      return "/admin/dashboard";
    case "recruiter":
      return "/recruiter/dashboard";
    case "candidate":
      return "/candidate/dashboard";
    default:
      return "/";
  }
}
