"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Eye, ChevronLeft, Minus, Plus, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/lib/cart-store"

interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: {
    name: string
    slug: string
  }
  slug: string
  stock: number
  isFeatured: boolean
  isActive: boolean
  sku?: string
  weight?: number
  dimensions?: string
  reviews: Review[]
  currency: string
}

interface Review {
  id: string
  rating: number
  title?: string
  comment?: string
  createdAt: string
  user: {
    name: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const { increment } = useCartStore()

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (!response.ok) {
        throw new Error("Product not found")
      }
      const data = await response.json()
      setProduct(data.product)
      
      // Check if product is in wishlist
      if (session) {
        checkWishlistStatus(data.product.id)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product")
    } finally {
      setLoading(false)
    }
  }, [params.slug, session])

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug, fetchProduct])

  const checkWishlistStatus = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist/check/${productId}`)
      const data = await response.json()
      setIsInWishlist(data.isInWishlist)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setAddingToCart(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product?.id,
          quantity,
        }),
      })

      if (!response.ok) {
        let errorMsg = "Failed to add to cart"
        try {
          const err = await response.json()
          errorMsg = err?.message || err?.error || `${errorMsg} (${response.status})`
        } catch {}
        throw new Error(errorMsg)
      }
      increment()
      toast.success("Added to cart successfully!")
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast.error(error?.message || "Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setAddingToWishlist(true)
    try {
      const response = await fetch("/api/wishlist", {
        method: isInWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product?.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update wishlist")
      }

      setIsInWishlist(!isInWishlist)
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist")
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    } finally {
      setAddingToWishlist(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(product?.stock || 1, quantity + change))
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/products")}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: product.currency || 'PHP',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🕶️
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-primary" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{product.category.name}</Badge>
                  {product.isFeatured && (
                    <Badge variant="default">Featured</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.length} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <p className="text-green-600 text-sm">
                      In Stock ({product.stock} available)
                    </p>
                  ) : (
                    <p className="text-red-600 text-sm">Out of Stock</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              {(product.sku || product.weight || product.dimensions) && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                  <div className="space-y-2 text-sm">
                    {product.sku && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU:</span>
                        <span>{product.sku}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{product.weight} oz</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span>{product.dimensions}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="quantity">Quantity:</Label>
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 text-center border-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1"
                    >
                      {addingToCart ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Add to Cart
                    </Button>
                    
                    <Button
                      variant={isInWishlist ? "default" : "outline"}
                      onClick={handleWishlistToggle}
                      disabled={addingToWishlist}
                      size="icon"
                    >
                      {addingToWishlist ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Customer Reviews</h2>
              <Button variant="outline" onClick={() => router.push(`/products/${product.slug}/review`)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            </div>

            {product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{review.user.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                      )}
                    </CardHeader>
                    {review.comment && (
                      <CardContent>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to review this product!
                  </p>
                  <Button onClick={() => router.push(`/products/${product.slug}/review`)}>
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
