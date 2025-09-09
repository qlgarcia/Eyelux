import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { shippingAddress, billingAddress, saveAddresses } = await request.json()

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
    const total = subtotal + tax + shipping

    // No-op: we will create address records inside the order transaction

    // Cash on Delivery: create addresses and order, then clear cart
    const order = await prisma.$transaction(async (tx) => {
      const shippingAddressRecord = await tx.address.create({
        data: {
          userId: session.user.id,
          type: "SHIPPING",
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          company: shippingAddress.company,
          address1: shippingAddress.address1,
          address2: shippingAddress.address2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          isDefault: !!saveAddresses,
        },
      })

      const billingSameAsShipping = JSON.stringify(shippingAddress) === JSON.stringify(billingAddress)
      const billingAddressRecord = billingSameAsShipping
        ? shippingAddressRecord
        : await tx.address.create({
            data: {
              userId: session.user.id,
              type: "BILLING",
              firstName: billingAddress.firstName,
              lastName: billingAddress.lastName,
              company: billingAddress.company,
              address1: billingAddress.address1,
              address2: billingAddress.address2,
              city: billingAddress.city,
              state: billingAddress.state,
              postalCode: billingAddress.postalCode,
              country: billingAddress.country,
              phone: billingAddress.phone,
              isDefault: !!saveAddresses,
            },
          })

      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          orderNumber: `EL-${Math.floor(Date.now() / 1000)}`,
          // status defaults to PENDING
          subtotal,
          tax,
          shipping,
          total,
          shippingAddressId: shippingAddressRecord.id,
          billingAddressId: billingAddressRecord.id,
        },
      })

      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: Number(item.product.price),
            total: Number(item.product.price) * item.quantity,
          },
        })

        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: Math.max(0, (item.product.stock || 0) - item.quantity) },
        })
      }

      await tx.cartItem.deleteMany({ where: { userId: session.user.id } })
      return createdOrder
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { message },
      { status: 500 }
    )
  }
}
