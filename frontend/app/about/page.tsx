import UserNavbar from "@/components/user-navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Award, Users, Pizza, Heart } from "lucide-react"
import Image from "next/image"

const branches = [
  {
    name: "Colombo Branch",
    address: "10 Galle Road, Colombo 03",
    phone: "+94 11 234 5678",
    hours: "Mon-Sun: 11AM-11PM",
  },
  {
    name: "Kandy Branch",
    address: "25 Peradeniya Road, Kandy",
    phone: "+94 81 223 4567",
    hours: "Mon-Sun: 11AM-10PM",
  },
  {
    name: "Galle Branch",
    address: "50 Lighthouse Street, Galle",
    phone: "+94 91 222 3344",
    hours: "Mon-Sun: 12PM-10PM",
  },
]

const stats = [
  { icon: Pizza, label: "Pizzas Served", value: "50,000+" },
  { icon: Users, label: "Happy Customers", value: "15,000+" },
  { icon: Award, label: "Years of Excellence", value: "25+" },
  { icon: MapPin, label: "Locations", value: "3" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Mario's Pizza Palace</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bringing authentic Italian flavors to your neighborhood since 1999
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="https://images.pexels.com/photos/5907901/pexels-photo-5907901.jpeg"
                alt="Mario's Pizza Palace Interior"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded by Mario Rossi in 1999, Mario's Pizza Palace began as a small family restaurant with a simple
                mission: to bring the authentic taste of Italy to our local community. What started as a single location
                has grown into three beloved neighborhood spots, each maintaining the same commitment to quality and
                tradition.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every pizza is crafted using time-honored recipes passed down through generations, featuring the finest
                imported ingredients from Italy. From our hand-tossed dough made fresh daily to our signature tomato
                sauce simmered to perfection, we ensure every bite delivers an authentic Italian experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission & Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Quality First</h3>
                <p className="text-gray-600">
                  We use only the finest ingredients, sourced directly from Italy, to ensure every pizza meets our high
                  standards of excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community Focus</h3>
                <p className="text-gray-600">
                  We're more than just a pizza place - we're part of the community, supporting local events and bringing
                  people together over great food.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Tradition & Innovation</h3>
                <p className="text-gray-600">
                  While we honor traditional Italian recipes, we're always innovating to create new flavors and improve
                  our customer experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Locations</h2>
            <p className="text-xl text-gray-600">Visit us at any of our three Sri Lankan locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {branches.map((branch, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{branch.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                      <p className="text-gray-600">{branch.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <p className="text-gray-600">{branch.hours}</p>
                    </div>
                    <div className="pt-2">
                      <Badge className="bg-orange-500 hover:bg-orange-600">{branch.phone}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
