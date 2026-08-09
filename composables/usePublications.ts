import type { Publication } from '~/types'

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

export const usePublications = () => {
  const { get } = useApi()
  
  // Fetch paginated publications
  const fetchPublications = async (page: number = 1, perPage: number = 25, sortBy: string = 'id', descending: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        rowsPerPage: perPage.toString(),
        sortBy,
        descending: descending.toString()
      })
      
      const response = await get<ApiResponse<PaginatedResponse<any>>>(`/publications?${params.toString()}`)
      
      if (response.data) {
        // Map API response to Publication interface
        const publications = response.data.data.map((publication: any) => ({
          id: publication.id?.toString() || publication.slug,
          name: publication.name,
          slug: publication.slug,
          description: publication.description,
          logo: publication.logo_url || publication.logo_path || publication.logo
        }))
        
        return {
          publications,
          pagination: {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            perPage: response.data.per_page,
            total: response.data.total
          }
        }
      }
    } catch (err) {
      console.error('Error fetching publications:', err)
      throw err
    }
    
    return {
      publications: [] as Publication[],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 25,
        total: 0
      }
    }
  }
  
  // Fetch all publications (no pagination)
  const fetchAllPublications = async () => {
    try {
      const response = await get<ApiResponse<any[]>>('/publications/all')
      
      if (response.data) {
        // Map API response to Publication interface
        return response.data.map((publication: any) => ({
          id: publication.id?.toString() || publication.slug,
          name: publication.name,
          slug: publication.slug,
          description: publication.description,
          logo: publication.logo_url || publication.logo_path || publication.logo
        }))
      }
    } catch (err) {
      console.error('Error fetching all publications:', err)
      throw err
    }
    
    return [] as Publication[]
  }
  
  // Legacy method for backward compatibility (fetches first page)
  const { data, pending: loading, error } = useAsyncData('publications', async () => {
    try {
      const result = await fetchPublications(1, 25, 'id', false)
      return result.publications
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

  const publications = computed(() => data.value || [])
  const errorMessage = computed(() => error.value?.message || null)

  return {
    publications,
    loading,
    error: errorMessage,
    fetchPublications,
    fetchAllPublications
  }
}
