<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center space-y-6">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>

        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
          <p class="text-gray-600">Please check your email to verify your account.</p>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-800 text-sm">
            We sent a verification link to <span class="font-semibold">{{ userEmail }}</span>
          </p>
        </div>

        <div class="space-y-3 pt-4">
          <button
            @click="goToLogin"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading"
          >
            Go to Login
          </button>
          
          <p class="text-gray-500 text-sm">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const userEmail = ref('')

onMounted(() => {
  // Get email from query parameter or session storage
  userEmail.value = (route.query.email as string) || sessionStorage.getItem('registration_email') || ''
  
  // Store email in session storage if provided in query
  if (route.query.email && !sessionStorage.getItem('registration_email')) {
    sessionStorage.setItem('registration_email', route.query.email as string)
  }
})

const goToLogin = () => {
  router.push('/login')
}

definePageMeta({
  layout: 'default'
})
</script>
