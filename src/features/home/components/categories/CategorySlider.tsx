import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import CategoryCard from "./CategoryCard";
import type { Category } from "./types";

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="relative w-full">
      {/* Custom Navigation - Left Arrow */}
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-[#F2F6FD] dark:bg-[#1B2639] text-[#05264E] dark:text-[#F1F5F9] shadow-sm hover:bg-[#3C65F5] hover:text-white dark:hover:bg-[#3C65F5] dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Swiper Container */}
      <div className="w-full overflow-hidden">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={30}
          slidesPerView={5}
          className="w-full py-1"
          breakpoints={{
            320: {
              slidesPerView: 1.3,
              spaceBetween: 16,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} className="!h-auto">
              <CategoryCard category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Navigation - Right Arrow */}
      <button
        type="button"
        aria-label="Next categories"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-[#F2F6FD] dark:bg-[#1B2639] text-[#05264E] dark:text-[#F1F5F9] shadow-sm hover:bg-[#3C65F5] hover:text-white dark:hover:bg-[#3C65F5] dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}