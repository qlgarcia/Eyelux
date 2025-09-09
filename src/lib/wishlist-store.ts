import { create } from 'zustand';
import { Product } from '@prisma/client';

interface WishlistState {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  setWishlist: (wishlist: Product[]) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  wishlist: [],
  addToWishlist: (product) => set((state) => ({ wishlist: [...state.wishlist, product] })),
  removeFromWishlist: (productId) =>
    set((state) => ({ wishlist: state.wishlist.filter((p) => p.id !== productId) })),
  setWishlist: (wishlist) => set({ wishlist }),
  isInWishlist: (productId) => get().wishlist.some((p) => p.id === productId),
}));
