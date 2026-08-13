import { useRef } from "react";
import { Hotel } from "../types/hotel";

/* 추후 수정예정
function createMarkerIcon(naver: any) {

  return {
    content: `
      <div class="custom_marker_wrapper">
        <div class="custom_marker_container">
          <img  src="/img/map/marker.png" />
        </div>
      </div>
    `,
    size: new naver.maps.Size(
      36,
      36
    ),

    anchor: new naver.maps.Point(
      18,
      36
    ),
  };

}
  */

export function useMarkers(

  mapRef: any,

  onMarkerClick: (
    hotel: Hotel
  ) => void

) {

  const markersRef =
    useRef<any[]>([]);

  const clearMarkers = () => {

    markersRef.current
      .forEach(marker => {

        marker.setMap(
          null
        );

      });

    markersRef.current = [];

  };

  const renderMarkers = (
    hotels: Hotel[]
  ) => {

    if (
      !window.naver ||
      !mapRef.current
    ) {
      return;
    }

    const naver =
      window.naver;

    clearMarkers();

    markersRef.current =
      hotels.map(hotel => {

        const marker =
          new naver.maps.Marker({

            map:
              mapRef.current,

            position:
              new naver.maps.LatLng(
                hotel.lat,
                hotel.lng
              ),

            

          });

        naver.maps.Event
          .addListener(

            marker,

            "click",

            () => {

              onMarkerClick(
                hotel
              );

            }

          );

        return marker;

      });

  };

  return {

    renderMarkers,
    clearMarkers

  };

}