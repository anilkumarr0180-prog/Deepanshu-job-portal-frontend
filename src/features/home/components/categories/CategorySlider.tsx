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
        className="absolute -left-[20px] md:-left-[45px] lg:-left-[55px] xl:-left-[60px] top-[70px] -translate-y-1/2 z-10 flex h-[44px] w-[40px] items-center justify-center rounded-full bg-[#F2F6FD] dark:bg-[#1B2639] text-[#05264E] dark:text-[#F1F5F9] shadow-sm hover:bg-[#3C65F5] hover:text-white dark:hover:bg-[#3C65F5] dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 select-none"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Swiper Container — matching JobBox pb-70 pt-5 */}
      <div className="w-full overflow-hidden pt-[5px] pb-[70px]">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={30}
          slidesPerView={5}
          className="w-full"
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
            <SwiperSlide key={category.id} className="!h-auto flex items-start">
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
        className="absolute -right-[20px] md:-right-[45px] lg:-right-[55px] xl:-right-[60px] top-[70px] -translate-y-1/2 z-10 flex h-[44px] w-[40px] items-center justify-center rounded-full bg-[#F2F6FD] dark:bg-[#1B2639] text-[#05264E] dark:text-[#F1F5F9] shadow-sm hover:bg-[#3C65F5] hover:text-white dark:hover:bg-[#3C65F5] dark:hover:text-white transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 select-none"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}