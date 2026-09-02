import {
  Briefcase,
  CreditCard,
  FileText,
  Landmark,
  Megaphone,
  Monitor,
  UserRound,
} from "lucide-react";

interface TabOption {
  id: string;
  label: string;
  icon: typeof Briefcase;
}

const JOB_TAB_OPTIONS: TabOption[] = [
  { id: "management", label: "Management", icon: Monitor },
  { id: "marketing", label: "Marketing & Sale", icon: Megaphone },
  { id: "finance", label: "Finance", icon: Landmark },
  { id: "hr", label: "Human Resource", icon: UserRound },
  { id: "retail", label: "Retail & Products", icon: CreditCard },
  { id: "content", label: "Content Writer", icon: FileText },
];

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function CategoryTabs({
  activeTab,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <div className="list-tabs mt-[40px] text-center">
      <ul className="nav nav-tabs inline-flex flex-wrap items-center justify-center">
        {JOB_TAB_OPTIONS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <li key={tab.id} className="inline-block">
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center mx-[5px] mb-[10px] rounded-[8px] px-[17px] py-[13px] text-[12px] font-bold font-['Plus_Jakarta_Sans',sans-serif] leading-[18px] transition-all duration-200 cursor-pointer shadow-[0_2px_4px_-5px_rgb(10,42,105)] ${
                  isActive
                    ? "border border-[#3C65F5] bg-white dark:bg-[#151F32] text-[#3C65F5]"
                    : "border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] text-[#05264E] dark:text-[#F1F5F9] hover:border-[#3C65F5] hover:text-[#3C65F5]"
                }`}
              >
                <Icon className={`mr-[6px] h-[18px] w-[18px] shrink-0 ${isActive ? "text-[#3C65F5]" : "text-[#3C65F5]"}`} />
                <span>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
