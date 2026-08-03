import CompanyProfileDetails from "../components/company/CompanyProfileDetails";
import CompanyProfileHeader from "../components/company/CompanyProfileHeader";
import CompanyProfileOverview from "../components/company/CompanyProfileOverview";
import CompanyProfileStats from "../components/company/CompanyProfileStats";
import { recruiterCompanyProfile } from "../constants/company";

export default function RecruiterCompanyPage() {
  const company = recruiterCompanyProfile;

  return (
    <div className="space-y-6">
      <CompanyProfileHeader name={company.name} tagline={company.tagline} />
      <CompanyProfileOverview profile={company} />
      <CompanyProfileStats profile={company} />
      <CompanyProfileDetails profile={company} />
    </div>
  );
}
