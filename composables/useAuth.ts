import type { User, AuthResponse, RegisterData, LoginData, OAuthTokenResponse } from '~/types'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const accessToken = useCookie('access_token')
  const userCookie = useCookie('user', { default: () => null })
  const user = useState<User | null>('user', () => userCookie.value as User | null)

  // Generate PKCE code verifier and challenge
  const generatePKCE = async () => {
    // Generate code verifier with fallback
    let codeVerifier: string
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    } else {
      // Fallback for environments without crypto.getRandomValues
      codeVerifier = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    }

    // Generate code challenge with fallback
    let codeChallenge: string
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const encoder = new TextEncoder()
      const data = encoder.encode(codeVerifier)
      const hash = await crypto.subtle.digest('SHA-256', data)
      codeChallenge = Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    } else {
      // Fallback: simple hash for environments without crypto.subtle
      codeChallenge = await simpleHash(codeVerifier)
    }

    return { codeVerifier, codeChallenge }
  }

  // Simple hash function as fallback for environments without crypto.subtle
  const simpleHash = async (str: string): Promise<string> => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  }

  // Register user
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result = await response.json()
    user.value = result.data
    userCookie.value = result.data
    return result
  }

  // Login user
  const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const result = await response.json()
    user.value = result.data
    userCookie.value = result.data
    return result
  }

  // Get OAuth authorization URL
  const getAuthorizationUrl = async (): Promise<string> => {
    const { codeVerifier, codeChallenge } = await generatePKCE()
    
    // Store code verifier and challenge for later use
    sessionStorage.setItem('oauth_code_verifier', codeVerifier)
    sessionStorage.setItem('oauth_code_challenge', codeChallenge)

    const response = await fetch(`${apiBase}/oauth/authorization-url?code_challenge=${codeChallenge}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to get authorization URL')
    }

    const data = await response.json()
    return data.authorization_url
  }

  // Authorize and get authorization code
  const authorize = async (): Promise<string> => {
    const codeChallenge = sessionStorage.getItem('oauth_code_challenge')
    
    if (!codeChallenge) {
      throw new Error('Code challenge not found. Please start the OAuth flow from the beginning.')
    }

    const response = await fetch(`${apiBase}/oauth/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        code_challenge: codeChallenge
      })
    })

    if (!response.ok) {
      throw new Error('Authorization failed')
    }

    const data = await response.json()
    return data.authorization_code
  }

  // Exchange authorization code for access token
  const exchangeToken = async (code: string): Promise<OAuthTokenResponse> => {
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier')
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found')
    }

    const response = await fetch(`${apiBase}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        code_verifier: codeVerifier,
        client_id: config.public.oauthClientId,
        client_secret: config.public.oauthClientSecret,
        redirect_uri: config.public.oauthRedirectUri
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Token exchange failed')
    }

    const data = await response.json()
    
    // Store access token
    accessToken.value = data.access_token
    
    // Clear code verifier and challenge
    sessionStorage.removeItem('oauth_code_verifier')
    sessionStorage.removeItem('oauth_code_challenge')
    
    return data
  }

  // Complete OAuth flow
  const completeOAuthFlow = async () => {
    try {
      // Step 1: Get authorization URL (generates and stores PKCE)
      const authUrl = await getAuthorizationUrl()
      
      // Step 2: Authorize (auto-approved for BFF) - uses session from login
      const code = await authorize()
      
      // Step 3: Exchange code for token
      const tokenData = await exchangeToken(code)
      
      // Step 4: Fetch user profile with access token
      await fetchUser()
      
      return tokenData
    } catch (error) {
      console.error('OAuth flow failed:', error)
      throw error
    }
  }

  // Fetch current user
  const fetchUser = async (): Promise<User> => {
    if (!accessToken.value) {
      throw new Error('No access token')
    }

    const response = await fetch(`${apiBase}/auth/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    const userData = await response.json()
    user.value = userData
    userCookie.value = userData
    return userData
  }

  // Logout user
  const logout = async (): Promise<void> => {
    if (!accessToken.value) {
      return
    }

    await fetch(`${apiBase}/auth/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    accessToken.value = null
    user.value = null
    userCookie.value = null
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  return {
    register,
    login,
    logout,
    fetchUser,
    getAuthorizationUrl,
    authorize,
    exchangeToken,
    completeOAuthFlow,
    isAuthenticated,
    user
  }
}
