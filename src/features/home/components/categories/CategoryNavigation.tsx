import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryNavigation = () => {
  return (
    <>
      <button
        className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-[#EEF2FF]
        text-[#3C65F5]
        transition
        hover:bg-[#3C65F5]
        hover:text-white
        "
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        bg-[#EEF2FF]
        text-[#3C65F5]
        transition
        hover:bg-[#3C65F5]
        hover:text-white
        "
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
};

export default CategoryNavigation;