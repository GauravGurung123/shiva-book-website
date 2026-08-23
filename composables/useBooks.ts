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
    fetchNewestArrivals
  }
}
