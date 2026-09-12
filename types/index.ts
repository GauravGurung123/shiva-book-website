export interface Book {
  id: number
  title: string
  slug: string
  author: string
  price: string
  coverImage?: string
  description?: string
  category?: string
  rating?: number
  isbn?: string
  discount_price?: number
  final_price?: number
  stock_quantity?: number
  photo_path?: string
  photo_url?: string
  language?: string
  pages?: number
  published_date?: string
  is_active?: boolean
  authors?: Author[]
  categories?: Category[]
  publisher?: Publisher
  publisher_id?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  slug: string
}

export interface FAQ {
  id: number
  question: string
  answer: string
}

export interface Benefit {
  id: number
  title: string
  description: string
  icon: string
}

export interface CartItem extends Book {
  quantity: number
}

export interface NavigationLink {
  label: string
  href: string
}

export interface Author {
  id: string
  name: string
  slug: string
  bio?: string
  photo?: string
}

export interface Publisher {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
}

export interface BlogPost {
  id: string | number
  title: string
  slug: string
  excerpt?: string
  content?: string
  body?: string
  author?: string
  category?: string
  category_id?: number
  date?: string
  thumbnail?: string
  featured_image?: string
  featured_image_url?: string | null
  published_at?: string | null
  is_featured?: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  views_count?: number
  reading_time_minutes?: number
  createdAt?: string
  updatedAt?: string
  creator?: any
  updater?: any
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  country_code_no?: number
  mobile_no?: number
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  message: string
  data: User
  next_step: string
}

export interface RegisterData {
  name: string
  username: string
  email: string
  country_code_no?: number
  mobile_no?: number
  password: string
  password_confirmation: string
}

export interface LoginData {
  email: string
  password: string
}

export interface OAuthTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  icon?: string
  is_active?: boolean
}

export interface Setting {
  id: number
  key: string
  value: string
  type: string
  group: string
  label: string
  description: string | null
  is_public: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SettingResponse {
  data: Setting
  value: string
}

// Cart Types
export interface Cart {
  id: number
  user_id: number | null
  session_id: string
  total: number
  total_quantity: number
  items: CartItem[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  cart_id: number
  book_id: number
  quantity: number
  price: number
  subtotal: number
  book: Book
  created_at: string
  updated_at: string
}

export interface CartResponse {
  data: Cart
}

export interface AddToCartData {
  book_id: number
  quantity: number
}

export interface UpdateQuantityData {
  quantity: number
}

// Order Types
export interface Address {
  id: number
  full_name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone?: string
}

export interface CreateOrderData {
  shipping_address_id: number
  billing_address_id: number
  coupon_id?: number | null
  notes?: string
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  status: string
  total_amount: number
  shipping_address: Address
  billing_address: Address
  coupon_id?: number
  notes?: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  book_id: number
  book: Book
  quantity: number
  price: number
  subtotal: number
}

export interface OrdersResponse {
  data: Order[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

// Payment Types
export type PaymentMethod = 'card' | 'paypal' | 'cod' | 'bank_transfer' | 'iban_transfer' | 'multibanco' | 'mb_way'

export interface CreatePaymentData {
  payment_method: PaymentMethod
  payment_reference: string
}

export interface CreatePaymentWithScreenshotData {
  payment_method: PaymentMethod
  payment_reference: string
  screenshot: File
}

export interface Payment {
  id: number
  order_id: number
  payment_method: PaymentMethod
  payment_reference: string
  amount: number
  status: string
  screenshot_url?: string
  created_at: string
  updated_at: string
}
