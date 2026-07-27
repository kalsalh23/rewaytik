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

export type ManuscriptOrderStatus =
  | 'new'
  | 'under_review'
  | 'awaiting_client'
  | 'designing'
  | 'formatting'
  | 'illustrating'
  | 'final_review'
  | 'ready_to_print'
  | 'completed'
  | 'cancelled'

export type BookLanguage = 'arabic' | 'english' | 'bilingual' | 'other'

export type InternalImagesOption = 'none' | 'upload' | 'designer'

export type PageLayoutOption = 'luxury' | 'classic' | 'modern' | 'simple' | 'designer'

export interface ManuscriptAttachment {
  id: string
  manuscriptOrderId: string
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  createdAt: string
}

export interface ManuscriptOrder {
  id: string
  orderNumber: string
  userId: string
  status: ManuscriptOrderStatus
  bookTitle: string
  authorName: string
  showAuthorOnCover: boolean
  bookSummary: string
  bookLanguage: BookLanguage
  manuscriptFileUrl: string
  manuscriptFileName: string
  manuscriptFileSize: number
  bookCategory: string
  visualStyles: string[]
  internalImagesOption: InternalImagesOption
  pageLayout: PageLayoutOption
  additionalServices: string[]
  additionalNotes: string
  internalNotes: string
  finalFileUrl: string
  estimatedDays: number
  timeline: ManuscriptTimeline[]
  isArchived: boolean
  createdAt: string
  updatedAt: string
  attachments?: ManuscriptAttachment[]
}

export interface ManuscriptTimeline {
  status: ManuscriptOrderStatus
  date: string
  note?: string
}

export interface CreateManuscriptOrderInput {
  book_title: string
  author_name: string
  show_author_on_cover: boolean
  book_summary: string
  book_language: BookLanguage
  manuscript_file_url: string
  manuscript_file_name: string
  manuscript_file_size: number
  book_category: string
  visual_styles: string[]
  internal_images_option: InternalImagesOption
  page_layout: PageLayoutOption
  additional_services: string[]
  additional_notes: string
  status: 'new'
  order_number: string
  timeline: ManuscriptTimeline[]
}
