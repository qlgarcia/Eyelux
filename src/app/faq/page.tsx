"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle, Package, CreditCard, Truck, RotateCcw } from "lucide-react"
import Link from "next/link"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  // Ordering
  {
    question: "How do I place an order?",
    answer: "Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase.",
    category: "ordering"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through Stripe.",
    category: "ordering"
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use industry-standard SSL encryption and Stripe for payment processing. We never store your credit card information on our servers.",
    category: "ordering"
  },
  {
    question: "Do you offer gift cards?",
    answer: "Currently, we don't offer physical gift cards, but you can purchase products as gifts and have them shipped directly to the recipient.",
    category: "ordering"
  },

  // Shipping
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping takes 7-14 business days.",
    category: "shipping"
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries. International shipping rates and delivery times vary by location. Check our shipping page for details.",
    category: "shipping"
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page.",
    category: "shipping"
  },
  {
    question: "What if my package is lost or damaged?",
    answer: "If your package is lost or damaged, please contact our customer service within 30 days of shipment. We'll work with the shipping carrier to resolve the issue.",
    category: "shipping"
  },

  // Returns & Exchanges
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unused items in their original packaging. Returns are free for defective items. Contact our support team to initiate a return.",
    category: "returns"
  },
  {
    question: "How do I return an item?",
    answer: "Contact our customer service team to request a return. We'll provide you with a return label and instructions. Returns must be initiated within 30 days of delivery.",
    category: "returns"
  },
  {
    question: "When will I receive my refund?",
    answer: "Refunds are processed within 5-7 business days after we receive your return. The time to appear on your statement depends on your bank or credit card company.",
    category: "returns"
  },
  {
    question: "Can I exchange an item for a different size or color?",
    answer: "Yes, you can exchange items for different sizes or colors if they're in stock. Contact our customer service team to arrange an exchange.",
    category: "returns"
  },

  // Product Information
  {
    question: "Are your products authentic?",
    answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors. We guarantee the authenticity of every item.",
    category: "products"
  },
  {
    question: "Do you offer prescription lenses?",
    answer: "Currently, we offer frames only. For prescription lenses, we recommend visiting your local optometrist or optical shop.",
    category: "products"
  },
  {
    question: "How do I know what size frame fits me?",
    answer: "Each product page includes detailed measurements. You can also use our virtual try-on feature or visit our size guide for help finding the perfect fit.",
    category: "products"
  },
  {
    question: "Do you offer UV protection?",
    answer: "All our sunglasses offer 100% UV protection. Look for the UV400 label on product pages, which indicates protection against both UVA and UVB rays.",
    category: "products"
  },

  // Account & Technical
  {
    question: "How do I create an account?",
    answer: "Click the 'Sign In' button in the top right corner, then select 'Create Account'. You'll need to provide your name, email, and create a password.",
    category: "account"
  },
  {
    question: "I forgot my password. How do I reset it?",
    answer: "Click 'Sign In' and then 'Forgot Password'. Enter your email address and we'll send you a link to reset your password.",
    category: "account"
  },
  {
    question: "Can I save items to a wishlist?",
    answer: "Yes! Click the heart icon on any product to add it to your wishlist. You can view and manage your wishlist from your account dashboard.",
    category: "account"
  },
  {
    question: "How do I update my account information?",
    answer: "Log into your account and visit the Profile page. You can update your personal information, addresses, and account settings there.",
    category: "account"
  }
]

const categories = [
  { id: "ordering", name: "Ordering & Payment", icon: CreditCard },
  { id: "shipping", name: "Shipping & Delivery", icon: Truck },
  { id: "returns", name: "Returns & Exchanges", icon: RotateCcw },
  { id: "products", name: "Product Information", icon: Package },
  { id: "account", name: "Account & Technical", icon: HelpCircle },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = selectedCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">
              Find answers to common questions about our products, services, and policies.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All Questions
              </Button>
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    {expandedItems.has(index) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {expandedItems.has(index) && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card className="mt-12">
            <CardHeader className="text-center">
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

