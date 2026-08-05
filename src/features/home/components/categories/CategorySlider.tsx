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
    <div className="relative flex items-center gap-3">
      {/* Custom Navigation - Left Arrow */}
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => swiperRef.current?.slidePrev()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#3C65F5] transition-all duration-200 hover:bg-[#3C65F5] hover:text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95 disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Swiper Container */}
      <div className="min-w-0 flex-1 overflow-hidden py-4">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={20}
          slidesPerView={5}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 14,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
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
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[#3C65F5] transition-all duration-200 hover:bg-[#3C65F5] hover:text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95 disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}