import type { User, AuthResponse, RegisterData, LoginData, OAuthTokenResponse } from '~/types'
import SHA256 from 'crypto-js/sha256'
import Base64 from 'crypto-js/enc-base64'


export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const accessToken = useCookie('access_token')
  const userCookie = useCookie('user', { default: () => null })
  const user = useState<User | null>('user', () => userCookie.value as User | null)

  // Generate PKCE code verifier and challenge
  const generatePKCE = async () => {
    if (!import.meta.client) {
      throw new Error('PKCE must be generated in the browser')
    }

    const randomBytes = new Uint8Array(32)

    if (!window.crypto?.getRandomValues) {
      throw new Error('Secure random generator is unavailable')
    }

    // Cryptographically secure random bytes
    window.crypto.getRandomValues(randomBytes)

    // Convert random bytes to Base64URL
    const binary = String.fromCharCode(...randomBytes)

    const codeVerifier = btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

    // SHA-256
    const hash = SHA256(codeVerifier)

    // Base64URL(SHA256(codeVerifier))
    const codeChallenge = Base64.stringify(hash)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

    console.log('PKCE generated')
    console.log('Verifier:', codeVerifier)
    console.log('Challenge:', codeChallenge)

    return {
      codeVerifier,
      codeChallenge
    }
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
    if (!import.meta.client) {
      throw new Error('OAuth must run in the browser')
    }

    const { codeVerifier, codeChallenge } = await generatePKCE()

    sessionStorage.setItem(
        'oauth_code_verifier',
        codeVerifier
    )

    sessionStorage.setItem(
        'oauth_code_challenge',
        codeChallenge
    )

    console.log('PKCE verifier:', codeVerifier)
    console.log('PKCE challenge:', codeChallenge)

    const response = await fetch(
        `${apiBase}/oauth/authorization-url?code_challenge=${encodeURIComponent(codeChallenge)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          },
          credentials: 'include'
        }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => null)

      throw new Error(
          error?.message || 'Failed to get authorization URL'
      )
    }

    const data = await response.json()

    return data.authorization_url
  }

  // Authorize and get authorization code
  const authorize = async (): Promise<string> => {
    if (!import.meta.client) {
      throw new Error('OAuth must run in the browser')
    }

    const codeChallenge = sessionStorage.getItem(
        'oauth_code_challenge'
    )

    if (!codeChallenge) {
      throw new Error(
          'Code challenge not found. Please restart the OAuth flow.'
      )
    }

    console.log('Authorize challenge:', codeChallenge)

    const response = await fetch(
        `${apiBase}/oauth/authorize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
          })
        }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => null)

      throw new Error(
          error?.message || 'Authorization failed'
      )
    }

    const data = await response.json()

    return data.authorization_code
  }

  // Exchange authorization code for access token
  const exchangeToken = async (
      code: string
  ): Promise<OAuthTokenResponse> => {
    if (!import.meta.client) {
      throw new Error('OAuth must run in the browser')
    }

    const codeVerifier = sessionStorage.getItem(
        'oauth_code_verifier'
    )

    if (!codeVerifier) {
      throw new Error(
          'Code verifier not found. Please restart the OAuth flow.'
      )
    }

    console.log('Token exchange verifier:', codeVerifier)

    const response = await fetch(
        `${apiBase}/oauth/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code,
            code_verifier: codeVerifier,
            client_id: config.public.oauthClientId,
            client_secret: config.public.oauthClientSecret,
            redirect_uri: config.public.oauthRedirectUri
          })
        }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)

      console.error('Token exchange error:', errorData)

      throw new Error(
          errorData?.message || 'Token exchange failed'
      )
    }

    const data = await response.json()

    accessToken.value = data.access_token

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
