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
    <div className="mt-8 sm:mt-10 mb-10 sm:mb-12 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
      {JOB_TAB_OPTIONS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2.5 rounded-[8px] px-4.5 py-2.5 sm:px-5 sm:py-3 text-[14px] font-bold font-['Plus_Jakarta_Sans',sans-serif] transition-all duration-200 cursor-pointer ${
              isActive
                ? "border border-[#3C65F5] bg-white dark:bg-[#151F32] text-[#3C65F5] shadow-xs"
                : "border border-[#E0E6F7] dark:border-[#2A3850] bg-white dark:bg-[#151F32] text-[#05264E] dark:text-[#F1F5F9] hover:border-[#3C65F5] hover:text-[#3C65F5]"
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#3C65F5]" : "text-[#8592A6]"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
