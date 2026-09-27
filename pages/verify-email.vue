<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <h1 class="text-2xl font-bold text-gray-800">Verifying your email...</h1>
          <p class="text-gray-600">Please wait while we verify your account.</p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="space-y-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Email Verified!</h1>
          <p class="text-gray-600">Your email has been successfully verified. You can now log in to your account.</p>
          <button
            @click="goToLogin"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading"
          >
            Go to Login
          </button>
        </div>

        <!-- Error State -->
        <div v-else class="space-y-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">Verification Failed</h1>
          <p class="text-gray-600">{{ error || 'Invalid or expired verification link.' }}</p>
          <button
            @click="goToLogin"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { verifyEmail } = useAuth()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const success = ref(false)
const error = ref('')

const verifyEmailToken = async () => {
  const token = route.query.token as string

  if (!token) {
    loading.value = false
    error.value = 'No verification token provided.'
    return
  }

  try {
    await verifyEmail(token)
    success.value = true
  } catch (err: any) {
    error.value = err.message || 'Email verification failed'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

// Auto-call verification when page loads
onMounted(() => {
  verifyEmailToken()
})

definePageMeta({
  layout: 'default'
})
</script>
