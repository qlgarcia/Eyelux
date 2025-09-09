"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWishlist } from "@/lib/wishlist-store";
import { Product } from "@prisma/client";

interface WishlistItem {
    id: string;
    product: Product;
    createdAt: string;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setWishlist, wishlist } = useWishlist();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data: { items: WishlistItem[] } = await res.json();
            const wishlistProducts = data.items.map((item) => item.product);
            setWishlist(wishlistProducts);
          }
        } catch (error) {
          console.error("Failed to fetch initial wishlist:", error);
        }
      } else if (status === "unauthenticated") {
        // Clear wishlist on sign out
        if (wishlist.length > 0) {
            setWishlist([]);
        }
      }
    };

    fetchWishlist();
  }, [status, setWishlist, wishlist.length]);

  return <>{children}</>;
}
