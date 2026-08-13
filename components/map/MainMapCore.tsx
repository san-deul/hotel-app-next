'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './MainMap.module.css'
import { useMarkers } from './hooks/useMarkers';
import { fitBounds } from "./utils/fitBounds";
import { getClusterStyle } from './utils/getClusterStyle';
import { useMobile } from './hooks/useMobile';
import RegionFilter from './components/RegionFilter';
import ZoomControl from './components/ZoomControl';
import { useNavermaps } from "react-naver-maps";
import { Hotel } from './types/hotel';

import MapDrawer from './components/MapDrawer';
import MapModal from './components/MapModal';
import { groupHotels } from './utils/groupHotel';
import { useMapInit } from './hooks/useMapInit';
import { HOTELS } from './data/hotel';

declare global {
  interface Window {
    naver: any;
  }
}

/* ──────────────────────────────────────────
  styled : 아무것도 없는지도,
  normal : 등고선 표시된 일반지도
  ────────────────────────────────────────── */
type MapMode = "styled" | "normal";


/* 중심 좌표 */
const MAP_CENTER = {
  lat: 36.3504119,  // 위도
  lng: 127.3845475, //경도
};


const MAP_BOUNDS = {
  southWest: {
    lat: 32.0,
    lng: 124.0,
  },
  northEast: {
    lat: 39.0,
    lng: 132.0,
  },
};
interface MainMapCoreProps {
  hotels: Hotel[];
}




export default function MainMapCore({ hotels }: MainMapCoreProps) {
   const navermaps = useNavermaps()
  const MY_STYLE_ID = process.env.NEXT_PUBLIC_MY_STYLE_ID;

  /* Dom ref */
  const styledMapRef = useRef<HTMLDivElement>(null);
  const normalMapPcRef = useRef<HTMLDivElement>(null);
  const normalMapMobileRef = useRef<HTMLDivElement>(null);

  /* modal 닫힘 직후 drawer 이벤트 충돌 방지용 */
  const isModalOpenRef = useRef(false);

  /* UI State*/
  const [mapMode, setMapMode] = useState<MapMode>("styled");
  const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [snap, setSnap] = useState<number | string | null>(0.32);
  const [snapLevel, setSnapLevel] = useState<number | string | null>(0.8);

  const {
    isMobile,
    isMobileRef
  } = useMobile();

  const isMobileNow = isMobileRef.current;

  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(0);

  useEffect(() => {
    if (!isPopupOpen) return;

    let observer: ResizeObserver;

    const timer = setTimeout(() => {
      if (!drawerRef.current) return;

      observer = new ResizeObserver((entries) => {
        const height = drawerRef.current?.getBoundingClientRect().height ?? 0;

        setDrawerHeight(height);
      });

      observer.observe(drawerRef.current);

      // 최초 높이 바로 세팅
      setDrawerHeight(drawerRef.current.offsetHeight);

    }, 0);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [isPopupOpen]);

  /* ──────────────────────────────────────────
    현재 지도 범위에 보이는 매장 리스트 갱신
    ────────────────────────────────────────── */

  const updateVisibleHotels = () => {
    if (!window.naver || !normalMap.current) return;

    const bounds = normalMap.current.getBounds();
    const visibleStores = HOTELS.filter((hotel) =>
      bounds.hasLatLng(new window.naver.maps.LatLng(hotel.lat, hotel.lng))
    );

    setSelectedHotels(visibleStores);
  };

  const {

    styledMap,
    normalMap,
    isStyledMapReady,
    isMapLoading,

  } = useMapInit({


    styledMapRef,
    normalMapRef:
      isMobile
        ? normalMapMobileRef
        : normalMapPcRef,

    isMobile,
    MY_STYLE_ID,
    updateVisibleHotels,

  });

  /* ──────────────────────────────────────────
    마커 관련 유틸
    ────────────────────────────────────────── */

  const {
    renderMarkers,
    clearMarkers
  } = useMarkers(

    normalMap,

    (hotel) => {

      setSelectedHotel(hotel);
      setIsModalOpen(true);

    }
  )


  const groupedHotels = useMemo(
    () => groupHotels(hotels), [hotels]
  );



  /* ──────────────────────────────────────────
    스타일 지도 위 클러스터 마커 생성
  ────────────────────────────────────────── */
  const createClusterMarkers = () => {
    if (!window.naver || !styledMap.current) return;
    const naver = window.naver;

    Object.entries(groupedHotels).forEach(([region, hotels]) => {

      const avgLat = hotels.reduce((sum, s) => sum + s.lat, 0) / hotels.length;
      const avgLng = hotels.reduce((sum, s) => sum + s.lng, 0) / hotels.length;

      const style = getClusterStyle(hotels.length);

      const marker = new naver.maps.Marker({
        map: styledMap.current,
        position: new naver.maps.LatLng(avgLat, avgLng),
        icon: {
          content: `
                      <div class="${styles.cluster} ${style.className}">
                          ${hotels.length}
                      </div>
                    `,
          size: new naver.maps.Size(style.size, style.size),
          anchor: new naver.maps.Point(style.size / 2, style.size / 2),
        },
      });

      naver.maps.Event.addListener(marker, "click", () => {
        handleClusterClick(hotels);
      });
    });
  };

  /* ──────────────────────────────────────────
    클러스터 클릭 → 일반 지도 모드 전환
    ────────────────────────────────────────── */

  const handleClusterClick = (hotels: Hotel[]) => {
    if (!window.naver || !normalMap.current) return;
    const naver = window.naver;

    setMapMode("normal");
    setSelectedHotels(hotels);
    renderMarkers(hotels);

    if (isMobileRef.current) {
      setSnapLevel("low");
      setIsPopupOpen(true);

      // 지도 리사이즈 후 fitBounds (모바일 drawer 애니메이션 대응)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          naver.maps.Event.trigger(normalMap.current, "resize");
          fitBounds(normalMap.current, hotels);
        });
      });

    } else {
      fitBounds(normalMap.current, hotels);
    }
  };

  useEffect(() => {

    if (
      isPopupOpen &&
      isMobile &&
      normalMap.current
    ) {

      setTimeout(() => {

        window.naver.maps.Event.trigger(
          normalMap.current,
          "resize"
        );
      }, 300);

    }

  }, [isPopupOpen, isMobile]);

  /* ──────────────────────────────────────────
    스타일 지도로 되돌아가기
  ────────────────────────────────────────── */
  const handleBack = () => {
    if (!styledMap.current || !normalMap.current) return;

    styledMap.current.setCenter(
      new window.naver.maps.LatLng(MAP_CENTER.lat, MAP_CENTER.lng)
    );
    styledMap.current.setZoom(isMobileNow ? 6.2 : 6.8);

    setSelectedHotels([]);
    setMapMode("styled");
  };

  useEffect(() => {

    if (isStyledMapReady) {
      createClusterMarkers();
    }

  }, [
    isStyledMapReady, isMobile
  ]);


  return (
    <>

      <section className={`${styles.root} main_section ms6map`} >

      
        {/* 지도 영역 */}

        <div className={styles.inner1}>
            <p className="">원하시는 지역의 지점을 찾아보세요</p>
            <p className="">
              전국 주요 호텔의 지점을 지도에서 확인해보세요.
            </p>
        </div>
        <div className={styles.inner2}>
          <div className={styles.map_content}>

            {/* 좌측 매장 리스트 */}
            {!isMobile && (

              <div className={styles.store_list_area}>
                {mapMode === "styled" ? (
                  <div className={styles.store_list_styled}>
                    <p>
                      지역을 선택하여<br />
                      지도 활성화
                    </p>
                  </div>
                ) : (
                  <div className={styles.store_list_items}>
                    {selectedHotels.map((hotel) => (
                      <div
                        className={styles.store_list_item}
                        key={hotel.title}
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setIsModalOpen(true);
                        }}
                      >
                        <div>
                          <p className={styles.store_title}>
                            {hotel.title}
                          </p>
                          <p className={styles.store_address}>
                            {hotel.address}
                          </p>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 지도 영역 */}
            <div className={styles.map_area}>
              {isMapLoading && (
                <div className={styles.map_loading_overlay} />
              )}

              {/* 스타일 지도 */}
              <div
                className={`${styles.styledMap} ${mapMode === "styled" && isStyledMapReady ? styles.styledMapActive : ""}`}
                ref={styledMapRef}
              />


              {!isMobile && ( // PC  일반지도
                <div
                  ref={normalMapPcRef}
                  className={`
                            ${styles.normalMap}
                            ${mapMode === "normal" ? styles.normalMapActive : ""}
                            ${isModalOpen ? styles.map_disabled : ""}
                          `}
                />
              )}

              {/* ✅ PC 뒤로가기 + 지역 필터 */}
              {!isMobile && mapMode === "normal" && (
                <>
                  <div className={styles.map_btn_area}>
                    <button className={styles.region_close_btn} onClick={handleBack}>
                      <img src="/img/map/btn_close.png" />
                    </button>
                    <ZoomControl
                      map={normalMap}
                    />

                  </div>

                  <RegionFilter
                    groupedHotels={groupedHotels}

                    onSelect={(hotels) => {
                      renderMarkers(hotels);  
                      fitBounds(normalMap.current, hotels);
                      setSelectedHotels(hotels);
                    }}
                  />

                </>
              )}
            </div>
          </div>


        </div>


      </section>

      {isMobile && (
        <>
          {isPopupOpen && (
            <div className={styles.mobile_dim} />
          )}

          <div
            className={`
                        ${styles.mobile_map_modal}
                        ${isPopupOpen
                ? styles.mobile_modal_open
                : styles.mobile_modal_hidden
              }
                        ${isModalOpen ? styles.map_disabled : ""}
                      `}
          >
            {/* 지도 */}
            <div
              ref={normalMapMobileRef}
              className={`
                ${styles.mobile_map}
                ${isModalOpen ? styles.map_disabled : ""}
                `}
            />
            <div className={styles.map_btn_area}>

              {/* 닫기 버튼 */}
              <button
                className={styles.mobile_close}
                onClick={() => {
                  setIsPopupOpen(false);
                  setMapMode("styled");
                }}
              >
                <img src="/img/map/btn_close.png" />
              </button>

              <ZoomControl
                map={normalMap}
              />

            </div>

            <RegionFilter
              groupedHotels={groupedHotels}

              onSelect={(hotels) => {
                renderMarkers(hotels);  
                fitBounds(normalMap.current, hotels);
                setSelectedHotels(hotels);

              }}
            />
          </div>
        </>
      )}


      <MapDrawer
        isPopupOpen={isPopupOpen}
        isMobile={isMobile}
        selectedHotels={selectedHotels}
        snap={snap}
        setSnap={setSnap}
        isModalOpenRef={isModalOpenRef}

        onClose={() => {

          setIsPopupOpen(false);
          setMapMode("styled");

        }}

        onHotelClick={(hotel) => {

          setSelectedHotel(hotel);
          setIsModalOpen(true);

        }}
      />

      <MapModal
        hotel={selectedHotel}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        isModalOpenRef={isModalOpenRef}
      />


    </>
  )
}