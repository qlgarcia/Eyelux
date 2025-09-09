import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { WishlistProvider } from "@/components/providers/wishlist-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EyeLux - Premium Eyewear Store",
  description: "Discover the latest trends in eyewear. Shop designer frames, sunglasses, and more.",
  keywords: "eyewear, glasses, sunglasses, designer frames, optical",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <WishlistProvider>
              {children}
            </WishlistProvider>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
