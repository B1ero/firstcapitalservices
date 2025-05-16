import { create } from "zustand";

type MapState = {
  isMapVisible: boolean;
  toggleMap: () => void;
};

export const useMapStore = create<MapState>((set) => ({
  isMapVisible: true,
  toggleMap: () => set((state) => ({ isMapVisible: !state.isMapVisible })),
}));
