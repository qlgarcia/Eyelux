import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const sort = searchParams.get("sort") || "name"
    const price = searchParams.get("price")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      isActive: boolean
      OR?: Array<{
        name?: { contains: string; mode?: string }
        description?: { contains: string; mode?: string }
      }>
      category?: { slug: string }
      price?: { gte?: number; lte?: number }
    } = {
      isActive: true,
    }

    // Search functionality using SQL LIKE
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    // Category filter
    if (category && category !== "all") {
      where.category = {
        slug: category,
      }
    }

    // Price range filter
    if (price && price !== "all") {
      const [min, max] = price.split("-").map(Number)
      if (price === "200+") {
        where.price = {
          gte: 200,
        }
      } else if (max) {
        where.price = {
          gte: min,
          lte: max,
        }
      } else {
        where.price = {
          lte: min,
        }
      }
    }

    // Build order by clause
    const orderBy: {
      name?: "asc" | "desc"
      price?: "asc" | "desc"
      createdAt?: "asc" | "desc"
    } = {}
    switch (sort) {
      case "name":
        orderBy.name = "asc"
        break
      case "name-desc":
        orderBy.name = "desc"
        break
      case "price":
        orderBy.price = "asc"
        break
      case "price-desc":
        orderBy.price = "desc"
        break
      case "newest":
        orderBy.createdAt = "desc"
        break
      default:
        orderBy.name = "asc"
    }

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const {
      name,
      description,
      price,
      comparePrice,
      sku,
      barcode,
      stock,
      weight,
      dimensions,
      images,
      isActive,
      isFeatured,
      categoryId,
      brandId,
      slug,
      metaTitle,
      metaDescription,
      tags,
      relatedProductIDs,
      productType,
      currency,
    } = body

    const created = await prisma.product.create({
      data: {
        name,
        description,
        price,
        comparePrice,
        sku,
        barcode,
        stock,
        weight,
        dimensions,
        images,
        isActive,
        isFeatured,
        categoryId,
        brandId,
        slug,
        metaTitle,
        metaDescription,
        tags,
        relatedProductIDs,
        productType,
        currency,
      },
    })

    return NextResponse.json({ product: created }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    )
  }
}
