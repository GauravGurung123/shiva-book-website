<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 mb-2 font-heading">NepaliBookInEurope</h1>
        <p class="text-gray-600">Set your new password</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ success }}
      </div>

      <!-- Invalid Token Message -->
      <div v-if="invalidToken" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p class="font-semibold">Invalid or expired reset link</p>
        <p class="text-sm mt-1">Please request a new password reset link.</p>
      </div>

      <!-- Reset Password Form -->
      <form v-if="!passwordReset" @submit.prevent="handleResetPassword" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-2">New Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <div class="relative">
            <input 
              v-model="passwordConfirmation" 
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <!-- Password Reset Success -->
      <div v-else class="text-center space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <svg class="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-700 font-semibold">Password reset successful!</p>
          <p class="text-gray-600 mt-2">You can now login with your new password.</p>
        </div>

        <NuxtLink 
          to="/login"
          class="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading"
        >
          Go to Login
        </NuxtLink>
      </div>

      <!-- Back to Forgot Password -->
      <div v-if="!passwordReset" class="mt-6 text-center">
        <p class="text-gray-600">
          Didn't receive the link?
          <NuxtLink to="/forgot-password" class="text-primary-600 font-semibold hover:underline">
            Request another
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { resetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

const token = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const invalidToken = ref(false)
const passwordReset = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Get token from query parameter
onMounted(() => {
  token.value = route.query.token as string || ''
  if (!token.value) {
    invalidToken.value = true
  }
})

const handleResetPassword = async () => {
  // Validate password match
  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match!'
    return
  }

  // Validate password length
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long!'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    await resetPassword(token.value, password.value, passwordConfirmation.value)
    passwordReset.value = true
    success.value = 'Password reset successful!'
  } catch (err: any) {
    if (err.message && err.message.includes('token')) {
      invalidToken.value = true
      error.value = 'Invalid or expired reset token'
    } else {
      error.value = err.message || 'Failed to reset password'
    }
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default'
})
</script>
