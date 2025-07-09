"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import UserNavbar from "@/components/user-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    fetch(`http://localhost:5000/api/orders/${orderId}`)
      .then((res) => res.json())
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for choosing Mario's Pizza Palace</p>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading order details...</div>
        ) : order ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Order Number:</span>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {order._id}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>
                    Estimated delivery: <strong>{order.estimatedDelivery || "30 min"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-500" />
                  <span>
                    Delivering to: <strong>{order.address}</strong>
                  </span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Your Order:</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div className="flex justify-between" key={idx}>
                        <span>{item.quantity}x {item.name}{item.size ? ` (${item.size})` : ""}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-orange-500">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Contact & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We're here to help! If you have any questions about your order, please don't hesitate to contact us.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Call us</p>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Email us</p>
                      <p className="text-gray-600">support@mariospizza.com</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <Link href="/menu" className="block">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">Order Again</Button>
                  </Link>
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center text-red-500">Order not found.</div>
        )}
        {/* Order Tracking */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Order Placed</span>
              </div>
              <div className="flex-1 h-1 bg-orange-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Preparing</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Out for Delivery</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-sm font-medium text-gray-500">Delivered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
