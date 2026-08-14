"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import ProductCard from "@/components/ProductCard";

type Product =
  React.ComponentProps<typeof ProductCard>["product"];

type FeaturedSliderProps = {
  products?: Product[];
};

export default function FeaturedSlider({
  products = [],
}: FeaturedSliderProps) {
  return (
    <div className="w-full px-4">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides
        grabCursor
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="
          mx-auto
          w-full
          max-w-[410px]
          pb-8
        "
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              type="tour"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}