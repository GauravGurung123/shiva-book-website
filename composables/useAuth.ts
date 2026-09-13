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
      // Fallback: SHA-256 polyfill for environments without crypto.subtle
      codeChallenge = await sha256(codeVerifier)
    }

    return { codeVerifier, codeChallenge }
  }

  // SHA-256 polyfill for environments without crypto.subtle
  const sha256 = async (message: string): Promise<string> => {
    // Encode message as UTF-8
    const encoder = new TextEncoder()
    const data = encoder.encode(message)

    // SHA-256 implementation
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]

    // Pre-processing: padding the message
    const msgLen = data.length
    const msgLenBits = msgLen * 8
    const newLen = msgLen + 1 + 64
    const paddedLen = Math.ceil(newLen / 64) * 64
    const padded = new Uint8Array(paddedLen)
    padded.set(data)
    padded[msgLen] = 0x80

    // Append length as 64-bit big-endian
    const view = new DataView(padded.buffer)
    view.setUint32(paddedLen - 8, Math.floor(msgLenBits / 0x100000000), false)
    view.setUint32(paddedLen - 4, msgLenBits >>> 0, false)

    // Process message in 512-bit (64-byte) blocks
    const blocks = Math.floor(paddedLen / 64)
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19

    for (let i = 0; i < blocks; i++) {
      const offset = i * 64
      const w = new Uint32Array(64)

      // Prepare message schedule
      for (let j = 0; j < 16; j++) {
        w[j] = view.getUint32(offset + j * 4, false)
      }
      for (let j = 16; j < 64; j++) {
        const s0 = Math.rotr(w[j - 15], 7) ^ Math.rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3)
        const s1 = Math.rotr(w[j - 2], 17) ^ Math.rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10)
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0
      }

      // Initialize hash values for this round
      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7

      // Main compression loop
      for (let j = 0; j < 64; j++) {
        const S1 = Math.rotr(e, 6) ^ Math.rotr(e, 11) ^ Math.rotr(e, 25)
        const ch = (e & f) ^ (~e & g)
        const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0
        const S0 = Math.rotr(a, 2) ^ Math.rotr(a, 13) ^ Math.rotr(a, 22)
        const maj = (a & b) ^ (a & c) ^ (b & c)
        const temp2 = (S0 + maj) >>> 0

        h = g
        g = f
        f = e
        e = (d + temp1) >>> 0
        d = c
        c = b
        b = a
        a = (temp1 + temp2) >>> 0
      }

      // Add hash values to current hash
      h0 = (h0 + a) >>> 0
      h1 = (h1 + b) >>> 0
      h2 = (h2 + c) >>> 0
      h3 = (h3 + d) >>> 0
      h4 = (h4 + e) >>> 0
      h5 = (h5 + f) >>> 0
      h6 = (h6 + g) >>> 0
      h7 = (h7 + h) >>> 0
    }

    // Produce final hash value
    const hash = new Uint8Array([
      (h0 >>> 24) & 0xff, (h0 >>> 16) & 0xff, (h0 >>> 8) & 0xff, h0 & 0xff,
      (h1 >>> 24) & 0xff, (h1 >>> 16) & 0xff, (h1 >>> 8) & 0xff, h1 & 0xff,
      (h2 >>> 24) & 0xff, (h2 >>> 16) & 0xff, (h2 >>> 8) & 0xff, h2 & 0xff,
      (h3 >>> 24) & 0xff, (h3 >>> 16) & 0xff, (h3 >>> 8) & 0xff, h3 & 0xff,
      (h4 >>> 24) & 0xff, (h4 >>> 16) & 0xff, (h4 >>> 8) & 0xff, h4 & 0xff,
      (h5 >>> 24) & 0xff, (h5 >>> 16) & 0xff, (h5 >>> 8) & 0xff, h5 & 0xff,
      (h6 >>> 24) & 0xff, (h6 >>> 16) & 0xff, (h6 >>> 8) & 0xff, h6 & 0xff,
      (h7 >>> 24) & 0xff, (h7 >>> 16) & 0xff, (h7 >>> 8) & 0xff, h7 & 0xff
    ])

    return Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Polyfill for Math.rotr if not available
  if (typeof Math.rotr === 'undefined') {
    Math.rotr = (value: number, shift: number): number => {
      return (value >>> shift) | (value << (32 - shift))
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
