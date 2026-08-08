import type { Category } from '~/types'

interface ApiResponse<T> {
  data: T
  message?: string
}

export const useCategories = () => {
  const { get } = useApi()
  
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
  
  const { data, pending: loading, error } = useAsyncData('categories', async () => {
    try {
      const response = await get<ApiResponse<any[]>>('/book-categories')
      
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
      console.error('Error fetching categories:', err)
      
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
    
    return [] as Category[]
  })

  const categories = computed(() => data.value || [])
  const errorMessage = computed(() => error.value?.message || null)

  return {
    categories,
    loading,
    error: errorMessage
  }
}
