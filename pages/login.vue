<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-orange-600 mb-2">NepliBookInEurope</h1>
        <p class="text-gray-600">{{ isLogin ? 'Welcome back!' : 'Create your account' }}</p>
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Email</label>
          <input 
            v-model="loginForm.email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Password</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="••••••••"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-gray-600 text-sm">Remember me</span>
          </label>
          <a href="#" class="text-orange-600 text-sm hover:underline">Forgot password?</a>
        </div>

        <button 
          type="submit"
          class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Login
        </button>
      </form>

      <!-- Signup Form -->
      <form v-else @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-2">Full Name</label>
          <input 
            v-model="signupForm.fullname" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Username</label>
          <input 
            v-model="signupForm.username" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="johndoe"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Email</label>
          <input 
            v-model="signupForm.email" 
            type="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Password</label>
          <input 
            v-model="signupForm.password" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input 
            v-model="signupForm.confirmPassword" 
            type="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Create Account
        </button>
      </form>

      <!-- Toggle between Login and Signup -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button 
            @click="toggleForm"
            class="text-orange-600 font-semibold hover:underline"
          >
            {{ isLogin ? 'Sign up' : 'Login' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isLogin = ref(true)

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  fullname: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const toggleForm = () => {
  isLogin.value = !isLogin.value
}

const handleLogin = () => {
  console.log('Login submitted:', loginForm.value)
  // TODO: Implement login logic
  alert('Login functionality to be implemented')
}

const handleSignup = () => {
  // Validate password match
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  console.log('Signup submitted:', signupForm.value)
  // TODO: Implement signup logic
  alert('Signup functionality to be implemented')
}

definePageMeta({
  layout: 'default'
})
</script>
