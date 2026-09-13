export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const config = useRuntimeConfig()
  
  const targetUrl = process.env.API_BASE_URL || 'http://localhost:8000/api/ws/v1'
  const url = `${targetUrl}/${path}`
  
  try {
    const body = await readBody(event)
    const method = getMethod(event)
    const headers = getHeaders(event)
    
    // Forward the request to the backend
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': headers['content-type'] || 'application/json',
        'Accept': 'application/json',
        // Forward authorization header if present
        ...(headers['authorization'] && { 'Authorization': headers['authorization'] }),
        ...(headers['x-session-id'] && { 'X-Session-ID': headers['x-session-id'] })
      },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined
    })
    
    const data = await response.json()
    
    return data
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Proxy error'
    })
  }
})
