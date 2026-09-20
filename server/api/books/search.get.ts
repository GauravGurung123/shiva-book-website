export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchQuery = query.q as string

  // Validate minimum 2 characters
  if (!searchQuery || searchQuery.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must be at least 2 characters long'
    })
  }

  const config = useRuntimeConfig()
  const targetUrl = process.env.API_BASE_URL || 'http://localhost:8000/api/ws/v1'
  
  // Build URL with all query parameters
  const params = new URLSearchParams({
    q: searchQuery,
    page: (query.page || '1').toString(),
    per_page: (query.per_page || '12').toString(),
    sort_by: (query.sort_by || 'relevance').toString(),
    sort_order: (query.sort_order || 'desc').toString()
  })

  // Add optional filters
  if (query.min_price) params.append('min_price', query.min_price.toString())
  if (query.max_price) params.append('max_price', query.max_price.toString())
  if (query.discounted_only) params.append('discounted_only', query.discounted_only.toString())
  if (query.in_stock_only) params.append('in_stock_only', query.in_stock_only.toString())

  const url = `${targetUrl}/books/search?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: 'Search request failed'
      })
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Search API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
