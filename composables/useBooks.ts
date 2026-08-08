import type { Book } from '~/types'

interface ApiResponse<T> {
  data: T
  message?: string
}

export const useBooks = () => {
  const { get } = useApi()
  
  const { data, pending: loading, error } = useAsyncData('books', async () => {
    try {
      const response = await get<ApiResponse<Book[]>>('/books')
      
      if (response.data) {
        // Split books into featured and new arrivals (first 5 as featured, next 5 as new arrivals)
        const allBooks = response.data
        return {
          featured: allBooks.slice(0, 5),
          newArrivals: allBooks.slice(5, 10)
        }
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
    error: errorMessage
  }
}
