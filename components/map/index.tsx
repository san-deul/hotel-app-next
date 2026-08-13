import { NavermapsProvider } from "react-naver-maps";

import { Hotel } from "./types/hotel";
import MainMapCore from "./MainMapCore";
import { Suspense } from "react";

interface MainMapProps {
  hotels: Hotel[];
}


export default function MainMap({ hotels }: MainMapProps) {
  return (
    <NavermapsProvider ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID as string} submodules={["gl"]}>
      <Suspense fallback={<div>지도를 불러오는 중...</div>}>
        <MainMapCore hotels={hotels} />
      </Suspense>
    </NavermapsProvider>
  );
}