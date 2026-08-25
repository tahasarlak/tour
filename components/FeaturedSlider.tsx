"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const hasMultipleProducts = products.length > 1;

  return (
    <div className="relative w-full px-4">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides
        grabCursor
        loop={hasMultipleProducts}
        modules={[
          Autoplay,
          Navigation,
          Pagination,
        ]}
        autoplay={
          hasMultipleProducts
            ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        navigation={
          hasMultipleProducts
            ? {
                prevEl: ".featured-prev",
                nextEl: ".featured-next",
              }
            : false
        }
        pagination={{
          clickable: true,
        }}
        className="
          mx-auto
          w-full
          max-w-[410px]
          pb-10
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

      {/* Previous */}

      {hasMultipleProducts && (
        <button
          type="button"
          aria-label="اسلاید قبلی"
          className="
            featured-prev
            absolute
            right-1
            top-1/2
            z-20
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-background/90
            text-foreground
            shadow-md
            backdrop-blur
            transition
            hover:bg-primary
            hover:text-primary-foreground
            active:scale-95
          "
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Next */}

      {hasMultipleProducts && (
        <button
          type="button"
          aria-label="اسلاید بعدی"
          className="
            featured-next
            absolute
            left-1
            top-1/2
            z-20
            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-background/90
            text-foreground
            shadow-md
            backdrop-blur
            transition
            hover:bg-primary
            hover:text-primary-foreground
            active:scale-95
          "
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}