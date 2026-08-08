import type { Book } from '~/types'

interface ApiResponse<T> {
  data: T
  message?: string
}

export const useBooks = () => {
  const { get } = useApi()
  
  const featuredBooks = ref<Book[]>([])
  const newArrivals = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBooks = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await get<ApiResponse<Book[]>>('/books')
      
      if (response.data) {
        // Split books into featured and new arrivals (first 5 as featured, next 5 as new arrivals)
        const allBooks = response.data
        featuredBooks.value = allBooks.slice(0, 5)
        newArrivals.value = allBooks.slice(5, 10)
      }
    } catch (err) {
      error.value = 'Failed to fetch books'
      console.error('Error fetching books:', err)
      
      // Fallback to mock data if API fails
      featuredBooks.value = [
        { id: 1, title: 'Palpasa Cafe', author: 'Narayan Wagle', price: '€12.99' },
        { id: 2, title: 'Summer Love', author: 'Subin Bhattarai', price: '€10.99' },
        { id: 3, title: 'Karnali Blues', author: 'Buddhisagar', price: '€14.99' },
        { id: 4, title: 'Shirishko Phool', author: 'Parijat', price: '€9.99' },
        { id: 5, title: 'Seto Dharati', author: 'Amar Neupane', price: '€11.99' }
      ]
      
      newArrivals.value = [
        { id: 6, title: 'Yogmaya', author: 'Neelam Karki', price: '€15.99' },
        { id: 7, title: 'Lilati', author: 'Sanjeev Uprety', price: '€13.99' },
        { id: 8, title: 'Chiso Ashtray', author: 'Sushil Koirala', price: '€12.99' },
        { id: 9, title: 'Radha', author: 'Krishna Dharabasi', price: '€11.99' },
        { id: 10, title: 'Phoolko Aankhama', author: 'Parijat', price: '€10.99' }
      ]
    } finally {
      loading.value = false
    }
  }

  // Fetch books on composable initialization
  onMounted(() => {
    fetchBooks()
  })

  return {
    featuredBooks,
    newArrivals,
    loading,
    error,
    fetchBooks
  }
}
