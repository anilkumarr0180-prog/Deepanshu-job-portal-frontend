import { TEAM_MEMBERS } from "../data/teamData";
import TeamMemberCard from "./TeamMemberCard";

export default function OurTeamSection() {
  return (
    <section className="section-box mt-[40px] sm:mt-[60px] lg:mt-[70px] mb-[70px] lg:mb-[90px]">
      <div className="container mx-auto max-w-[1140px] px-[12px]">
        {/* Responsive 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[24px]">
          {TEAM_MEMBERS.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
