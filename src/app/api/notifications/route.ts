import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get recent orders for notifications
    const recentOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: {
          in: ["PENDING", "PROCESSING", "SHIPPED"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    // Create notifications based on order status
    const notifications = recentOrders.map((order) => {
      let message = ""
      let type = "info"

      switch (order.status) {
        case "PENDING":
          message = `Order #${order.orderNumber} is being processed`
          type = "info"
          break
        case "PROCESSING":
          message = `Order #${order.orderNumber} is being prepared for shipment`
          type = "info"
          break
        case "SHIPPED":
          message = `Order #${order.orderNumber} has been shipped!`
          type = "success"
          break
        default:
          message = `Order #${order.orderNumber} status updated`
          type = "info"
      }

      return {
        id: order.id,
        type,
        message,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        read: false,
      }
    })

    return NextResponse.json({
      notifications,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

