"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CreditCard, MapPin, User } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  })
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
  })
  
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [saveAddresses, setSaveAddresses] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchCart()
  }, [session, router])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()
      setCartItems(data.items || [])
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }, [shippingAddress, sameAsShipping])

  const handleAddressChange = (type: "shipping" | "billing", field: keyof Address, value: string) => {
    if (type === "shipping") {
      setShippingAddress(prev => ({ ...prev, [field]: value }))
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }))
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateShipping = () => {
    return calculateSubtotal() > 3000 ? 0 : 150 // Free shipping over ₱3000
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError("")

    try {
      // Create COD order
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          saveAddresses,
        }),
      })

      if (!response.ok) {
        // Try to parse JSON; if it fails, read text to surface server HTML errors
        let message = "Failed to place order"
        try {
          const data = await response.json()
          message = data?.message || message
        } catch {
          const text = await response.text()
          if (text) message = text
        }
        throw new Error(message)
      }

      const data = await response.json()
      if (!data?.success || !data?.orderId) throw new Error("Invalid response from server")
      router.push(`/orders?success=true&orderId=${data.orderId}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your purchase
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                    <CardDescription>
                      Where should we ship your order?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping-firstName">First Name *</Label>
                        <Input
                          id="shipping-firstName"
                          value={shippingAddress.firstName}
                          onChange={(e) => handleAddressChange("shipping", "firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping-lastName">Last Name *</Label>
                        <Input
                          id="shipping-lastName"
                          value={shippingAddress.lastName}
                          onChange={(e) => handleAddressChange("shipping", "lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-company">Company (Optional)</Label>
                      <Input
                        id="shipping-company"
                        value={shippingAddress.company}
                        onChange={(e) => handleAddressChange("shipping", "company", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-address1">Address Line 1 *</Label>
                      <Input
                        id="shipping-address1"
                        value={shippingAddress.address1}
                        onChange={(e) => handleAddressChange("shipping", "address1", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-address2">Address Line 2 (Optional)</Label>
                      <Input
                        id="shipping-address2"
                        value={shippingAddress.address2}
                        onChange={(e) => handleAddressChange("shipping", "address2", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="shipping-city">City *</Label>
                        <Input
                          id="shipping-city"
                          value={shippingAddress.city}
                          onChange={(e) => handleAddressChange("shipping", "city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping-state">State *</Label>
                        <Input
                          id="shipping-state"
                          value={shippingAddress.state}
                          onChange={(e) => handleAddressChange("shipping", "state", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping-postalCode">Postal Code *</Label>
                        <Input
                          id="shipping-postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => handleAddressChange("shipping", "postalCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping-phone">Phone (Optional)</Label>
                      <Input
                        id="shipping-phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange("shipping", "phone", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Billing Address
                    </CardTitle>
                    <CardDescription>
                      Where should we send the invoice?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="same-as-shipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="same-as-shipping">Same as shipping address</Label>
                    </div>
                    
                    {!sameAsShipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="billing-firstName">First Name *</Label>
                            <Input
                              id="billing-firstName"
                              value={billingAddress.firstName}
                              onChange={(e) => handleAddressChange("billing", "firstName", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billing-lastName">Last Name *</Label>
                            <Input
                              id="billing-lastName"
                              value={billingAddress.lastName}
                              onChange={(e) => handleAddressChange("billing", "lastName", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="billing-company">Company (Optional)</Label>
                          <Input
                            id="billing-company"
                            value={billingAddress.company}
                            onChange={(e) => handleAddressChange("billing", "company", e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="billing-address1">Address Line 1 *</Label>
                          <Input
                            id="billing-address1"
                            value={billingAddress.address1}
                            onChange={(e) => handleAddressChange("billing", "address1", e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="billing-address2">Address Line 2 (Optional)</Label>
                          <Input
                            id="billing-address2"
                            value={billingAddress.address2}
                            onChange={(e) => handleAddressChange("billing", "address2", e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="billing-city">City *</Label>
                            <Input
                              id="billing-city"
                              value={billingAddress.city}
                              onChange={(e) => handleAddressChange("billing", "city", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billing-state">State *</Label>
                            <Input
                              id="billing-state"
                              value={billingAddress.state}
                              onChange={(e) => handleAddressChange("billing", "state", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billing-postalCode">Postal Code *</Label>
                            <Input
                              id="billing-postalCode"
                              value={billingAddress.postalCode}
                              onChange={(e) => handleAddressChange("billing", "postalCode", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="billing-phone">Phone (Optional)</Label>
                          <Input
                            id="billing-phone"
                            type="tel"
                            value={billingAddress.phone}
                            onChange={(e) => handleAddressChange("billing", "phone", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Save Addresses */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="save-addresses"
                        checked={saveAddresses}
                        onCheckedChange={(checked) => setSaveAddresses(checked as boolean)}
                      />
                      <Label htmlFor="save-addresses">Save these addresses for future orders</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span>{formatPrice(calculateTax())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{calculateShipping() === 0 ? "Free" : formatPrice(calculateShipping())}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>{formatPrice(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button type="submit" className="w-full" size="lg" disabled={processing}>
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                    
                    <Link href="/cart">
                      <Button variant="outline" className="w-full">
                        Back to Cart
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
