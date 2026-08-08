import type { Category } from '~/types'

interface ApiResponse<T> {
  data: T
  message?: string
}

export const useCategories = () => {
  const { get } = useApi()
  
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await get<ApiResponse<any[]>>('/book-categories')
      
      if (response.data) {
        // Map API response to Category interface
        categories.value = response.data.map((category: any) => ({
          id: category.id?.toString() || category.slug,
          name: category.name,
          icon: getCategoryIcon(category.name),
          slug: category.slug
        }))
      }
    } catch (err) {
      error.value = 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
      
      // Fallback to mock data if API fails
      categories.value = [
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
    } finally {
      loading.value = false
    }
  }

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

  // Fetch categories on composable initialization
  onMounted(() => {
    fetchCategories()
  })

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
