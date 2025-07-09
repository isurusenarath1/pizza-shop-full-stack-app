"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Search, Users, Shield, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const roleOptions = [
  { value: "customer", label: "Customer" },
  { value: "staff", label: "Staff" },
  { value: "manager", label: "Manager" },
  { value: "super_admin", label: "Super Admin" },
]

const permissionOptions = [
  { value: "orders", label: "Orders Management" },
  { value: "pizzas", label: "Pizza Management" },
  { value: "areas", label: "Area Management" },
  { value: "users", label: "User Management" },
  { value: "reports", label: "Reports & Analytics" },
]

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("customers")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    status: "active",
    permissions: [] as string[],
  })

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.filter((u: any) => u.role === "customer"))
        setAdmins(data.filter((u: any) => u.role !== "customer"))
      })
      .catch(() => toast({ title: "Error", description: "Failed to load users", variant: "destructive" }))
  }, [])

  const refreshUsers = () => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.filter((u: any) => u.role === "customer"))
        setAdmins(data.filter((u: any) => u.role !== "customer"))
      })
  }

  const currentData = activeTab === "customers" ? users : admins
  const setCurrentData = activeTab === "customers" ? setUsers : setAdmins

  const filteredData = currentData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm)
    const matchesRole = filterRole === "all" || item.role === filterRole
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    const isAdmin = formData.role !== "customer"
    try {
      if (editingUser) {
        await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        toast({ title: "User Updated!", description: `${formData.name} has been updated successfully.` })
      } else {
        await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        toast({ title: "User Added!", description: `${formData.name} has been added successfully.` })
      }
      refreshUsers()
      resetForm()
    } catch {
      toast({ title: "Error", description: "Failed to save user", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active",
      permissions: [],
    })
    setEditingUser(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      permissions: user.permissions || [],
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" })
    toast({ title: "User Deleted", description: "User has been removed successfully." })
    refreshUsers()
  }

  const toggleStatus = async (id: string, current: string) => {
    const allUsers = [...users, ...admins]
    const user = allUsers.find((u: any) => u._id === id)
    if (!user) return
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, status: current === "active" ? "inactive" : "active" }),
    })
    refreshUsers()
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      customer: "bg-blue-500",
      staff: "bg-green-500",
      manager: "bg-purple-500",
      super_admin: "bg-red-500",
    }
    return (
      <Badge className={`${colors[role as keyof typeof colors]} text-white`}>
        {roleOptions.find((r) => r.value === role)?.label}
      </Badge>
    )
  }

  // Calculate stats
  const totalCustomers = users.length
  const activeCustomers = users.filter((u) => u.status === "active").length
  const totalAdmins = admins.length
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalSpent || 0), 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Users & Admins</h1>
              <p className="text-gray-600">Manage customers, staff, and administrators</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.role !== "customer" && (
                    <div>
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {permissionOptions.map((permission) => (
                          <div key={permission.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.value}
                              checked={formData.permissions.includes(permission.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    permissions: [...prev.permissions, permission.value],
                                  }))
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    permissions: prev.permissions.filter((p) => p !== permission.value),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={permission.value} className="text-sm">
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      {editingUser ? "Update User" : "Add User"}
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
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Customers</p>
                    <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Admins</p>
                    <p className="text-3xl font-bold text-purple-600">{totalAdmins}</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-orange-600">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="admins">Admins & Staff</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Customers ({filteredData.length} users)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Last Order</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">Joined: {user.joinDate}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{user.phone}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{user.totalOrders}</TableCell>
                            <TableCell className="font-semibold text-green-600">
                              ${user.totalSpent?.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-sm">{user.lastOrder}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStatus(user.id, user.status)}
                                className={user.status === "active" ? "text-green-600" : "text-red-600"}
                              >
                                {user.status === "active" ? "Active" : "Inactive"}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(user.id)}
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
            </TabsContent>

            <TabsContent value="admins">
              <Card>
                <CardHeader>
                  <CardTitle>Admins & Staff ({filteredData.length} users)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Permissions</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((admin) => (
                          <TableRow key={admin.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{admin.name}</p>
                                <p className="text-sm text-gray-600">Joined: {admin.joinDate}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{admin.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm">{admin.phone}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(admin.role)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {admin.permissions?.includes("all") ? (
                                  <Badge variant="outline" className="text-xs">
                                    All Permissions
                                  </Badge>
                                ) : (
                                  admin.permissions?.slice(0, 2).map((perm, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {permissionOptions.find((p) => p.value === perm)?.label}
                                    </Badge>
                                  ))
                                )}
                                {admin.permissions &&
                                  admin.permissions.length > 2 &&
                                  !admin.permissions.includes("all") && (
                                    <Badge variant="outline" className="text-xs">
                                      +{admin.permissions.length - 2} more
                                    </Badge>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{admin.lastLogin}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStatus(admin.id, admin.status)}
                                className={admin.status === "active" ? "text-green-600" : "text-red-600"}
                              >
                                {admin.status === "active" ? "Active" : "Inactive"}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(admin)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(admin.id)}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
