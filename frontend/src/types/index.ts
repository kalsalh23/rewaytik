export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface BookType {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  price: number
  minPages: number
  maxPages: number
  isActive: boolean
}

export interface GalleryItem {
  id: string
  imageUrl: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  bookType: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  bookTypeId: string
  bookTypeName: string
  status: OrderStatus
  totalAmount: number
  paymentProofUrl?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'pending_review'
  | 'payment_accepted'
  | 'writing'
  | 'story_ready'
  | 'printing'
  | 'printed'
  | 'shipped'
  | 'delivered'
  | 'rejected'

export interface OrderDetail extends Order {
  characterName: string
  age?: number
  nationality: string
  hobbies: string[]
  qualities: string[]
  memories: string[]
  storyType: string
  storyGoal: string
  clientMessage: string
  images: string[]
  shippingAddress: ShippingAddress
  timeline: OrderTimeline[]
}

export interface ShippingAddress {
  fullName: string
  phone: string
  city: string
  district: string
  street: string
  buildingNumber: string
  additionalDetails?: string
}

export interface OrderTimeline {
  status: OrderStatus
  date: string
  note?: string
}

export interface CreateOrderInput {
  bookTypeId: string
  characterName: string
  age?: number
  nationality: string
  hobbies: string[]
  qualities: string[]
  memories: string[]
  storyType: string
  storyGoal: string
  clientMessage: string
  images: string[]
  shippingAddress: ShippingAddress
}

export interface FAQItem {
  id: string
  question: string
  questionAr: string
  answer: string
  answerAr: string
  order: number
}

export interface PricingPlan {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  pages: string
  features: string[]
  featuresAr: string[]
  isPopular: boolean
}

export interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}
