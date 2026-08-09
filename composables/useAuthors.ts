import type { Author } from '~/types'

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

export const useAuthors = () => {
  const { get } = useApi()
  
  // Fetch paginated authors
  const fetchAuthors = async (page: number = 1, perPage: number = 25, sortBy: string = 'id', descending: boolean = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        rowsPerPage: perPage.toString(),
        sortBy,
        descending: descending.toString()
      })
      
      const response = await get<ApiResponse<PaginatedResponse<any>>>(`/authors?${params.toString()}`)
      
      if (response.data) {
        // Map API response to Author interface
        const authors = response.data.data.map((author: any) => ({
          id: author.id?.toString() || author.slug,
          name: author.name,
          slug: author.slug,
          bio: author.bio,
          photo: author.photo_url || author.photo_path || author.photo
        }))
        
        return {
          authors,
          pagination: {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            perPage: response.data.per_page,
            total: response.data.total
          }
        }
      }
    } catch (err) {
      console.error('Error fetching authors:', err)
      throw err
    }
    
    return {
      authors: [] as Author[],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 25,
        total: 0
      }
    }
  }
  
  // Fetch all authors (no pagination)
  const fetchAllAuthors = async () => {
    try {
      const response = await get<ApiResponse<any[]>>('/authors/all')
      
      if (response.data) {
        // Map API response to Author interface
        return response.data.map((author: any) => ({
          id: author.id?.toString() || author.slug,
          name: author.name,
          slug: author.slug,
          bio: author.bio,
          photo: author.photo_url || author.photo_path || author.photo
        }))
      }
    } catch (err) {
      console.error('Error fetching all authors:', err)
      throw err
    }
    
    return [] as Author[]
  }
  
  // Legacy method for backward compatibility (fetches first page)
  const { data, pending: loading, error } = useAsyncData('authors', async () => {
    try {
      const result = await fetchAuthors(1, 25, 'id', false)
      return result.authors
    } catch (err) {
      // Fallback to mock data if API fails
      return [
        { id: 'narayan-wagle', name: 'Narayan Wagle', slug: 'narayan-wagle' },
        { id: 'subin-bhattarai', name: 'Subin Bhattarai', slug: 'subin-bhattarai' },
        { id: 'buddhisagar', name: 'Buddhisagar', slug: 'buddhisagar' },
        { id: 'parijat', name: 'Parijat', slug: 'parijat' },
        { id: 'amar-neupane', name: 'Amar Neupane', slug: 'amar-neupane' },
        { id: 'neelam-karki', name: 'Neelam Karki', slug: 'neelam-karki' },
        { id: 'sanjeev-uprety', name: 'Sanjeev Uprety', slug: 'sanjeev-uprety' },
        { id: 'sushil-koirala', name: 'Sushil Koirala', slug: 'sushil-koirala' },
        { id: 'krishna-dharabasi', name: 'Krishna Dharabasi', slug: 'krishna-dharabasi' },
        { id: 'bishweshwar-prasad-koirala', name: 'Bishweshwar Prasad Koirala', slug: 'bishweshwar-prasad-koirala' }
      ]
    }
  })

  const authors = computed(() => data.value || [])
  const errorMessage = computed(() => error.value?.message || null)

  return {
    authors,
    loading,
    error: errorMessage,
    fetchAuthors,
    fetchAllAuthors
  }
}
