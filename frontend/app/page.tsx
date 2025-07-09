"use client"

import UserNavbar from "@/components/user-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

// Add Pizza type
interface Pizza {
  _id: string;
  image?: string;
  name: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  rating?: number;
  description?: string;
  price: number;
  featured?: boolean;
}

export default function HomePage() {
  const [featuredPizzas, setFeaturedPizzas] = useState<Pizza[]>([])
  useEffect(() => {
    fetch("http://localhost:5000/api/pizzas")
      .then((res) => res.json())
      .then((data: Pizza[]) => setFeaturedPizzas(data.filter((pizza) => pizza.featured)))
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Hero Section */}
      <section className="relative h-[600px] pizza-gradient pizza-pattern flex items-center justify-center text-white">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.pexels.com/photos/2180877/pexels-photo-2180877.jpeg"
            alt="Delicious Cheese Pizza"
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">Authentic Italian Pizza</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Made with love, delivered with care. Experience the taste of Italy!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 text-lg px-8 py-3">
                Order Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-500 text-lg px-8 py-3 bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Hot and fresh pizzas delivered in 30 minutes or less</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the finest ingredients from Italy</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
              <p className="text-gray-600">Serving multiple areas across the city</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Pizzas</h2>
            <p className="text-xl text-gray-600">Our most popular and delicious creations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPizzas.map((pizza) => (
              <Card key={pizza._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                  <p className="text-gray-600 mb-4">{pizza.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-500">${pizza.price}</span>
                    <Link href={`/order?pizza=${pizza._id}`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">Order Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent"
              >
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Mario's Pizza</h3>
              <p className="text-gray-300">Authentic Italian pizzas made with love and delivered fresh to your door.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/menu" className="text-gray-300 hover:text-white">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-300">Colombo: +94 11 234 5678</p>
              <p className="text-gray-300">Kandy: +94 81 223 4567</p>
              <p className="text-gray-300">Galle: +94 91 222 3344</p>
              <p className="text-gray-300">Email: info@mariospizza.lk</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hours</h4>
              <p className="text-gray-300">Colombo: Mon-Sun: 11AM-11PM</p>
              <p className="text-gray-300">Kandy: Mon-Sun: 11AM-10PM</p>
              <p className="text-gray-300">Galle: Mon-Sun: 12PM-10PM</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">&copy; 2025 Mario's Pizza Palace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
