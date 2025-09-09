import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Ensure Node.js runtime and disable caching for auth-sensitive route
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // Prefer JWT token for reliability in route handlers
    const secret = process.env.NEXTAUTH_SECRET || "dev-secret-please-change-in-production"
    const hasSecret = !!secret
    const token = await getToken({ req: request as any, secret })
    const session = await getServerSession(authOptions)
    
    // Resolve userId from token first, then session, then email lookup
    let userId = (token?.sub as string | undefined) || (session?.user?.id as string | undefined)
    const userEmail = (token?.email as string | undefined) || (session?.user?.email as string | undefined)
    if (!userId && userEmail) {
      const userRecord = await prisma.user.findUnique({ where: { email: userEmail } })
      userId = userRecord?.id
    }
    if (!userId) {
      console.warn("/api/cart GET unauthorized:", {
        hasToken: !!token,
        hasSession: !!session,
        tokenHasSub: !!token?.sub,
        sessionHasUserId: !!session?.user?.id,
        missingSecret: !hasSecret,
      })
      return NextResponse.json(
        { message: "Unauthorized", details: { hasToken: !!token, hasSession: !!session, missingSecret: !hasSecret } },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ items: cartItems })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Prefer JWT token for reliability in route handlers
    const secret = process.env.NEXTAUTH_SECRET || "dev-secret-please-change-in-production"
    const hasSecret = !!secret
    const token = await getToken({ req: request as any, secret })
    const session = await getServerSession(authOptions)
    
    // Resolve userId from token first, then session, then email lookup
    let userId = (token?.sub as string | undefined) || (session?.user?.id as string | undefined)
    const userEmail = (token?.email as string | undefined) || (session?.user?.email as string | undefined)
    if (!userId && userEmail) {
      const userRecord = await prisma.user.findUnique({ where: { email: userEmail } })
      userId = userRecord?.id
    }
    if (!userId) {
      console.warn("/api/cart POST unauthorized:", {
        hasToken: !!token,
        hasSession: !!session,
        tokenHasSub: !!token?.sub,
        sessionHasUserId: !!session?.user?.id,
        missingSecret: !hasSecret,
      })
      return NextResponse.json(
        { message: "Unauthorized", details: { hasToken: !!token, hasSession: !!session, missingSecret: !hasSecret } },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    // Check if product is already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { message: "Not enough stock available" },
          { status: 400 }
        )
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stock: true,
            },
          },
        },
      })

      return NextResponse.json({ item: updatedCartItem })
    } else {
      // Create new cart item
      if (quantity > product.stock) {
        return NextResponse.json(
          { message: "Not enough stock available" },
          { status: 400 }
        )
      }

      const newCartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              stock: true,
            },
          },
        },
      })

      return NextResponse.json({ item: newCartItem }, { status: 201 })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
