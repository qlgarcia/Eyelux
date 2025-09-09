"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useWishlist } from "@/lib/wishlist-store"
import { Product } from "@prisma/client"

export default function WishlistPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { wishlist, setWishlist, removeFromWishlist } = useWishlist()
  const [loading, setLoading] = useState(true)
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }
    if (wishlist.length === 0) {
      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [session, router])

  const fetchWishlist = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/wishlist")
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }
      const data = await response.json()
      const products = data.items.map((item: any) => item.product)
      setWishlist(products)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error("Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      removeFromWishlist(productId)
      toast.success("Removed from wishlist")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      toast.success("Added to cart successfully!")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
    }
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading wishlist...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>

          {wishlist.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding products to your wishlist to save them for later.
                </p>
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all">
                  <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={product.images[0] as string}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-4xl">🕶️</span>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        disabled={removingItems.has(product.id)}
                      >
                        {removingItems.has(product.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">
                        <Link href={`/products/${product.slug}`} className="hover:text-primary">
                          {product.name}
                        </Link>
                      </CardTitle>
                      {product.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">
                          ₱{Number(product.price).toFixed(2)}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₱{Number(product.comparePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {/* <Badge variant="outline">{product.category.name}</Badge> */}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/products/${product.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {product.stock <= 5 && product.stock > 0 && (
                      <p className="text-sm text-orange-600 mt-2">
                        Only {product.stock} left in stock!
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

