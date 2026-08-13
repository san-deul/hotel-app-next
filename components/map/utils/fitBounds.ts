import { Hotel } from "../types/hotel";

export function fitBounds(
  map:any,
  hotels:Hotel[]
){

  const bounds =
    new window.naver.maps.LatLngBounds();

  hotels.forEach(hotel=>{

    bounds.extend(
      new window.naver.maps.LatLng(
        hotel.lat,
        hotel.lng
      )
    );

  });

  map.fitBounds(bounds);

}