export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
}

export interface Color {
  _id: string
  name: string
  hex: string
}

export interface Review {
  _id: string
  user: string
  name: string
  rating: number
  comment: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  discountPrice: number
  category: string
  subCategory: string
  images: string[]
  sizes: string[]
  colors: Color[]
  brand: string
  stock: number
  sold: number
  rating: number
  numReviews: number
  reviews: Review[]
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  zipCode: string
  country: string
  phone: string
}

export interface Order {
  _id: string
  user: User
  items: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  subtotal: number
  shippingPrice: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  isPaid: boolean
  paidAt?: string
  isDelivered: boolean
  deliveredAt?: string
  createdAt: string
}
