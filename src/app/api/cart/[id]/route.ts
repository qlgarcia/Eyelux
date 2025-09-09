import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Valid quantity is required" },
        { status: 400 }
      )
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      )
    }

    // Check stock availability
    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        { message: "Not enough stock available" },
        { status: 400 }
      )
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: id,
      },
      data: {
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

    return NextResponse.json({ item: updatedCartItem })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if cart item exists and belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      )
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ message: "Cart item removed" })
  } catch (error) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
