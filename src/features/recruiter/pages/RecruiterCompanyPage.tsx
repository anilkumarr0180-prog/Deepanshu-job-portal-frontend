import CompanyProfileDetails from "../components/company/CompanyProfileDetails";
import CompanyProfileHeader from "../components/company/CompanyProfileHeader";
import CompanyProfileOverview from "../components/company/CompanyProfileOverview";
import CompanyProfileStats from "../components/company/CompanyProfileStats";
import { recruiterCompanyProfile } from "../constants/company";
import { useCompany } from "../hooks/useCompany";
import { useRecruiterDashboard } from "../hooks/useRecruiterDashboard";
import type { RecruiterCompanyProfile } from "../types";

export default function RecruiterCompanyPage() {
  const { data: apiCompany, isLoading: isCompanyLoading, isError } = useCompany();
  const { data: dashboard, isLoading: isDashboardLoading } = useRecruiterDashboard();

  if (isCompanyLoading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      </div>
    );
  }

  const socialLinksArray: string[] = apiCompany?.socialLinks
    ? [
        apiCompany.socialLinks.linkedin,
        apiCompany.socialLinks.twitter,
        apiCompany.socialLinks.github,
        apiCompany.socialLinks.website,
      ].filter((link): link is string => Boolean(link))
    : recruiterCompanyProfile.socialLinks;

  const dynamicStats = [
    { label: "Total Jobs", value: String(dashboard?.totalJobs ?? 0) },
    { label: "Active Jobs", value: String(dashboard?.activeJobs ?? 0) },
    { label: "Total Applicants", value: String(dashboard?.totalApplications ?? 0) },
    { label: "Total Hires", value: String(dashboard?.closedJobs ?? 0) },
  ];

  const company: RecruiterCompanyProfile = apiCompany
    ? {
        id: apiCompany._id || "my-company",
        name: apiCompany.name || recruiterCompanyProfile.name,
        logo: apiCompany.logo,
        tagline:
          apiCompany.tagline ||
          `${apiCompany.name || recruiterCompanyProfile.name} - Official Company Profile`,
        overview:
          apiCompany.description ||
          apiCompany.overview ||
          recruiterCompanyProfile.overview,
        about:
          apiCompany.description ||
          apiCompany.about ||
          recruiterCompanyProfile.about,
        industry: apiCompany.industry || recruiterCompanyProfile.industry,
        website: apiCompany.website || recruiterCompanyProfile.website,
        email: apiCompany.email || recruiterCompanyProfile.email,
        phone: apiCompany.phone || recruiterCompanyProfile.phone,
        location:
          apiCompany.location ||
          apiCompany.address ||
          [apiCompany.city, apiCompany.state, apiCompany.country]
            .filter(Boolean)
            .join(", ") ||
          recruiterCompanyProfile.location,
        size:
          apiCompany.companySize ||
          apiCompany.size ||
          recruiterCompanyProfile.size,
        foundedYear: String(
          apiCompany.foundedYear || recruiterCompanyProfile.foundedYear
        ),
        socialLinks: socialLinksArray,
        stats: dynamicStats,
      }
    : {
        ...recruiterCompanyProfile,
        stats: dynamicStats,
      };

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
          Showing default company template. Create or edit your company profile to sync with live backend data.
        </div>
      )}
      <CompanyProfileHeader name={company.name} tagline={company.tagline} logo={company.logo} />
      <CompanyProfileOverview profile={company} />
      <CompanyProfileStats profile={company} isLoading={isDashboardLoading} />
      <CompanyProfileDetails profile={company} />
    </div>
  );
}
