export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const fetchFromApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const response = await fetch(`${apiBase}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  const get = <T>(endpoint: string): Promise<T> => {
    return fetchFromApi<T>(endpoint, { method: 'GET' })
  }

  const post = <T>(endpoint: string, data: any): Promise<T> => {
    return fetchFromApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  const put = <T>(endpoint: string, data: any): Promise<T> => {
    return fetchFromApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  const del = <T>(endpoint: string): Promise<T> => {
    return fetchFromApi<T>(endpoint, { method: 'DELETE' })
  }

  return {
    get,
    post,
    put,
    delete: del,
    apiBase
  }
}
