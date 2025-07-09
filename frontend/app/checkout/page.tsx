"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UserNavbar from "@/components/user-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, CreditCard, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items: cartItems, clearCart } = useCart()

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    instructions: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [areas, setAreas] = useState([])

  // Calculate real totals from cart
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const deliveryFee = 3.99 // Could be dynamic per area
  const tax = +(subtotal * 0.08).toFixed(2) // 8% tax
  const total = +(subtotal + deliveryFee + tax).toFixed(2)

  useEffect(() => {
    fetch("http://localhost:5000/api/areas")
      .then((res) => res.json())
      .then(setAreas)

    // Prefill delivery info from logged-in user
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pizza_user")
      if (stored) {
        const user = JSON.parse(stored)
        setCustomerInfo((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }))
      }
    }

    // Listen for login changes (in case user logs in while on page)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "pizza_user" && e.newValue) {
        const user = JSON.parse(e.newValue)
        setCustomerInfo((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }))
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const selectedArea = areas.find((area: any) => area.name === customerInfo.area)

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !customerInfo.area) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    if (!selectedArea?.isActive) {
      toast({
        title: "Area Not Available",
        description: "We don't deliver to this area yet.",
        variant: "destructive",
      })
      return
    }
    if (paymentMethod === "card" && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv)) {
      toast({
        title: "Payment Information Required",
        description: "Please fill in your card details.",
        variant: "destructive",
      })
      return
    }
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some pizzas to your cart.",
        variant: "destructive",
      })
      return
    }
    setIsProcessing(true)
    try {
      const orderPayload = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        address: customerInfo.address,
        area: customerInfo.area,
        items: cartItems.map(item => ({
          name: item.name,
          size: item.size,
          extras: item.extras || [],
          quantity: item.quantity,
          price: item.unitPrice,
          image: item.image,
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        status: "pending",
        paymentMethod,
        specialInstructions: customerInfo.instructions,
      }
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) throw new Error("Order failed")
      clearCart()
      setIsProcessing(false)
      router.push("/order-confirmation")
    } catch (err) {
      setIsProcessing(false)
      toast({
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
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
                  <Label htmlFor="area">Service Area *</Label>
                  <Select
                    value={customerInfo.area}
                    onValueChange={(value) => setCustomerInfo((prev) => ({ ...prev, area: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area: any) => (
                        <SelectItem key={area._id} value={area.name} disabled={!area.isActive}>
                          <div className="flex items-center justify-between w-full">
                            <span>{area.name}</span>
                            <div className="flex items-center gap-2 ml-4">
                              {area.isActive ? (
                                <>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Available
                                  </Badge>
                                  <span className="text-sm text-gray-600">{area.deliveryTime} min</span>
                                </>
                              ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Not Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedArea && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Estimated delivery: {selectedArea.deliveryTime} min</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={customerInfo.instructions}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Any special delivery instructions"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash on Delivery</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo((prev) => ({ ...prev, number: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo((prev) => ({ ...prev, expiry: e.target.value }))}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo((prev) => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter name as on card"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.length === 0 ? (
                    <div className="text-gray-500 text-center">Your cart is empty.</div>
                  ) : (
                    cartItems.map((item, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{item.name}{item.size ? ` (${item.size})` : ''}</span>
                          <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.extras && item.extras.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {item.extras.map((extra, extraIndex) => (
                              <Badge key={extraIndex} variant="outline" className="text-xs">
                                +{extra}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing Order..."
                    ) : (
                      <>
                        <Truck className="h-5 w-5 mr-2" />
                        Place Order - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>

                  {selectedArea && (
                    <p className="text-sm text-gray-600 text-center mt-3">
                      Estimated delivery: {selectedArea.deliveryTime} min
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
