<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="text-gray-600">Completing authentication...</p>
      </div>
      <div v-else-if="error" class="space-y-4">
        <div class="text-red-600 text-6xl mb-4">✕</div>
        <h1 class="text-2xl font-bold text-gray-800">Authentication Failed</h1>
        <p class="text-gray-600">{{ error }}</p>
        <button 
          @click="router.push('/login')"
          class="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Return to Login
        </button>
      </div>
      <div v-else class="space-y-4">
        <div class="text-green-600 text-6xl mb-4">✓</div>
        <h1 class="text-2xl font-bold text-gray-800">Authentication Successful</h1>
        <p class="text-gray-600">Redirecting to home...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { completeOAuthFlow } = useAuth()
const router = useRouter()
const route = useRoute()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Complete the OAuth flow
    await completeOAuthFlow()
    
    // Redirect to home after successful authentication
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    error.value = err.message || 'Failed to complete authentication'
  } finally {
    loading.value = false
  }
})

definePageMeta({
  layout: false
})
</script>
