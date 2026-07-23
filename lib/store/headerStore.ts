import { create } from "zustand";

interface HeaderState {
  open: boolean;
  setOpen: (open: boolean) => void;
  isScrolled: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  isScrolled: false,
  setIsScrolled: (isScrolled) => set({ isScrolled }),
  isHovered: false,
  setIsHovered: (isHovered) => set({ isHovered }),
}));