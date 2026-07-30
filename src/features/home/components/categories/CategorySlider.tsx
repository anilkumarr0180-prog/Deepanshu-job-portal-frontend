import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import CategoryCard from "./CategoryCard";
import { categories } from "./CategoryData";

const CategorySlider = () => {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={24}
      slidesPerView={5}
      breakpoints={{
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
      }}
    >
      {categories.map((category) => (
        <SwiperSlide key={category.id}>
          <CategoryCard category={category} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CategorySlider;