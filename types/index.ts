export interface Book {
  id: number
  title: string
  author: string
  price: string
  coverImage?: string
  description?: string
  category?: string
  rating?: number
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
