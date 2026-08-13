import { Hotel } from '../types/hotel'

export const HOTELS: Hotel[] = [

  {
    lat: 37.5556785649847, lng: 126.936893755112,
    title: "SD호텔 서울점",
    address: "서울 마포구 월드컵로 240",
    region: "서울",
    reviews:[
      "정말좋아요","너무좋아요"
    ],
   
    naverPlaceUrl: "https://map.naver.com/p/search/SD%ED%98%B8%ED%85%94%20%EC%84%9C%EC%9A%B8%EC%A0%90"
  },
  {
    lat: 37.5251891234872, lng: 127.039582718293,
    title: "SD호텔 강남점",
    address: "서울 강남구 테헤란로 231",
    region: "서울",
    reviews: [
      "정말좋아요 ",
      "너무좋아요",
    ],
    naverPlaceUrl: "https://map.naver.com/p/search/SD%ED%98%B8%ED%85%94%20%EA%B0%95%EB%82%A8%EC%A0%90"
  },
  {
    lat: 35.1595454321698, lng: 129.160507937284,
    title: "SD호텔 부산점",
    address: "부산 해운대구 해운대해변로 296",
    region: "부산",
    reviews: [
      "정말좋아요",
      "너무좋아요",
    ],
    naverPlaceUrl: "https://map.naver.com/p/search/SD%ED%98%B8%ED%85%94%20%EB%B6%80%EC%82%B0%EC%A0%90"
  },
  {
    lat: 36.3703834521987, lng: 127.385781234901,
    title: "SD호텔 대전점",
    address: "대전 서구 둔산로 100",
    region: "대전·충청",
    reviews: [
      "정말좋아요",
      "너무좋아요",
    ],
    naverPlaceUrl: "https://map.naver.com/p/search/SD%ED%98%B8%ED%85%94%20%EB%8C%80%EC%A0%84%EC%A0%90"
  },
];