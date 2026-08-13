'use client';

import styles from '../MainMap.module.css'
import { Hotel } from '../types/hotel';
import { MapPin } from 'lucide-react';


interface Props {
  hotel: Hotel | null;
  open: boolean;
  onClose: () => void;
  isModalOpenRef: React.MutableRefObject<boolean>;
}

export default function MapModal({
  hotel,
  open,
  onClose,
  isModalOpenRef,
}: Props) {

  if (!open || !hotel) return null;

  return (
    <>
      {/* DIM */}
      <div
        className={styles.dim}
        onClick={onClose}
      />

      {/* MODAL */}
      <div className={styles.store_modal}>

        {/* HEADER */}
        <div className={styles.store_modal_header}>

          <div className={styles.store_modal_title_img}>

            {hotel.modal_sub_img ? (
              <img
                src={hotel.modal_sub_img}
                alt="상점이미지"
              />
            ) : (
              <img
                src="img/map/hotel1.jpg"
                alt="상점이미지"
              />
            )}

          </div>

          <div className={styles.store_modal_title_area}>

            <div className={styles.store_modal_title}>
              {hotel.title}
            </div>

            <div className={styles.store_modal_address}>
              <span>
                <MapPin />
              </span>

              <p>
                {hotel.address}
              </p>

            </div>

          </div>

          <button
            className={styles.modal_close_btn}
            onClick={() => {

              isModalOpenRef.current = true;

              onClose();

              setTimeout(() => {
                isModalOpenRef.current = false;
              }, 300);

            }}
          >

            <img src="/img/map/btn_close.png" />

          </button>

        </div>

        {/* BODY */}

        <div className={styles.modal_scroll_area}>

          <div className={styles.store_modal_img}>

            {hotel.reviews && hotel.reviews.length > 0 ? (
              hotel.reviews.map((rv, idx) => (
                <p key={idx}>{rv}</p>
              ))
            ) : (
              <p>작성된 리뷰가 없습니다.</p>
            )}

          </div>

        </div>

        {/* FOOTER */}

        <div
          className={
            styles.store_modal_footer
          }
        >

          <button
            className={
              styles.store_modal_more
            }
          >

            <a
              href={hotel.naverPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              더 많은 리뷰 보기
            </a>

          </button>

        </div>

      </div>
    </>
  );
}