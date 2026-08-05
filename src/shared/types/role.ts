export type UserRole = "candidate" | "recruiter" | "admin";

export type DashboardRoute =
  | "/candidate/dashboard"
  | "/recruiter/dashboard"
  | "/admin/dashboard";

export type AllowedRole = UserRole;
