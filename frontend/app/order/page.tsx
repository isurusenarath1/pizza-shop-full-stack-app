"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import UserNavbar from "@/components/user-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

export default function OrderPage() {
  const searchParams = useSearchParams()
  const pizzaId = searchParams.get("pizza")
  const { toast } = useToast()
  const { addToCart } = useCart()
  const router = useRouter()

  const [pizza, setPizza] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    specialInstructions: "",
  })

  useEffect(() => {
    if (!pizzaId) return
    setLoading(true)
    fetch(`http://localhost:5000/api/pizzas/${pizzaId}`)
      .then((res) => res.json())
      .then((data) => setPizza(data))
      .finally(() => setLoading(false))
  }, [pizzaId])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pizza_user")
      if (stored) {
        const u = JSON.parse(stored)
        setCustomerInfo((prev) => ({
          ...prev,
          name: u.name || prev.name,
          phone: u.phone || prev.phone,
        }))
      }
    }
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50"><UserNavbar /><div className="text-center py-20 text-gray-500">Loading...</div></div>
  if (!pizza) return <div className="min-h-screen bg-gray-50"><UserNavbar /><div className="text-center py-20 text-gray-500">Pizza not found.</div></div>

  const sizes = [
    { name: "Small", multiplier: 0.8, description: "8 inch - Perfect for 1 person" },
    { name: "Medium", multiplier: 1.0, description: "12 inch - Great for 2-3 people" },
    { name: "Large", multiplier: 1.3, description: "16 inch - Ideal for 3-4 people" },
    { name: "Extra Large", multiplier: 1.6, description: "20 inch - Perfect for sharing" },
  ]
  const extras = [
    { name: "Extra Cheese", price: 2.99 },
    { name: "Pepperoni", price: 3.49 },
    { name: "Mushrooms", price: 2.49 },
    { name: "Bell Peppers", price: 2.49 },
    { name: "Olives", price: 2.99 },
    { name: "Onions", price: 1.99 },
    { name: "Jalapeños", price: 2.49 },
    { name: "Bacon", price: 3.99 },
  ]
  const selectedSizeData = sizes.find((size) => size.name === selectedSize) || sizes[1]
  const basePrice = pizza.price * selectedSizeData.multiplier
  const extrasPrice = selectedExtras.reduce((total, extraName) => {
    const extra = extras.find((e) => e.name === extraName)
    return total + (extra?.price || 0)
  }, 0)
  const totalPrice = (basePrice + extrasPrice) * quantity

  const handleExtraToggle = (extraName: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraName) ? prev.filter((name) => name !== extraName) : [...prev, extraName],
    )
  }

  const handleAddToCart = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer information fields.",
        variant: "destructive",
      })
      return
    }
    addToCart({
      id: pizza._id,
      name: pizza.name,
      image: pizza.image,
      size: selectedSize,
      extras: selectedExtras,
      quantity,
      unitPrice: basePrice + extrasPrice,
    })
    toast({
      title: "Added to Cart!",
      description: `${quantity}x ${pizza.name} (${selectedSize}) has been added to your cart.`,
    })
  }

  const handleOrderNow = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer information fields.",
        variant: "destructive",
      })
      return
    }
    let customerEmail = ""
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pizza_user")
      if (stored) customerEmail = JSON.parse(stored).email
    }
    const orderPayload = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      customerEmail,
      address: customerInfo.address,
      specialInstructions: customerInfo.specialInstructions,
      items: [
        {
          name: pizza.name,
          size: selectedSize,
          extras: selectedExtras,
          quantity,
          price: basePrice + extrasPrice,
          image: pizza.image,
        },
      ],
      subtotal: (basePrice + extrasPrice) * quantity,
      deliveryFee: 3.99,
      tax: ((basePrice + extrasPrice) * quantity) * 0.08,
      total: (basePrice + extrasPrice) * quantity + 3.99 + ((basePrice + extrasPrice) * quantity) * 0.08,
      status: "pending",
      paymentMethod: "cash",
      orderTime: new Date().toLocaleString(),
      estimatedDelivery: "30 min",
    }
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) throw new Error("Order failed")
      const data = await res.json()
      toast({ title: "Order Placed!", description: `Order ID: ${data._id}` })
      router.push("/order-confirmation?orderId=" + data._id)
    } catch {
      toast({ title: "Order Failed", description: "Could not place order.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pizza Details */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Image
                    src={pizza.image || "/placeholder.svg"}
                    alt={pizza.name}
                    width={400}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {pizza.isVeg && <Badge className="bg-green-500 hover:bg-green-600">Veg</Badge>}
                    {pizza.isSpicy && <Badge className="bg-red-500 hover:bg-red-600">Spicy</Badge>}
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4">{pizza.name}</h1>
                <p className="text-gray-600 mb-6">{pizza.description}</p>

                {/* Size Selection */}
                <div className="mb-6">
                  <Label className="text-lg font-semibold mb-3 block">Choose Size</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sizes.map((size) => (
                      <div
                        key={size.name}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedSize === size.name
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedSize(size.name)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{size.name}</span>
                          <span className="font-bold text-orange-500">
                            ${(pizza.price * size.multiplier).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{size.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div className="mb-6">
                  <Label className="text-lg font-semibold mb-3 block">Add Extras</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {extras.map((extra) => (
                      <div key={extra.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={extra.name}
                          checked={selectedExtras.includes(extra.name)}
                          onCheckedChange={() => handleExtraToggle(extra.name)}
                        />
                        <Label htmlFor={extra.name} className="flex-1 cursor-pointer">
                          <div className="flex justify-between">
                            <span>{extra.name}</span>
                            <span className="font-medium text-orange-500">+${extra.price}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <Label className="text-lg font-semibold mb-3 block">Quantity</Label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Info & Order Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={customerInfo.specialInstructions}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="Any special instructions for your order"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>
                      {pizza.name} ({selectedSize})
                    </span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  {selectedExtras.map((extraName) => {
                    const extra = extras.find((e) => e.name === extraName)
                    return (
                      <div key={extraName} className="flex justify-between text-sm text-gray-600">
                        <span>+ {extraName}</span>
                        <span>+${extra?.price.toFixed(2)}</span>
                      </div>
                    )
                  })}
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>×{quantity}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-500">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg" onClick={handleOrderNow}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Order Now - ${totalPrice.toFixed(2)}
                  </Button>
                  <Link href="/cart" className="block">
                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                      View Cart & Checkout
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-2">Check Your Order Status</h2>
        <OrderCheckForm />
      </div>
    </div>
  )
}

function OrderCheckForm() {
  const [orderId, setOrderId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setOrder(null)
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`)
      if (!res.ok) throw new Error("Order not found")
      const data = await res.json()
      setOrder(data)
    } catch {
      toast({ title: "Order Not Found", description: "No order with that ID.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={handleCheck} className="flex gap-2 items-end mb-4">
      <Input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter your order ID"
        className="w-64"
      />
      <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600">
        {loading ? "Checking..." : "Check Order"}
      </Button>
      {order && (
        <div className="ml-6 p-4 border rounded bg-white shadow">
          <div className="font-bold mb-1">Order Status: <span className="text-orange-500">{order.status}</span></div>
          <div className="text-sm text-gray-600">Placed: {order.orderTime}</div>
          <div className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</div>
        </div>
      )}
    </form>
  )
}
