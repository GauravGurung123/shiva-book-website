<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 mb-2 font-heading">NepaliBookInEurope</h1>
        <p class="text-gray-600">Reset your password</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ success }}
      </div>

      <!-- Forgot Password Form -->
      <form v-if="!emailSent" @submit.prevent="handleSendReset" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="your@email.com"
          />
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <!-- Email Sent Confirmation -->
      <div v-else class="text-center space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <svg class="w-12 h-12 mx-auto text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <p class="text-gray-700">
            Password reset link has been sent to your email. Please check your inbox and follow the instructions.
          </p>
          <p class="text-sm text-gray-500 mt-2">
            The link will expire in 24 hours. You can request a new link once per day.
          </p>
        </div>

        <button 
          @click="emailSent = false"
          class="text-primary-600 font-semibold hover:underline"
        >
          Send another reset link
        </button>
      </div>

      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Remember your password?
          <NuxtLink to="/login" class="text-primary-600 font-semibold hover:underline">
            Login
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { sendPasswordReset } = useAuth()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const emailSent = ref(false)

const handleSendReset = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    await sendPasswordReset(email.value)
    emailSent.value = true
    success.value = 'Password reset link sent successfully!'
  } catch (err: any) {
    error.value = err.message || 'Failed to send password reset link'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default'
})
</script>
