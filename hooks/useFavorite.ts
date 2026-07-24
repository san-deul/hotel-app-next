import { fetchIsFavorite, toggleFavorite } from "@/lib/api/favorite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFavorite(roomNo: number) {
  const queryClient = useQueryClient();

  const favoriteQuery = useQuery({
    queryKey: ["favorite", roomNo],
    queryFn: () => fetchIsFavorite(roomNo),
  });

  const toggleMutation = useMutation({
    mutationFn: () => toggleFavorite(roomNo, favoriteQuery.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", roomNo] });
      queryClient.invalidateQueries({ queryKey: ["favoriteList"] });
    },
  });

  return {
    isFavorite: favoriteQuery.data,
    isLoading: favoriteQuery.isLoading,
    toggleFavorite: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}