"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Edit, Save, X, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
}

interface Address {
  id: string
  type: "SHIPPING" | "BILLING"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [addingAddress, setAddingAddress] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  })

  const [addressForm, setAddressForm] = useState({
    type: "SHIPPING" as "SHIPPING" | "BILLING",
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    isDefault: false,
  })

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchProfile()
    fetchAddresses()
  }, [session, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setProfile(data.profile)
      setProfileForm({
        name: data.profile.name || "",
        phone: data.profile.phone || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    }
  }

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses")
      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }
      const data = await response.json()
      setAddresses(data.addresses || [])
    } catch (error) {
      console.error("Error fetching addresses:", error)
      toast.error("Failed to load addresses")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      await fetchProfile()
      setEditingProfile(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleAddressSave = async () => {
    setSaving(true)
    try {
      const url = editingAddress 
        ? `/api/addresses/${editingAddress}`
        : "/api/addresses"
      
      const response = await fetch(url, {
        method: editingAddress ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressForm),
      })

      if (!response.ok) {
        throw new Error("Failed to save address")
      }

      await fetchAddresses()
      setEditingAddress(null)
      setAddingAddress(false)
      resetAddressForm()
      toast.success(editingAddress ? "Address updated successfully" : "Address added successfully")
    } catch (error) {
      console.error("Error saving address:", error)
      toast.error("Failed to save address")
    } finally {
      setSaving(false)
    }
  }

  const handleAddressDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete address")
      }

      await fetchAddresses()
      toast.success("Address deleted successfully")
    } catch (error) {
      console.error("Error deleting address:", error)
      toast.error("Failed to delete address")
    }
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address.id)
    setAddressForm({
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || "",
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault,
    })
  }

  const resetAddressForm = () => {
    setAddressForm({
      type: "SHIPPING",
      firstName: "",
      lastName: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      phone: "",
      isDefault: false,
    })
  }

  const handleCancelEdit = () => {
    setEditingProfile(false)
    setEditingAddress(null)
    setAddingAddress(false)
    resetAddressForm()
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and addresses
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Personal Information</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </div>
                    {!editingProfile ? (
                      <Button variant="outline" onClick={() => setEditingProfile(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleProfileSave} disabled={saving}>
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {editingProfile ? (
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{profile?.name || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.email}</span>
                        <Badge variant="secondary">Primary</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {editingProfile ? (
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{profile?.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Addresses</CardTitle>
                      <CardDescription>
                        Manage your shipping and billing addresses
                      </CardDescription>
                    </div>
                    {!addingAddress && (
                      <Button onClick={() => setAddingAddress(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {addingAddress && (
                    <div className="mb-6 p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                      <AddressForm
                        form={addressForm}
                        setForm={setAddressForm}
                        onSave={handleAddressSave}
                        onCancel={handleCancelEdit}
                        saving={saving}
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="p-4 border rounded-lg">
                        {editingAddress === address.id ? (
                          <AddressForm
                            form={addressForm}
                            setForm={setAddressForm}
                            onSave={handleAddressSave}
                            onCancel={handleCancelEdit}
                            saving={saving}
                          />
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant={address.type === "SHIPPING" ? "default" : "secondary"}>
                                  {address.type}
                                </Badge>
                                {address.isDefault && (
                                  <Badge variant="outline">Default</Badge>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {address.firstName} {address.lastName}
                                  {address.company && ` (${address.company})`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.address1}
                                  {address.address2 && `, ${address.address2}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.country}
                                </p>
                                {address.phone && (
                                  <p className="text-sm text-muted-foreground">
                                    {address.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddressDelete(address.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {addresses.length === 0 && !addingAddress && (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No addresses yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Add your first address to get started.
                        </p>
                        <Button onClick={() => setAddingAddress(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Address
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

interface AddressFormProps {
  form: {
    type: "SHIPPING" | "BILLING"
    firstName: string
    lastName: string
    company: string
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
    isDefault: boolean
  }
  setForm: (form: AddressFormProps['form'] | ((prev: AddressFormProps['form']) => AddressFormProps['form'])) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}

function AddressForm({ form, setForm, onSave, onCancel, saving }: AddressFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Address Type</Label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as "SHIPPING" | "BILLING" }))}
            className="w-full p-2 border rounded-md"
          >
            <option value="SHIPPING">Shipping</option>
            <option value="BILLING">Billing</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isDefault">Default Address</Label>
          <div className="flex items-center space-x-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="isDefault" className="text-sm">Set as default</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          value={form.company}
          onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address1">Address Line 1 *</Label>
        <Input
          id="address1"
          value={form.address1}
          onChange={(e) => setForm((prev) => ({ ...prev, address1: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
        <Input
          id="address2"
          value={form.address2}
          onChange={(e) => setForm((prev) => ({ ...prev, address2: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province *</Label>
          <Input
            id="state"
            value={form.state}
            onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            value={form.postalCode}
            onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <select
            id="country"
            value={form.country}
            onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Address"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  )
}

