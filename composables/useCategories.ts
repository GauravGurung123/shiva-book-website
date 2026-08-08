import type { Category } from '~/types'

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

export const useCategories = () => {
  const { get } = useApi()
  const config = useRuntimeConfig()
  
  // Helper function to map category names to icons
  const getCategoryIcon = (name: string): string => {
    const iconMap: Record<string, string> = {
      'Fiction': '📚',
      'Science': '🔬',
      'Technology': '💻',
      'Arts': '🎨',
      'Literature': '📖',
      'History': '🏛️',
      'Business': '💼',
      'Social Science': '🌍',
      'Law': '⚖️',
      'Medicine': '🏥',
      'Religion': '🙏',
      'Textbooks': '📝'
    }
    return iconMap[name] || '📚'
  }
  
  // Fetch paginated categories
  const fetchCategories = async (page: number = 1, perPage: number = 25, sortBy: string = 'id', descending: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        rowsPerPage: perPage.toString(),
        sortBy,
        descending: descending.toString()
      })
      
      const response = await get<ApiResponse<PaginatedResponse<any>>>(`/categories?${params.toString()}`)
      
      if (response.data) {
        // Map API response to Category interface
        const categories = response.data.data.map((category: any) => ({
          id: category.id?.toString() || category.slug,
          name: category.name,
          icon: getCategoryIcon(category.name),
          slug: category.slug
        }))
        
        return {
          categories,
          pagination: {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            perPage: response.data.per_page,
            total: response.data.total
          }
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      throw err
    }
    
    return {
      categories: [] as Category[],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 25,
        total: 0
      }
    }
  }
  
  // Fetch all categories (no pagination)
  const fetchAllCategories = async () => {
    try {
      const response = await get<ApiResponse<any[]>>('/categories/all')
      
      if (response.data) {
        // Map API response to Category interface
        return response.data.map((category: any) => ({
          id: category.id?.toString() || category.slug,
          name: category.name,
          icon: getCategoryIcon(category.name),
          slug: category.slug
        }))
      }
    } catch (err) {
      console.error('Error fetching all categories:', err)
      throw err
    }
    
    return [] as Category[]
  }
  
  // Legacy method for backward compatibility (fetches first page)
  const { data, pending: loading, error } = useAsyncData('categories', async () => {
    try {
      const result = await fetchCategories(1, 25, 'id', false)
      return result.categories
    } catch (err) {
      // Fallback to mock data if API fails
      return [
        { id: 'fiction', name: 'Fiction', icon: '📚', slug: 'fiction' },
        { id: 'science', name: 'Science', icon: '🔬', slug: 'science' },
        { id: 'technology', name: 'Technology', icon: '💻', slug: 'technology' },
        { id: 'arts', name: 'Arts', icon: '🎨', slug: 'arts' },
        { id: 'literature', name: 'Literature', icon: '📖', slug: 'literature' },
        { id: 'history', name: 'History', icon: '🏛️', slug: 'history' },
        { id: 'business', name: 'Business', icon: '💼', slug: 'business' },
        { id: 'social-science', name: 'Social Science', icon: '🌍', slug: 'social-science' },
        { id: 'law', name: 'Law', icon: '⚖️', slug: 'law' },
        { id: 'medicine', name: 'Medicine', icon: '🏥', slug: 'medicine' },
        { id: 'religion', name: 'Religion', icon: '🙏', slug: 'religion' },
        { id: 'textbooks', name: 'Textbooks', icon: '📝', slug: 'textbooks' }
      ]
    }
  })

  const categories = computed(() => data.value || [])
  const errorMessage = computed(() => error.value?.message || null)

  return {
    categories,
    loading,
    error: errorMessage,
    fetchCategories,
    fetchAllCategories
  }
}
