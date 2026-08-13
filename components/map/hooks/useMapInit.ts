// hooks/useMapInit.ts

import {
  useEffect,
  useRef,
  useState
} from "react";

const MAP_CENTER = {
  lat: 36.3504119,
  lng: 127.3845475,
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

interface UseMapInitProps {
  styledMapRef: React.RefObject<HTMLDivElement | null>;
  normalMapRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  MY_STYLE_ID?: string;
  updateVisibleHotels?: () => void;
}

export function useMapInit({

  styledMapRef,
  normalMapRef,
  isMobile,
  MY_STYLE_ID,
  updateVisibleHotels

}: UseMapInitProps) {

  const styledMap =
    useRef<any>(null);

  const normalMap =
    useRef<any>(null);

  const [isStyledMapReady, setIsStyledMapReady] =
    useState(false);

  const [isMapLoading, setIsMapLoading] =
    useState(true);

  useEffect(() => {

    if (
      !window.naver ||
      !styledMapRef.current ||
      !normalMapRef.current
    ) {
      return;
    }

    // 이미 생성되어 있으면 재생성 방지
    if (
      styledMap.current ||
      normalMap.current
    ) {
      return;
    }

    const naver =
      window.naver;

    const koreaBounds =
      new naver.maps.LatLngBounds(

        new naver.maps.LatLng(
          MAP_BOUNDS.southWest.lat,
          MAP_BOUNDS.southWest.lng
        ),

        new naver.maps.LatLng(
          MAP_BOUNDS.northEast.lat,
          MAP_BOUNDS.northEast.lng
        )

      );

    /* ─────────────────────────────
      styled map option
    ───────────────────────────── */

    const commonOptionsStyled = {

      center: new naver.maps.LatLng(
        MAP_CENTER.lat,
        MAP_CENTER.lng
      ),

      zoom: isMobile ? 6 : 6.5,
      minZoom: isMobile ? 6 : 6.5,
      maxBounds: koreaBounds,
      zoomControl: false,
      scrollWheel: false,

    };

    /* ─────────────────────────────
      normal map option
    ───────────────────────────── */

    const commonOptionsNormal = {

      center: new naver.maps.LatLng(
        MAP_CENTER.lat,
        MAP_CENTER.lng
      ),

      zoom: 9,
      minZoom: 7,
      maxBounds: koreaBounds,
      zoomControl: false,
      zoomControlOptions: {

        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.RIGHT_CENTER,

      },

      scrollWheel: true,

    };

    /* ─────────────────────────────
      styled map
    ───────────────────────────── */

    styledMap.current =
      new naver.maps.Map(
        styledMapRef.current,
        {
          ...commonOptionsStyled,
          gl: true,
          customStyleId: MY_STYLE_ID,
          scrollWheel: false,
          pinchZoom: false,
          draggable: false,
          disableDoubleTapZoom: true,
          disableDoubleClickZoom: true,
          keyboardShortcuts: false,

        }
      );

    /* ─────────────────────────────
      normal map
    ───────────────────────────── */

    normalMap.current =
      new naver.maps.Map(
        normalMapRef.current,
        {

          ...commonOptionsNormal,
          mapTypeId: naver.maps.MapTypeId.TERRAIN,

        }
      );

    /* ─────────────────────────────
      styled map ready
    ───────────────────────────── */

    naver.maps.Event.once(

      styledMap.current,

      "tilesloaded",

      () => {
        setIsStyledMapReady(true);
        setIsMapLoading(false);
      }

    );

    /* ─────────────────────────────
      map idle event
    ───────────────────────────── */

    if (updateVisibleHotels) {

      naver.maps.Event.addListener(
        normalMap.current,
        "idle",
        updateVisibleHotels
      );

    }

    /* ─────────────────────────────
      cleanup
    ───────────────────────────── */

    return () => {

      if (styledMap.current) {
        naver.maps.Event.clearInstanceListeners(styledMap.current);
      }

      if (normalMap.current) {
        naver.maps.Event.clearInstanceListeners(normalMap.current);
      }

      styledMap.current = null;
      normalMap.current = null;

    };

  }, [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      if (normalMap.current) normalMap.current.autoResize();
      if (styledMap.current) styledMap.current.autoResize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {

    styledMap,
    normalMap,
    isStyledMapReady,
    isMapLoading,

  };

}