import { create } from "zustand";
import { useAuthStore } from "./auth";

type FavoritesState = {
  favorites: string[];
  loading: boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  fetchFavorites: () => Promise<void>;
};

// Mock favorites storage
const mockFavorites = new Map<string, Set<string>>();

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,

  toggleFavorite: async (propertyId) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const userFavorites = mockFavorites.get(user.id) || new Set();

    if (userFavorites.has(propertyId)) {
      userFavorites.delete(propertyId);
    } else {
      userFavorites.add(propertyId);
    }

    mockFavorites.set(user.id, userFavorites);
    set({ favorites: Array.from(userFavorites) });
  },

  isFavorite: (propertyId) => get().favorites.includes(propertyId),

  fetchFavorites: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    const userFavorites = mockFavorites.get(user.id) || new Set();
    set({ favorites: Array.from(userFavorites), loading: false });
  },
}));
