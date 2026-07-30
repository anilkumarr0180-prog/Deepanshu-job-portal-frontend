import type { Category } from "./types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = category.icon;

  return (
    <div
      className="
      group
      h-[140px]
      w-[240px]
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-6
      py-5
      transition-all
      duration-300
      hover:border-[#3C65F5]
      hover:shadow-xl
      cursor-pointer
      flex
      items-center
      gap-5
      "
    >
      {/* Icon */}

      <div
        className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-xl
        bg-blue-50
        transition-all
        duration-300
        group-hover:bg-[#3C65F5]
        "
      >
        <Icon
          size={30}
          className="
          text-[#3C65F5]
          transition-all
          duration-300
          group-hover:text-white
          "
        />
      </div>

      {/* Content */}

      <div>
        <h3
          className="
          text-[22px]
          font-semibold
          text-[#05264E]
          transition-colors
          duration-300
          group-hover:text-[#3C65F5]
          "
        >
          {category.title}
        </h3>

        <p className="mt-2 text-[15px] text-gray-500">
          {category.jobs} Jobs Available
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;