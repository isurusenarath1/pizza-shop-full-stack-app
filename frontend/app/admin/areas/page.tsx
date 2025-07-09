"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Search, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ManageAreasPage() {
  const { toast } = useToast()
  const [areas, setAreas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    deliveryFee: "",
    deliveryTime: "",
    isActive: true,
    postalCodes: "",
  })

  useEffect(() => {
    fetch("http://localhost:5000/api/areas")
      .then((res) => res.json())
      .then(setAreas)
      .catch(() => toast({ title: "Error", description: "Failed to load areas", variant: "destructive" }))
  }, [])

  const refreshAreas = () => {
    fetch("http://localhost:5000/api/areas")
      .then((res) => res.json())
      .then(setAreas)
  }

  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.postalCodes.some((code) => code.includes(searchTerm)),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.deliveryFee || !formData.deliveryTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    const postalCodesArray = formData.postalCodes
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean)
    const areaPayload = {
      ...formData,
      deliveryFee: Number.parseFloat(formData.deliveryFee),
      postalCodes: postalCodesArray,
    }
    try {
      if (editingArea) {
        await fetch(`http://localhost:5000/api/areas/${editingArea._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(areaPayload),
        })
        toast({ title: "Area Updated!", description: `${formData.name} has been updated successfully.` })
      } else {
        await fetch("http://localhost:5000/api/areas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(areaPayload),
        })
        toast({ title: "Area Added!", description: `${formData.name} has been added to delivery areas.` })
      }
      refreshAreas()
      resetForm()
    } catch {
      toast({ title: "Error", description: "Failed to save area", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      deliveryFee: "",
      deliveryTime: "",
      isActive: true,
      postalCodes: "",
    })
    setEditingArea(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (area: any) => {
    setEditingArea(area)
    setFormData({
      name: area.name,
      deliveryFee: area.deliveryFee.toString(),
      deliveryTime: area.deliveryTime,
      isActive: area.isActive,
      postalCodes: area.postalCodes.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/areas/${id}`, { method: "DELETE" })
    toast({ title: "Area Deleted", description: "Delivery area has been removed." })
    refreshAreas()
  }

  const toggleStatus = async (id: string, current: boolean) => {
    const area = areas.find((a: any) => a._id === id)
    if (!area) return
    await fetch(`http://localhost:5000/api/areas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...area, isActive: !current }),
    })
    refreshAreas()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Delivery Areas</h1>
              <p className="text-gray-600">Configure delivery zones, fees, and coverage areas</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Area
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingArea ? "Edit Delivery Area" : "Add New Delivery Area"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Area Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter area name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryFee">Delivery Fee *</Label>
                      <Input
                        id="deliveryFee"
                        type="number"
                        step="0.01"
                        value={formData.deliveryFee}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deliveryFee: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time (mins) *</Label>
                      <Input
                        id="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                        placeholder="25-30"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCodes">Postal Codes</Label>
                    <Input
                      id="postalCodes"
                      value={formData.postalCodes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, postalCodes: e.target.value }))}
                      placeholder="Comma separated postal codes"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter postal codes separated by commas (e.g., 10001, 10002, 10003)
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked as boolean }))}
                    />
                    <Label htmlFor="isActive">Active for delivery</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      {editingArea ? "Update Area" : "Add Area"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Areas</p>
                    <p className="text-3xl font-bold text-gray-800">{areas.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Areas</p>
                    <p className="text-3xl font-bold text-green-600">{areas.filter((a) => a.isActive).length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Delivery Fee</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${(areas.reduce((sum, area) => sum + area.deliveryFee, 0) / areas.length).toFixed(2)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {areas.reduce((sum, area) => sum + area.orderCount, 0)}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search areas or postal codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Areas Table */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Areas ({filteredAreas.length} areas)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Area Name</TableHead>
                      <TableHead>Delivery Fee</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Postal Codes</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAreas.map((area) => (
                      <TableRow key={area._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">{area.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">${area.deliveryFee}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{area.deliveryTime} min</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {area.postalCodes.slice(0, 3).map((code, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {code}
                              </Badge>
                            ))}
                            {area.postalCodes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{area.postalCodes.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{area.orderCount}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(area._id, area.isActive)}
                            className={area.isActive ? "text-green-600" : "text-red-600"}
                          >
                            {area.isActive ? "Active" : "Inactive"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(area)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(area._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
