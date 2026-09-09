import { TEAM_MEMBERS } from "../data/teamData";
import TeamMemberCard from "./TeamMemberCard";

export default function OurTeamSection() {
  return (
    <section className="section-box mt-[60px] lg:mt-[80px] mb-[70px] lg:mb-[90px]">
      <div className="post-loop-grid">
        <div className="container mx-auto max-w-[1140px] px-[12px]">
          
          {/* Section Header */}
          <div className="text-center mb-[40px] lg:mb-[50px]">
            <h6 className="font-['Plus_Jakarta_Sans',sans-serif] text-[18px] font-bold text-[#A0ABB8] uppercase tracking-[0.5px] mb-[6px]">
              OUR COMPANY
            </h6>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-[36px] font-bold leading-[45px] text-[#05264E] dark:text-[#F1F5F9] mb-[10px]">
              Meet Our Team
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] leading-[24px] text-[#4F5E64] dark:text-slate-400 max-w-[663px] mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ligula ante, dictum non aliquet eu, dapibus ac quam. Morbi vel ante viverra orci tincidunt tempor eu id ipsum. Sed consectetur, risus a blandit tempor, velit magna pellentesque risus, at congue tellus dui quis nisl.
            </p>
          </div>

          {/* Cards Grid: row mt-70 (col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-md-30) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px] mt-[40px] lg:mt-[70px]">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
