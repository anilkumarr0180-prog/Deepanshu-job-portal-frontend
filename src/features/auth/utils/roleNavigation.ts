import type { UserRole, AllowedRole } from "@/shared/types/role";

export function normalizeRole(role: unknown): UserRole | null {
  if (typeof role !== "string") {
    return null;
  }

  const normalizedRole = role.trim().toLowerCase();

  if (
    normalizedRole === "candidate" ||
    normalizedRole === "recruiter" ||
    normalizedRole === "admin"
  ) {
    return normalizedRole;
  }

  return null;
}

export function getDashboardRoute(role: unknown): string {
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

export function isAllowedRole(
  role: unknown,
  allowedRoles: readonly AllowedRole[]
): boolean {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole || !allowedRoles.length) {
    return false;
  }
  return allowedRoles.includes(normalizedRole);
}
