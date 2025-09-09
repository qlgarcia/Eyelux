import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  comment: z.string().max(1000, "Comment must be less than 1000 characters").optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      )
    }

    // Check if user has purchased this product (optional verification)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        order: {
          userId: user.id,
          status: "DELIVERED",
        },
        productId: validatedData.productId,
      },
    })

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: validatedData.productId,
        rating: validatedData.rating,
        title: validatedData.title,
        comment: validatedData.comment,
        isVerified: !!hasPurchased, // Mark as verified if user has purchased
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      review,
      message: "Review submitted successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    )
  }
}

