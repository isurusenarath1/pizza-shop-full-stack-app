"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Search, Star } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function ManagePizzasPage() {
  const { toast } = useToast()
  const [pizzas, setPizzas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPizza, setEditingPizza] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: false,
    isSpicy: false,
    isAvailable: true,
    ingredients: "",
    image: "",
    rating: 0,
    featured: false,
  })

  const categories = ["Classic", "Meat", "Vegetarian", "Specialty"]

  // Fetch pizzas from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/pizzas")
      .then((res) => res.json())
      .then(setPizzas)
      .catch(() => toast({ title: "Error", description: "Failed to load pizzas", variant: "destructive" }))
  }, [])

  const refreshPizzas = () => {
    fetch("http://localhost:5000/api/pizzas")
      .then((res) => res.json())
      .then(setPizzas)
  }

  const filteredPizzas = pizzas.filter((pizza) => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || pizza.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    const ingredientsArray = formData.ingredients
      .split(",")
      .map((ing) => ing.trim())
      .filter(Boolean)
    const pizzaPayload = {
      ...formData,
      price: Number.parseFloat(formData.price),
      ingredients: ingredientsArray,
    }
    try {
      if (editingPizza) {
        await fetch(`http://localhost:5000/api/pizzas/${editingPizza._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pizzaPayload),
        })
        toast({ title: "Pizza Updated!", description: `${formData.name} has been updated successfully.` })
      } else {
        await fetch("http://localhost:5000/api/pizzas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pizzaPayload),
        })
        toast({ title: "Pizza Added!", description: `${formData.name} has been added to the menu.` })
      }
      refreshPizzas()
      resetForm()
    } catch {
      toast({ title: "Error", description: "Failed to save pizza", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      isVeg: false,
      isSpicy: false,
      isAvailable: true,
      ingredients: "",
      image: "",
      rating: 0,
      featured: false,
    })
    setEditingPizza(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (pizza: any) => {
    setEditingPizza(pizza)
    setFormData({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price.toString(),
      category: pizza.category,
      isVeg: pizza.isVeg,
      isSpicy: pizza.isSpicy,
      isAvailable: pizza.isAvailable,
      ingredients: pizza.ingredients.join(", "),
      image: pizza.image,
      rating: pizza.rating,
      featured: pizza.featured || false,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/pizzas/${id}`, { method: "DELETE" })
    toast({ title: "Pizza Deleted", description: "Pizza has been removed from the menu." })
    refreshPizzas()
  }

  const toggleAvailability = async (id: string, current: boolean) => {
    const pizza = pizzas.find((p: any) => p._id === id)
    if (!pizza) return
    await fetch(`http://localhost:5000/api/pizzas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pizza, isAvailable: !current }),
    })
    refreshPizzas()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Pizzas</h1>
              <p className="text-gray-600">Add, edit, and manage your pizza menu</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Pizza
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPizza ? "Edit Pizza" : "Add New Pizza"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Pizza Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter pizza name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Image URL and Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/pizza.jpg"
                      />
                    </div>
                    <div className="flex items-center h-20">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Pizza Preview"
                          width={80}
                          height={80}
                          className="rounded object-cover border"
                          onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg"
                          alt="Pizza Preview"
                          width={80}
                          height={80}
                          className="rounded object-cover border"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter pizza description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ingredients">Ingredients</Label>
                      <Input
                        id="ingredients"
                        value={formData.ingredients}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ingredients: e.target.value }))}
                        placeholder="Comma separated ingredients"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isVeg"
                        checked={formData.isVeg}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isVeg: checked as boolean }))}
                      />
                      <Label htmlFor="isVeg">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isSpicy"
                        checked={formData.isSpicy}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isSpicy: checked as boolean }))}
                      />
                      <Label htmlFor="isSpicy">Spicy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isAvailable"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAvailable: checked as boolean }))}
                      />
                      <Label htmlFor="isAvailable">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked as boolean }))}
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      {editingPizza ? "Update Pizza" : "Add Pizza"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search pizzas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pizzas Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pizza Menu ({filteredPizzas.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pizza</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPizzas.map((pizza) => (
                      <TableRow key={pizza._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={pizza.image || "/placeholder.svg"}
                              alt={pizza.name}
                              width={50}
                              height={50}
                              className="rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{pizza.name}</p>
                              <p className="text-sm text-gray-600 max-w-xs truncate">{pizza.description}</p>
                              <div className="flex gap-1 mt-1">
                                {pizza.isVeg && <Badge className="bg-green-500 hover:bg-green-600 text-xs">Veg</Badge>}
                                {pizza.isSpicy && <Badge className="bg-red-500 hover:bg-red-600 text-xs">Spicy</Badge>}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{pizza.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">${pizza.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{pizza.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleAvailability(pizza._id, pizza.isAvailable)}
                            className={pizza.isAvailable ? "text-green-600" : "text-red-600"}
                          >
                            {pizza.isAvailable ? "Available" : "Unavailable"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(pizza)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(pizza._id)}
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
