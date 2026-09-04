import ContactBanner from "../components/ContactBanner";
import OfficeLocationsSection from "../components/OfficeLocationsSection";
import GetInTouchSection from "../components/GetInTouchSection";
import OurTeamSection from "../components/OurTeamSection";
import { NewsletterSection } from "@/features/home/components/newsletter";

const ContactPage = () => {
  return (
    <div className="w-full bg-white dark:bg-[#0B1220] pb-10">
      <ContactBanner />
      <OfficeLocationsSection />
      <GetInTouchSection />
      <OurTeamSection />
      <NewsletterSection />
    </div>
  );
};

export default ContactPage;
