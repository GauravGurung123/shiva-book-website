export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const accessToken = useCookie('access_token')
  const sessionId = useCookie('session_id')

  const fetchFromApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...options.headers as Record<string, string>
      }

      // Add Content-Type for non-multipart requests
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      // Add Authorization header if token exists
      if (accessToken.value) {
        headers['Authorization'] = `Bearer ${accessToken.value}`
      }

      // Add X-Session-ID header if session exists
      if (sessionId.value) {
        headers['X-Session-ID'] = sessionId.value
      }

      const response = await fetch(`${apiBase}${endpoint}`, {
        ...options,
        headers
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

  const postFormData = <T>(endpoint: string, formData: FormData): Promise<T> => {
    return fetchFromApi<T>(endpoint, {
      method: 'POST',
      body: formData
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
    postFormData,
    put,
    delete: del,
    apiBase
  }
}
