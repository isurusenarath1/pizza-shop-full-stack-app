"use client"

import { useState, useEffect } from "react"
import UserNavbar from "@/components/user-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"

export default function MenuPage() {
  const [pizzas, setPizzas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSpicy, setFilterSpicy] = useState("all")
  const [filterSize, setFilterSize] = useState("all")
  const { addToCart } = useCart()

  useEffect(() => {
    fetch("http://localhost:5000/api/pizzas")
      .then((res) => res.json())
      .then(setPizzas)
  }, [])

  const filteredPizzas = pizzas.filter((pizza) => {
    if (!pizza.isAvailable) return false
    const matchesSearch =
      pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pizza.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      filterType === "all" || (filterType === "veg" && pizza.isVeg) || (filterType === "non-veg" && !pizza.isVeg)
    const matchesSpicy =
      filterSpicy === "all" || (filterSpicy === "spicy" && pizza.isSpicy) || (filterSpicy === "mild" && !pizza.isSpicy)
    const matchesSize = filterSize === "all" || (pizza.size && pizza.size.toLowerCase() === filterSize.toLowerCase())
    return matchesSearch && matchesType && matchesSpicy && matchesSize
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Pizza Menu</h1>
            <p className="text-xl text-gray-600">Discover our delicious selection of authentic Italian pizzas</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search pizzas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="veg">Vegetarian</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSpicy} onValueChange={setFilterSpicy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Spice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Spice</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="spicy">Spicy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pizza Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPizzas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No pizzas found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPizzas.map((pizza) => (
                <Card key={pizza.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={pizza.image || "/placeholder.svg"}
                      alt={pizza.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {pizza.isVeg && <Badge className="bg-green-500 hover:bg-green-600">Veg</Badge>}
                      {pizza.isSpicy && <Badge className="bg-red-500 hover:bg-red-600">Spicy</Badge>}
                      <Badge variant="secondary">{pizza.size}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{pizza.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{pizza.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{pizza.description}</p>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {pizza.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-500">${pizza.price}</span>
                      <div className="flex gap-2">
                        <Link href={`/order?pizza=${pizza._id}`}>
                          <Button className="bg-orange-500 hover:bg-orange-600">Order Now</Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => addToCart({
                            id: pizza.id,
                            name: pizza.name,
                            image: pizza.image,
                            quantity: 1,
                            unitPrice: pizza.price,
                          })}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
