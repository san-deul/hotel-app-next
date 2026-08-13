import { Hotel } from "../types/hotel";

export function groupHotels(
  stores: Hotel[]
): Record<string, Hotel[]> {

  return stores.reduce(
    (acc, hotel) => {

      if (!acc[hotel.region]) {
        acc[hotel.region] = [];
      }

      acc[hotel.region].push(hotel);

      return acc;

    },
    {} as Record<string, Hotel[]>
  );
}