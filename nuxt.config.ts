// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  pages: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000/api/ws/v1',
      oauthClientId: process.env.NUXT_OAUTH_CLIENT_ID || '',
      oauthClientSecret: process.env.NUXT_OAUTH_CLIENT_SECRET || '',
      oauthRedirectUri: process.env.NUXT_OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback'
    }
  },
  app: {
    head: {
      title: 'NepaliBookInEurope — Buy Nepali Books Online in Europe | Free Shipping',
      meta: [
        { name: 'description', content: 'Shop Nepali books online at NepaliBookInEurope. FREE shipping on all orders across Europe. 15-day returns. COD available.' }
      ]
    }
  }
})
