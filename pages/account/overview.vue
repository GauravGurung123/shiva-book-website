<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary-600 font-heading">NepaliBookInEurope</h1>
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-lg relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <nav class="text-sm text-gray-600">
          <span class="hover:text-primary-600 cursor-pointer">Homepage</span>
          <span class="mx-2">></span>
          <span class="hover:text-primary-600 cursor-pointer">My page</span>
          <span class="mx-2">></span>
          <span class="text-gray-800 font-medium">Overview</span>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Welcome Message -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Hello {{ user?.name || 'User' }}</h2>
      </div>

      <!-- User Actions -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer transition">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">MY ORDERS</h3>
              <p class="text-gray-600 text-sm">Find receipts and ongoing orders here.</p>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer transition">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">MY PROFILE</h3>
              <p class="text-gray-600 text-sm">Change your information and addresses.</p>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer transition">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">MY FAVORITES</h3>
              <p class="text-gray-600 text-sm">View your saved favorites here.</p>
            </div>
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>

          <div class="p-4 hover:bg-gray-50 cursor-pointer transition">
            <button @click="handleLogout" class="text-red-600 font-medium hover:text-red-700">
              Do you want to leave? To go out
            </button>
          </div>
        </div>
      </div>

      <!-- Customer Service -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Contact Customer Service</h3>
        
        <div class="flex items-start space-x-4 mb-4">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-green-600 font-medium">The chat service is online.</p>
            <p class="text-gray-600 text-sm">Average waiting time: 20 seconds</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p class="font-medium text-gray-800">Direct Message on Facebook</p>
              <p class="text-gray-600 text-sm">Response time: ~1 hour</p>
            </div>
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>

          <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p class="font-medium text-gray-800">Phone</p>
              <p class="text-gray-600 text-sm">+351 210 209 290</p>
            </div>
            <p class="text-gray-600 text-sm">Response time: ~20 minutes</p>
          </div>

          <div class="p-3 bg-gray-50 rounded">
            <p class="font-medium text-gray-800 mb-2">Customer service hours</p>
            <p class="text-gray-600 text-sm">Monday - Friday: 9:00 - 18:00</p>
            <p class="text-gray-600 text-sm">Saturday: 10:00 - 16:00</p>
            <a href="#" class="text-primary-600 text-sm hover:underline">Find the store nearest you</a>
          </div>
        </div>
      </div>

      <!-- FAQs -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
        
        <div class="space-y-3">
          <div class="border-b pb-3">
            <p class="font-medium text-gray-800">How long does shipping take?</p>
            <p class="text-gray-600 text-sm mt-1">Shipping typically takes 3-5 business days across Europe.</p>
          </div>
          <div class="border-b pb-3">
            <p class="font-medium text-gray-800">What is your return policy?</p>
            <p class="text-gray-600 text-sm mt-1">We offer 15-day returns on all orders.</p>
          </div>
          <div class="border-b pb-3">
            <p class="font-medium text-gray-800">How do I check if a book is available?</p>
            <p class="text-gray-600 text-sm mt-1">Check the product page for stock availability.</p>
          </div>
          <div class="border-b pb-3">
            <p class="font-medium text-gray-800">Do you offer gift cards?</p>
            <p class="text-gray-600 text-sm mt-1">Yes, gift cards are available in various denominations.</p>
          </div>
          <div>
            <p class="font-medium text-gray-800">How do I place an order?</p>
            <p class="text-gray-600 text-sm mt-1">Add items to your basket and proceed to checkout.</p>
          </div>
        </div>
      </div>

      <!-- Brand Information -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4">About NepaliBookInEurope</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded">
            <p class="font-medium text-gray-800">Wide selection</p>
            <p class="text-gray-600 text-sm mt-1">Thousands of Nepali books available across Europe.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded">
            <p class="font-medium text-gray-800">Free shipping</p>
            <p class="text-gray-600 text-sm mt-1">FREE shipping on all orders across Europe.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded">
            <p class="font-medium text-gray-800">Easy returns</p>
            <p class="text-gray-600 text-sm mt-1">15-day return policy for your peace of mind.</p>
          </div>
          <div class="p-4 bg-gray-50 rounded">
            <p class="font-medium text-gray-800">COD available</p>
            <p class="text-gray-600 text-sm mt-1">Cash on delivery available in select locations.</p>
          </div>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Subscribe to our newsletter</h3>
        <p class="text-gray-600 mb-4">Subscribe to the newsletter and receive a €10 voucher</p>
        
        <form @submit.prevent="handleNewsletter" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Name *</label>
              <input 
                v-model="newsletterForm.name" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label class="block text-gray-700 font-medium mb-2">Email *</label>
              <input 
                v-model="newsletterForm.email" 
                type="email" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" class="mr-2" />
              <span class="text-gray-600 text-sm">I agree to receive marketing communications</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-2" />
              <span class="text-gray-600 text-sm">I agree to the terms and conditions</span>
            </label>
          </div>

          <button 
            type="submit"
            class="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Subscribe
          </button>
        </form>

        <div class="mt-4 text-sm text-gray-600">
          <a href="#" class="hover:underline">Terms and conditions</a>
          <span class="mx-2">|</span>
          <a href="#" class="hover:underline">Privacy policy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, user, logout, fetchUser } = useAuth()
const router = useRouter()
const loading = ref(true)

const newsletterForm = ref({
  name: '',
  email: ''
})

// Check authentication and fetch user if needed
onMounted(async () => {
  const accessToken = useCookie('access_token')
  
  // If no access token, redirect to login
  if (!accessToken.value) {
    router.push('/login')
    return
  }
  
  // If we have a token but no user data, try to fetch it
  if (!user.value && accessToken.value) {
    try {
      await fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/login')
      return
    }
  }
  
  // If still no user after fetching, redirect to login
  if (!user.value) {
    router.push('/login')
    return
  }
  
  loading.value = false
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const handleNewsletter = () => {
  alert('Newsletter subscription functionality to be implemented')
  newsletterForm.value = { name: '', email: '' }
}

definePageMeta({
  layout: 'default'
})
</script>
