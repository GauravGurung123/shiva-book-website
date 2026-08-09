import type { Publisher } from '~/types'

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

export const usePublishers = () => {
  const { get } = useApi()
  
  // Fetch paginated publishers
  const fetchPublishers = async (page: number = 1, perPage: number = 25, sortBy: string = 'id', descending: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        rowsPerPage: perPage.toString(),
        sortBy,
        descending: descending.toString()
      })
      
      const response = await get<any>(`/publishers?${params.toString()}`)
      
      if (response.data && Array.isArray(response.data)) {
        // Map API response to Publisher interface
        const publishers = response.data.map((publisher: any) => ({
          id: publisher.id?.toString() || publisher.slug,
          name: publisher.name,
          slug: publisher.slug,
          description: publisher.description,
          logo: publisher.logo_url || publisher.logo_path || publisher.logo
        }))
        
        return {
          publishers,
          pagination: {
            currentPage: response.meta?.current_page || 1,
            lastPage: response.meta?.last_page || 1,
            perPage: response.meta?.per_page || 25,
            total: response.meta?.total || 0
          }
        }
      }
    } catch (err) {
      console.error('Error fetching publishers:', err)
      throw err
    }
    
    return {
      publishers: [] as Publisher[],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 25,
        total: 0
      }
    }
  }
  
  // Fetch all publishers (no pagination)
  const fetchAllPublishers = async () => {
    try {
      const response = await get<ApiResponse<any[]>>('/publishers/all')
      
      if (response.data) {
        // Map API response to Publisher interface
        return response.data.map((publisher: any) => ({
          id: publisher.id?.toString() || publisher.slug,
          name: publisher.name,
          slug: publisher.slug,
          description: publisher.description,
          logo: publisher.logo_url || publisher.logo_path || publisher.logo
        }))
      }
    } catch (err) {
      console.error('Error fetching all publishers:', err)
      throw err
    }
    
    return [] as Publisher[]
  }
  
  // Legacy method for backward compatibility (fetches first page)
  const { data, pending: loading, error } = useAsyncData('publishers', async () => {
    try {
      const result = await fetchPublishers(1, 25, 'id', false)
      return result.publishers
    } catch (err) {
      // Fallback to mock data if API fails
      return [
        { id: 'fineprint', name: 'FinePrint', slug: 'fineprint' },
        { id: 'penguin', name: 'Penguin Books', slug: 'penguin' },
        { id: 'random-house', name: 'Random House', slug: 'random-house' },
        { id: 'harpercollins', name: 'HarperCollins', slug: 'harpercollins' },
        { id: 'macmillan', name: 'Macmillan', slug: 'macmillan' },
        { id: 'simon-schuster', name: 'Simon & Schuster', slug: 'simon-schuster' },
        { id: 'oxford', name: 'Oxford University Press', slug: 'oxford' },
        { id: 'cambridge', name: 'Cambridge University Press', slug: 'cambridge' },
        { id: 'nepalaya', name: 'Nepalaya', slug: 'nepalaya' },
        { id: 'rupa', name: 'Rupa Publications', slug: 'rupa' }
      ]
    }
  })

  const publishers = computed(() => data.value || [])
  const errorMessage = computed(() => error.value?.message || null)

  return {
    publishers,
    loading,
    error: errorMessage,
    fetchPublishers,
    fetchAllPublishers
  }
}
