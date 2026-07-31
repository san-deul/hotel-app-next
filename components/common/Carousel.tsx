"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

// css
import "@/styles/swiper-mainvisual.css";
import Image from "next/image";

interface CarouselImage {
  id: number;
  image_url: string;
}

interface CarouselProps {
  images: CarouselImage[];
}

export default function Carousel({ images }: CarouselProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation, EffectFade]}
      // autoplay={{ delay: 3000, disableOnInteraction: false }}
      effect="fade"
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full h-full visual-swiper"
    >
      {images.map((img) => (
        <SwiperSlide key={img.id}>
          <Image
            src={img.image_url}
            alt={`메인 비주얼 ${img.id}`}
            fill
            sizes="100vw"
            priority={img.id === 1}  // 첫 슬라이드만 우선 로드
            className="object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}