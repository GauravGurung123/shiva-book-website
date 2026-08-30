import type { Book } from '~/types'

interface ApiResponse<T> {
  data: T
  message?: string
}

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const useBooks = () => {
  const { get } = useApi()
  
  // Fetch paginated books
  const fetchBooks = async (page: number = 1, perPage: number = 25, sortBy: string = 'id', descending: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        rowsPerPage: perPage.toString(),
        sortBy,
        descending: descending.toString()
      })
      
      const response = await get<any>(`/books?${params.toString()}`)
      
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Book interface
        const books = response.data.map((book: any) => ({
          id: book.id?.toString() || book.slug,
          title: book.title,
          author: book.author || 'Unknown Author',
          price: book.final_price || book.price || '€0.00',
          description: book.description,
          coverImage: book.photo_url || book.photo_path || book.cover_image || book.coverImage,
          slug: book.slug
        }))
        
        return {
          books,
          pagination: {
            currentPage: response.meta?.current_page || 1,
            lastPage: response.meta?.last_page || 1,
            perPage: response.meta?.per_page || 25,
            total: response.meta?.total || 0
          }
        }
      }
    } catch (err) {
      console.error('Error fetching books:', err)
      throw err
    }
    
    return {
      books: [] as Book[],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 25,
        total: 0
      }
    }
  }
  
  // Fetch featured books
  const fetchFeaturedBooks = async () => {
    try {
      const response = await get<any>('/ref-books/featured')
      
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Book interface
        return response.data.map((book: any) => ({
          id: book.id?.toString() || book.slug,
          title: book.title,
          author: book.authors?.map((a: any) => a.name).join(', ') || book.author || 'Unknown Author',
          price: book.final_price || book.price || '€0.00',
          description: book.description,
          coverImage: book.photo_url || book.photo_path || book.cover_image || book.coverImage,
          slug: book.slug
        }))
      }
    } catch (err) {
      console.error('Error fetching featured books:', err)
    }
    
    return [] as Book[]
  }
  
  // Fetch newest arrivals
  const fetchNewestArrivals = async () => {
    try {
      const response = await get<any>('/ref-books/newest-arrivals')
      
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Book interface
        return response.data.map((book: any) => ({
          id: book.id?.toString() || book.slug,
          title: book.title,
          author: book.authors?.map((a: any) => a.name).join(', ') || book.author || 'Unknown Author',
          price: book.final_price || book.price || '€0.00',
          description: book.description,
          coverImage: book.photo_url || book.photo_path || book.cover_image || book.coverImage,
          slug: book.slug
        }))
      }
    } catch (err) {
      console.error('Error fetching newest arrivals:', err)
    }
    
    return [] as Book[]
  }

  // Fetch single book by slug
  const fetchBookBySlug = async (slug: string) => {
    try {
      console.log('Fetching book from API:', `/books/${slug}`)
      const response = await get<any>(`/books/${slug}`)
      console.log('API response:', response)
      
      if (response.data) {
        const book = response.data
        // Map API response to Book interface
        return {
          id: book.id,
          title: book.title,
          slug: book.slug,
          isbn: book.isbn,
          description: book.description,
          publisher_id: book.publisher_id,
          publisher: book.publisher,
          authors: book.authors,
          categories: book.categories,
          price: book.price,
          discount_price: book.discount_price,
          final_price: book.final_price,
          stock_quantity: book.stock_quantity,
          photo_path: book.photo_path,
          photo_url: book.photo_url,
          coverImage: book.photo_url || book.photo_path,
          language: book.language,
          pages: book.pages,
          published_date: book.published_date,
          is_active: book.is_active,
          author: book.authors?.map((a: any) => a.name).join(', ') || 'Unknown Author'
        }
      }
    } catch (err) {
      console.error('Error fetching book by slug:', err)
      throw err
    }
    
    return null
  }

  // Fetch books by category slug
  const fetchBooksByCategory = async (
    categorySlug: string,
    page: number = 1,
    perPage: number = 12,
    sortBy: string = 'newest',
    sortOrder: string = 'desc',
    filters: {
      minPrice?: number
      maxPrice?: number
      discountedOnly?: boolean
      inStockOnly?: boolean
    } = {}
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      })
      
      if (filters.minPrice !== undefined) params.append('min_price', filters.minPrice.toString())
      if (filters.maxPrice !== undefined) params.append('max_price', filters.maxPrice.toString())
      if (filters.discountedOnly !== undefined) params.append('discounted_only', filters.discountedOnly.toString())
      if (filters.inStockOnly !== undefined) params.append('in_stock_only', filters.inStockOnly.toString())
      
      const response = await get<any>(`/categories/${categorySlug}?${params.toString()}`)
      console.log(response.data)
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Book interface
        const books = response.data.map((book: any) => ({
          id: book.id?.toString() || book.slug,
          title: book.title,
          author: book.authors?.map((a: any) => a.name).join(', ') || book.author || 'Unknown Author',
          price: book.final_price || book.price || '€0.00',
          description: book.description,
          coverImage: book.photo_url || book.photo_path || book.cover_image || book.coverImage,
          slug: book.slug
        }))
        
        return {
          books,
          category: response.data.category,
          pagination: {
            currentPage: response.data.meta?.current_page || response.data.current_page || 1,
            lastPage: response.data.meta?.last_page || response.data.last_page || 1,
            perPage: response.data.meta?.per_page || response.data.per_page || 12,
            total: response.data.meta?.total || response.data.total || 0
          }
        }
      }
    } catch (err) {
      console.error('Error fetching books by category:', err)
      throw err
    }
    
    return {
      books: [] as Book[],
      category: null,
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 12,
        total: 0
      }
    }
  }
  
  // Legacy method for backward compatibility (fetches featured and new arrivals)
  const { data, pending: loading, error } = useAsyncData('books', async () => {
    try {
      const [featured, newArrivals] = await Promise.all([
        fetchFeaturedBooks(),
        fetchNewestArrivals()
      ])
      
      return {
        featured,
        newArrivals
      }
    } catch (err) {
      console.error('Error fetching books:', err)
      
      // Fallback to mock data if API fails
      return {
        featured: [
          { id: 1, title: 'Palpasa Cafe', author: 'Narayan Wagle', price: '€12.99' },
          { id: 2, title: 'Summer Love', author: 'Subin Bhattarai', price: '€10.99' },
          { id: 3, title: 'Karnali Blues', author: 'Buddhisagar', price: '€14.99' },
          { id: 4, title: 'Shirishko Phool', author: 'Parijat', price: '€9.99' },
          { id: 5, title: 'Seto Dharati', author: 'Amar Neupane', price: '€11.99' }
        ],
        newArrivals: [
          { id: 6, title: 'Yogmaya', author: 'Neelam Karki', price: '€15.99' },
          { id: 7, title: 'Lilati', author: 'Sanjeev Uprety', price: '€13.99' },
          { id: 8, title: 'Chiso Ashtray', author: 'Sushil Koirala', price: '€12.99' },
          { id: 9, title: 'Radha', author: 'Krishna Dharabasi', price: '€11.99' },
          { id: 10, title: 'Phoolko Aankhama', author: 'Parijat', price: '€10.99' }
        ]
      }
    }
    
    return {
      featured: [] as Book[],
      newArrivals: [] as Book[]
    }
  })

  const featuredBooks = computed(() => data.value?.featured || [])
  const newArrivals = computed(() => data.value?.newArrivals || [])
  const errorMessage = computed(() => error.value?.message || null)

  return {
    featuredBooks,
    newArrivals,
    loading,
    error: errorMessage,
    fetchBooks,
    fetchFeaturedBooks,
    fetchNewestArrivals,
    fetchBookBySlug,
    fetchBooksByCategory
  }
}
