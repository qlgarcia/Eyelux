import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { Product } from "@prisma/client";
import Image from "next/image";
import { WishlistButton } from "./wishlist-button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg';

  return (
    <Card className="group hover:shadow-lg transition-all">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center relative overflow-hidden">
          <Image
            src={firstImage as string}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          <WishlistButton product={product} className="absolute top-2 right-2 bg-white/80 hover:bg-white" />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </CardTitle>
          {product.isFeatured && <Badge variant="secondary">New</Badge>}
        </div>
        <CardDescription className="truncate">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < (product.ratings ?? 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>
          <span className="text-lg font-bold">₱{product.price.toString()}</span>
        </div>
        <div className="flex space-x-2">
          <Button className="flex-1" size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Link href={`/products/${product.slug}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
