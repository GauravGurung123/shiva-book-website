<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 mb-2 font-heading">NepaliBookInEurope</h1>
        <p class="text-gray-600">{{ isLogin ? 'Welcome back!' : 'Create your account' }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Email</label>
          <input 
            v-model="loginForm.email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Password</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-gray-600 text-sm">Remember me</span>
          </label>
          <a href="#" class="text-primary-600 text-sm hover:underline">Forgot password?</a>
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Signup Form -->
      <form v-else @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Full Name</label>
          <input 
            v-model="signupForm.name" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Username</label>
          <input 
            v-model="signupForm.username" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="johndoe"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Email</label>
          <input 
            v-model="signupForm.email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="your@email.com"
          />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-gray-700 font-medium mb-2">Country Code</label>
            <input 
              v-model="signupForm.country_code_no" 
              type="number" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="+977"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-gray-700 font-medium mb-2">Mobile Number</label>
            <input 
              v-model="signupForm.mobile_no" 
              type="number" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              placeholder="98XXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Password</label>
          <input 
            v-model="signupForm.password" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input 
            v-model="signupForm.password_confirmation" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Toggle between Login and Signup -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button 
            @click="toggleForm"
            class="text-primary-600 font-semibold hover:underline"
          >
            {{ isLogin ? 'Sign up' : 'Login' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, register, completeOAuthFlow, isAuthenticated } = useAuth()
const router = useRouter()

const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  username: '',
  email: '',
  country_code_no: null as number | null,
  mobile_no: null as number | null,
  password: '',
  password_confirmation: ''
})

const toggleForm = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await login(loginForm.value)
    // After successful login, complete OAuth flow to get access token
    await completeOAuthFlow()
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

const handleSignup = async () => {
  // Validate password match
  if (signupForm.value.password !== signupForm.value.password_confirmation) {
    error.value = 'Passwords do not match!'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    await register(signupForm.value)
    // After successful registration, complete OAuth flow to get access token
    await completeOAuthFlow()
    router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default'
})
</script>
