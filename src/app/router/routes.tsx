import { lazy, Suspense, type ComponentType } from "react";
import type { RouteObject } from "react-router-dom";

import { DashboardLayout, PublicLayout } from "@/shared/layouts";
import FullPageLoader from "@/shared/components/FullPageLoader";
import { GuestRoute, ProtectedRoute, RootRedirector } from "@/features/auth/components";

// Helper to wrap lazy-loaded components with Suspense
function withSuspense<T extends object>(Component: ComponentType<T>) {
  return function SuspenseWrapper(props: T) {
    return (
      <Suspense fallback={<FullPageLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Public Pages
const HomePage = withSuspense(lazy(() => import("@/features/home/pages/HomePage")));
const JobsPage = withSuspense(lazy(() => import("@/features/jobs/pages/JobsPage")));
const JobDetailsPage = withSuspense(lazy(() => import("@/features/jobs/pages/JobDetailsPage")));
const RecruitersPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruitersPage")));
const RecruiterDetailsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterDetailsPage")));
const CandidatesPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidatesPage")));
const CandidatePublicDetailsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidatePublicDetailsPage")));
const LoginPage = withSuspense(lazy(() => import("@/features/auth/pages/LoginPage")));
const RegisterPage = withSuspense(lazy(() => import("@/features/auth/pages/RegisterPage")));
const ForgotPasswordPage = withSuspense(lazy(() => import("@/features/auth/pages/ForgotPasswordPage")));
const ResetPasswordPage = withSuspense(lazy(() => import("@/features/auth/pages/ResetPasswordPage")));
const PricingPage = withSuspense(lazy(() => import("@/features/subscription/pages/PricingPage")));
const BillingSettingsPage = withSuspense(lazy(() => import("@/features/subscription/pages/BillingSettingsPage")));
const PostsPage = withSuspense(lazy(() => import("@/features/posts/pages/PostsPage")));
const PostDetailsPage = withSuspense(lazy(() => import("@/features/posts/pages/PostDetailsPage")));
const BlogPage = withSuspense(lazy(() => import("@/features/blog/pages/BlogPage")));
const BlogDetailsPage = withSuspense(lazy(() => import("@/features/blog/pages/BlogDetailsPage")));
const NetworkingPage = withSuspense(lazy(() => import("@/features/posts/pages/NetworkingPage")));

// Admin Pages
const AdminDashboardPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminDashboardPage")));
const AdminFinancePage = withSuspense(lazy(() => import("@/features/admin/pages/AdminFinancePage")));
const AdminJobsPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminJobsPage")));
const AdminBlogsPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminBlogsPage")));
const AdminCreateBlogPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminCreateBlogPage")));
const AdminEditBlogPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminEditBlogPage")));
const AdminMembershipsPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminMembershipsPage")));
const AdminProfilePage = withSuspense(lazy(() => import("@/features/admin/pages/AdminProfilePage")));
const AdminRecruitersPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminRecruitersPage")));
const AdminSettingsPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminSettingsPage")));
const AdminUsersPage = withSuspense(lazy(() => import("@/features/admin/pages/AdminUsersPage")));

// Candidate Pages
const CandidateDashboardPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateDashboardPage")));
const CandidateJobsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateJobsPage")));
const CandidateJobDetailsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateJobDetailsPage")));
const CandidateSavedJobsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateSavedJobsPage")));
const CandidateAppliedJobsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateAppliedJobsPage")));
const CandidateProfilePage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateProfilePage")));
const CandidateEditProfilePage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateEditProfilePage")));
const CandidateResumePage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateResumePage")));
const CandidateSettingsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateSettingsPage")));
const CandidateNotificationsPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateNotificationsPage")));
const CandidateMessagesPage = withSuspense(lazy(() => import("@/features/candidate/pages/CandidateMessagesPage")));

// Recruiter Pages
const RecruiterDashboardPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterDashboardPage")));
const RecruiterJobsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterJobsPage")));
const RecruiterCreateJobPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterCreateJobPage")));
const RecruiterJobDetailsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterJobDetailsPage")));
const RecruiterEditJobPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterEditJobPage")));
const RecruiterApplicantsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterApplicantsPage")));
const RecruiterApplicantDetailsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterApplicantDetailsPage")));
const RecruiterCompanyPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterCompanyPage")));
const RecruiterCompanyEditPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterCompanyEditPage")));
const RecruiterProfilePage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterProfilePage")));
const RecruiterSettingsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterSettingsPage")));
const RecruiterNotificationsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterNotificationsPage")));
const RecruiterInterviewsPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterInterviewsPage")));
const RecruiterMessagesPage = withSuspense(lazy(() => import("@/features/recruiter/pages/RecruiterMessagesPage")));

// Fallback & Error Pages
const NotFoundPage = withSuspense(lazy(() => import("@/pages/NotFoundPage")));
const UnauthorizedPage = withSuspense(lazy(() => import("@/pages/UnauthorizedPage")));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <RootRedirector>
            <HomePage />
          </RootRedirector>
        ),
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "jobs/:id",
        element: <JobDetailsPage />,
      },
      {
        path: "recruiters",
        element: <RecruitersPage />,
      },
      {
        path: "recruiters/:id",
        element: <RecruiterDetailsPage />,
      },
      {
        path: "candidates",
        element: <CandidatesPage />,
      },
      {
        path: "candidates/:id",
        element: <CandidatePublicDetailsPage />,
      },
      {
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "posts",
        element: <PostsPage />,
      },
      {
        path: "posts/:id",
        element: <PostDetailsPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:slug",
        element: <BlogDetailsPage />,
      },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        ),
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"] as const}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        element: <AdminUsersPage />,
      },
      {
        path: "recruiters",
        element: <AdminRecruitersPage />,
      },
      {
        path: "jobs",
        element: <AdminJobsPage />,
      },
      {
        path: "blogs",
        element: <AdminBlogsPage />,
      },
      {
        path: "blogs/create",
        element: <AdminCreateBlogPage />,
      },
      {
        path: "blogs/:id/edit",
        element: <AdminEditBlogPage />,
      },
      {
        path: "finance",
        element: <AdminFinancePage />,
      },
      {
        path: "memberships",
        element: <AdminMembershipsPage />,
      },
      {
        path: "profile",
        element: <AdminProfilePage />,
      },
      {
        path: "settings",
        element: <AdminSettingsPage />,
      },
    ],
  },
  {
    path: "/candidate",
    element: (
      <ProtectedRoute allowedRoles={["candidate"] as const}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <CandidateDashboardPage />,
      },
      {
        path: "jobs",
        element: <CandidateJobsPage />,
      },
      {
        path: "jobs/:id",
        element: <CandidateJobDetailsPage />,
      },
      {
        path: "networking",
        element: <NetworkingPage />,
      },
      {
        path: "posts/:id",
        element: <PostDetailsPage />,
      },
      {
        path: "saved",
        element: <CandidateSavedJobsPage />,
      },
      {
        path: "applied",
        element: <CandidateAppliedJobsPage />,
      },
      {
        path: "profile",
        element: <CandidateProfilePage />,
      },
      {
        path: "profile/edit",
        element: <CandidateEditProfilePage />,
      },
      {
        path: "resume",
        element: <CandidateResumePage />,
      },
      {
        path: "settings",
        element: <CandidateSettingsPage />,
      },
      {
        path: "billing",
        element: <BillingSettingsPage />,
      },
      {
        // Pricing rendered inside the dashboard shell so sidebar stays visible.
        // The sidebar's "View Plans" button links here instead of /pricing.
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "notifications",
        element: <CandidateNotificationsPage />,
      },
      {
        path: "messages",
        element: <CandidateMessagesPage />,
      },
    ],
  },

  {
    path: "/recruiter",
    element: (
      <ProtectedRoute allowedRoles={["recruiter"] as const}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <RecruiterDashboardPage />,
      },
      {
        path: "jobs",
        element: <RecruiterJobsPage />,
      },
      {
        path: "jobs/create",
        element: <RecruiterCreateJobPage />,
      },
      {
        path: "jobs/:id/edit",
        element: <RecruiterEditJobPage />,
      },
      {
        path: "jobs/:id",
        element: <RecruiterJobDetailsPage />,
      },
      {
        path: "applicants",
        element: <RecruiterApplicantsPage />,
      },
      {
        path: "applicants/:id",
        element: <RecruiterApplicantDetailsPage />,
      },
      {
        path: "networking",
        element: <NetworkingPage />,
      },
      {
        path: "posts/:id",
        element: <PostDetailsPage />,
      },
      {
        path: "company",
        element: <RecruiterCompanyPage />,
      },
      {
        path: "company/edit",
        element: <RecruiterCompanyEditPage />,
      },
      {
        path: "profile",
        element: <RecruiterProfilePage />,
      },
      {
        path: "settings",
        element: <RecruiterSettingsPage />,
      },
      {
        path: "billing",
        element: <BillingSettingsPage />,
      },
      {
        // Pricing rendered inside the dashboard shell so sidebar stays visible.
        // The sidebar's "View Plans" button links here instead of /pricing.
        path: "pricing",
        element: <PricingPage />,
      },
      {
        path: "notifications",
        element: <RecruiterNotificationsPage />,
      },
      {
        path: "interviews",
        element: <RecruiterInterviewsPage />,
      },
      {
        path: "messages",
        element: <RecruiterMessagesPage />,
      },
    ],
  },

  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
