import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../MainMap.module.css"
import { FreeMode } from "swiper/modules";
import 'swiper/css';
import { Hotel } from "../types/hotel";

interface Props {

  groupedHotels: Record<string, Hotel[]>;

  onSelect: (
    hotels: Hotel[]
  ) => void;

}

export default function RegionFilter({

  groupedHotels,
  onSelect

}: Props) {

  const regions = Object.entries(groupedHotels);
  const regionCount = regions.length;


  return (

    <div className={styles.region_button_area}>

      <Swiper
        slidesPerView={regionCount <= 4 ? 'auto' : 4.5}
        spaceBetween={10}
        wrapperClass={`swiper-wrapper ${regionCount <= 4 ? styles.justify_center : ''}`}
      >

        {regions.map(([region, hotels]) => (
          <SwiperSlide
            key={region}
            className={styles.region_slide}
          >
            <button
              className={styles.region_button}
              onClick={() => {
                onSelect(hotels);
              }}
            >
              {region}
            </button>
          </SwiperSlide>
        ))}

      </Swiper>

    </div>

  )

}