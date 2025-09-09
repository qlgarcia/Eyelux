import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  // Stripe disabled: acknowledge webhook endpoint without processing
  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}


