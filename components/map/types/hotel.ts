export interface Hotel {
  lat: number;
  lng: number;
  title: string;
  address?: string;
  region: string;
  desc?: string;

  modal_sub_img?: string;
  reviews?: string[];
  naverPlaceUrl?: string;
}