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
