"use client"
import { useEffect, useState } from "react"
import UserNavbar from "@/components/user-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" })
  const { toast } = useToast()

  useEffect(() => {
    // For demo: get user from localStorage
    const stored = localStorage.getItem("pizza_user")
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setEditData({ name: u.name || "", email: u.email || "", phone: u.phone || "" })
      fetch(`http://localhost:5000/api/orders`)
        .then((res) => res.json())
        .then((allOrders) => {
          setOrders(allOrders.filter((o: any) => o.customerEmail === u.email))
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="min-h-screen bg-gray-50"><UserNavbar /><div className="text-center py-20 text-gray-500">Loading...</div></div>
  if (!user) return <div className="min-h-screen bg-gray-50"><UserNavbar /><div className="text-center py-20 text-gray-500">Please <Link href="/login" className="text-orange-500">log in</Link> to view your profile.</div></div>

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled")
  const pastOrders = orders.filter((o) => o.status === "delivered" || o.status === "cancelled")

  const handleEdit = () => {
    setEditMode(true)
    setEditData({ name: user.name || "", email: user.email || "", phone: user.phone || "" })
  }

  const handleCancel = () => {
    setEditMode(false)
    setEditData({ name: user.name || "", email: user.email || "", phone: user.phone || "" })
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })
      if (!res.ok) throw new Error("Failed to update user")
      const updatedUser = await res.json()
      setUser(updatedUser)
      localStorage.setItem("pizza_user", JSON.stringify(updatedUser))
      setEditMode(false)
      toast({ title: "Profile Updated", description: "Your details have been updated." })
    } catch {
      toast({ title: "Update Failed", description: "Could not update your details.", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {editMode ? (
              <>
                <div>
                  <strong>Name:</strong> <Input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} />
                </div>
                <div>
                  <strong>Email:</strong> <Input value={editData.email} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} />
                </div>
                <div>
                  <strong>Phone:</strong> <Input value={editData.phone} onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))} />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-orange-500" onClick={handleSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Phone:</strong> {user.phone}</div>
                <div><strong>Status:</strong> <Badge className={user.status === "active" ? "bg-green-500" : "bg-red-500"}>{user.status}</Badge></div>
                <Button size="sm" className="mt-2 bg-orange-500" onClick={handleEdit}>Edit</Button>
              </>
            )}
          </CardContent>
        </Card>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Active Orders</h2>
        {activeOrders.length === 0 ? <div className="mb-8 text-gray-500">No active orders.</div> : (
          <div className="mb-8 space-y-4">
            {activeOrders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <CardTitle>Order #{order._id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">Status: <Badge>{order.status}</Badge></div>
                  <div className="mb-2">Placed: {order.orderTime}</div>
                  <div className="mb-2">Total: <span className="text-orange-500 font-bold">${order.total.toFixed(2)}</span></div>
                  <div className="mb-2">Items:</div>
                  <ul className="list-disc ml-6">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx}>{item.quantity}x {item.name}</li>
                    ))}
                  </ul>
                  <div className="mt-2"><Link href={`/order-confirmation?orderId=${order._id}`} className="text-orange-500">Track Order</Link></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Order History</h2>
        {pastOrders.length === 0 ? <div className="text-gray-500">No past orders.</div> : (
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <CardTitle>Order #{order._id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">Status: <Badge>{order.status}</Badge></div>
                  <div className="mb-2">Placed: {order.orderTime}</div>
                  <div className="mb-2">Total: <span className="text-orange-500 font-bold">${order.total.toFixed(2)}</span></div>
                  <div className="mb-2">Items:</div>
                  <ul className="list-disc ml-6">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx}>{item.quantity}x {item.name}</li>
                    ))}
                  </ul>
                  <div className="mt-2"><Link href={`/order-confirmation?orderId=${order._id}`} className="text-orange-500">View Details</Link></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 