import type { RouteObject } from "react-router-dom";

import { DashboardLayout, PublicLayout } from "@/shared/layouts";

import HomePage from "@/features/home/pages/HomePage";
import JobsPage from "@/features/jobs/pages/JobsPage";
import JobDetailsPage from "@/features/jobs/pages/JobDetailsPage";
import RecruitersPage from "@/features/recruiter/pages/RecruitersPage";
import RecruiterDetailsPage from "@/features/recruiter/pages/RecruiterDetailsPage";
import CandidatesPage from "@/features/candidate/pages/CandidatesPage";
import CandidatePublicDetailsPage from "@/features/candidate/pages/CandidatePublicDetailsPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminJobsPage from "@/features/admin/pages/AdminJobsPage";
import AdminRecruitersPage from "@/features/admin/pages/AdminRecruitersPage";
import AdminSettingsPage from "@/features/admin/pages/AdminSettingsPage";
import AdminUsersPage from "@/features/admin/pages/AdminUsersPage";
import CandidateDashboardPage from "@/features/candidate/pages/CandidateDashboardPage";
import CandidateJobsPage from "@/features/candidate/pages/CandidateJobsPage";
import CandidateJobDetailsPage from "@/features/candidate/pages/CandidateJobDetailsPage";
import CandidateSavedJobsPage from "@/features/candidate/pages/CandidateSavedJobsPage";
import CandidateAppliedJobsPage from "@/features/candidate/pages/CandidateAppliedJobsPage";
import CandidateProfilePage from "@/features/candidate/pages/CandidateProfilePage";
import CandidateEditProfilePage from "@/features/candidate/pages/CandidateEditProfilePage";
import CandidateResumePage from "@/features/candidate/pages/CandidateResumePage";
import CandidateSettingsPage from "@/features/candidate/pages/CandidateSettingsPage";
import RecruiterDashboardPage from "@/features/recruiter/pages/RecruiterDashboardPage";
import RecruiterJobsPage from "@/features/recruiter/pages/RecruiterJobsPage";
import RecruiterCreateJobPage from "@/features/recruiter/pages/RecruiterCreateJobPage";
import RecruiterJobDetailsPage from "@/features/recruiter/pages/RecruiterJobDetailsPage";
import RecruiterEditJobPage from "@/features/recruiter/pages/RecruiterEditJobPage";
import RecruiterApplicantsPage from "@/features/recruiter/pages/RecruiterApplicantsPage";
import RecruiterApplicantDetailsPage from "@/features/recruiter/pages/RecruiterApplicantDetailsPage";
import RecruiterCompanyPage from "@/features/recruiter/pages/RecruiterCompanyPage";
import RecruiterCompanyEditPage from "@/features/recruiter/pages/RecruiterCompanyEditPage";
import RecruiterProfilePage from "@/features/recruiter/pages/RecruiterProfilePage";
import RecruiterSettingsPage from "@/features/recruiter/pages/RecruiterSettingsPage";
import RecruiterNotificationsPage from "@/features/recruiter/pages/RecruiterNotificationsPage";
import RecruiterInterviewsPage from "@/features/recruiter/pages/RecruiterInterviewsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { ProtectedRoute } from "@/features/auth/components";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
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
        path: "notifications",
        element: <RecruiterNotificationsPage />,
      },
      {
        path: "interviews",
        element: <RecruiterInterviewsPage />,
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
