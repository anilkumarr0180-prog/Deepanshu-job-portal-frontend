import {
  Briefcase,
  BriefcaseBusiness,
  FileText,
  Headset,
  Landmark,
  Layers,
  Lightbulb,
  Megaphone,
  ShoppingBag,
  UserRound,
} from "lucide-react";

interface TabOption {
  id: string;
  label: string;
  icon: typeof Briefcase;
}

const JOB_TAB_OPTIONS: TabOption[] = [
  { id: "all", label: "All Jobs", icon: Layers },
  { id: "software", label: "Software", icon: Lightbulb },
  { id: "management", label: "Management", icon: BriefcaseBusiness },
  { id: "marketing", label: "Marketing & Sale", icon: Megaphone },
  { id: "finance", label: "Finance", icon: Landmark },
  { id: "hr", label: "Human Resource", icon: UserRound },
  { id: "retail", label: "Retail & Products", icon: ShoppingBag },
  { id: "customer", label: "Customer Help", icon: Headset },
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
    <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5">
      {JOB_TAB_OPTIONS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "border border-[#3C65F5] bg-white text-[#3C65F5] shadow-sm shadow-blue-500/10"
                : "border border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-[#3C65F5]" : "text-slate-400"}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
