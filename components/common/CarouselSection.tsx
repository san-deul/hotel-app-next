"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/styles/swiper-mainsection.css";
import Link from "next/link";

export interface CarouselItem {
  id: string | number;
  title: string;
  image: string;
}

interface CarouselSectionProps {
  title: string;
  items: CarouselItem[];
}

export default function CarouselSection({ title, items }: CarouselSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-serif font-bold mb-14 text-center">
        {title}
      </h2>

      <Swiper
        modules={[Navigation]}
        navigation
        loop={true}
        spaceBetween={40}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="relative mainsection-swiper "
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="pb-16  ">
            <div className="relative w-full h-full ">
              <Link href={`/rooms/${item.id}`}>
                {/* 이미지 */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover rounded-lg"
                />

                {/* 아래 정보 박스 (튀어나오는 형태) */}
                <div
                  className="
                absolute left-[10px] bottom-[-50px]
                bg-white w-[85%]
                shadow-md rounded-tr-lg
                p-6
              "
                >
                  <p className="text-xl font-semibold mt-1">{item.title}</p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}