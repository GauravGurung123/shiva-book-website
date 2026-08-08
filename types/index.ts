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
