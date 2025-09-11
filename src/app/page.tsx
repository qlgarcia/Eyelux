import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    take: 4,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Perfect Look
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Premium eyewear that combines style, comfort, and innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=sunglasses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Sunglasses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sunglasses</CardTitle>
          <CardDescription className="min-h-[40px] flex items-center justify-center">
            Protect your eyes in style with our premium sunglasses collection
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center flex flex-col flex-grow justify-between">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 flex items-center justify-center">
            <span className="text-4xl">🕶️</span>
          </div>
          <Link href="/products?category=sunglasses" prefetch className="mt-auto">
            <Button className="w-full">
              Explore Sunglasses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Eyeglasses</CardTitle>
          <CardDescription className="min-h-[40px] flex items-center justify-center">
            Find the perfect frames to complement your unique style
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center flex flex-col flex-grow justify-between">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-6 flex items-center justify-center">
            <span className="text-4xl">👓</span>
          </div>
          <Link href="/products?category=eyeglasses" prefetch className="mt-auto">
            <Button className="w-full">
              Explore Eyeglasses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Contact Lenses</CardTitle>
          <CardDescription className="min-h-[40px] flex items-center justify-center">
            Experience clear vision with our comfortable contact lenses
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center flex flex-col flex-grow justify-between">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-teal-500 rounded-full mb-6 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <Link href="/products?category=contact-lenses" prefetch className="mt-auto">
            <Button className="w-full">
              Explore Contacts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
</section>


        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link href="/products">
                <Button variant="outline">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose EyeLux?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-muted-foreground">
                  All our products meet the highest quality standards with premium materials and craftsmanship.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                <p className="text-muted-foreground">
                  Free shipping on orders over ₱3000. Get your new eyewear delivered to your door quickly.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">30-Day Returns</h3>
                <p className="text-muted-foreground">
                  Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Look?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of satisfied customers who trust EyeLux for their eyewear needs.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Shopping Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
