"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { toast } from "sonner";
import { useWishlist } from "@/lib/wishlist-store";

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export function WishlistButton({ product, className }: WishlistButtonProps) {
  const { data: session } = useSession();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to manage your wishlist.");
      return;
    }

    setIsLoading(true);

    try {
      if (isWishlisted) {
        const res = await fetch(`/api/wishlist`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.ok) {
          removeFromWishlist(product.id);
          toast.success("Removed from wishlist.");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to remove from wishlist.");
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (res.ok) {
          const { item } = await res.json();
          addToWishlist(item.product);
          toast.success("Added to wishlist!");
        } else {
          const errorData = await res.json();
          toast.error(errorData.error || "Failed to add to wishlist.");
        }
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={handleWishlistToggle}
      disabled={isLoading}
    >
      <Heart className={`h-6 w-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
    </Button>
  );
}
