<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 font-heading">Checkout</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Empty Cart State -->
      <div v-else-if="!cart || cart.items.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-600 font-heading mb-4">Your cart is empty</p>
        <NuxtLink to="/books" class="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-700 transition">
          Browse Books
        </NuxtLink>
      </div>
      
      <!-- Checkout Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-bold text-gray-800 font-heading">Order Summary</h2>
            </div>
            
            <div class="divide-y divide-gray-200">
              <div 
                v-for="item in cart.items" 
                :key="item.id"
                class="p-6 flex gap-4"
              >
                <!-- Book Image -->
                <div class="w-20 h-28 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded flex items-center justify-center border border-primary-200">
                  <img 
                    v-if="item.book?.photo_url || item.book?.coverImage" 
                    :src="item.book.photo_url || item.book.coverImage" 
                    :alt="item.book.title"
                    class="w-full h-full object-cover rounded"
                  />
                  <span v-else class="text-gray-400 text-xs">No Image</span>
                </div>
                
                <!-- Book Info -->
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-800 mb-1 font-heading">{{ item.book.title }}</h3>
                  <p class="text-gray-600 text-sm mb-2">{{ item.book.author || '' }}</p>
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="updateItemQuantity(item, item.quantity - 1)"
                        :disabled="item.quantity <= 1 || updatingQuantity"
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        -
                      </button>
                      <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                      <button 
                        @click="updateItemQuantity(item, item.quantity + 1)"
                        :disabled="updatingQuantity"
                        class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        +
                      </button>
                    </div>
                    <span class="text-gray-800 font-bold">€{{ item.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="mt-2 text-sm">
                    <span class="text-gray-600">€{{ parseFloat(item.book.final_price || item.book.price || 0).toFixed(2) }} each</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-800 mb-6 font-heading">Order Total</h2>
            
            <!-- Discount Code Section -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
              <div class="flex gap-2">
                <input 
                  v-model="discountCode"
                  type="text"
                  placeholder="Enter discount code"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                />
                <button 
                  @click="applyDiscount"
                  :disabled="!discountCode || applyingDiscount"
                  class="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {{ applyingDiscount ? 'Applying...' : 'Apply' }}
                </button>
              </div>
              <p v-if="discountError" class="text-red-600 text-sm mt-2">{{ discountError }}</p>
              <p v-if="discountSuccess" class="text-green-600 text-sm mt-2">{{ discountSuccess }}</p>
            </div>
            
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>€{{ parseFloat(cart.total || 0).toFixed(2) }}</span>
              </div>
              <div v-if="discountAmount > 0" class="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-€{{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div class="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>€{{ (parseFloat(cart.total || 0) - discountAmount).toFixed(2) }}</span>
              </div>
            </div>
            
            <button 
              @click="proceedToPayment"
              class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Proceed to Checkout
            </button>
            
            <p class="text-center text-gray-500 text-sm mt-4">
              By proceeding, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'

const { cart, loading, error, fetchCart, itemCount, updateQuantity } = useCart()

const discountCode = ref('')
const discountAmount = ref(0)
const applyingDiscount = ref(false)
const discountError = ref('')
const discountSuccess = ref('')
const updatingQuantity = ref(false)

onMounted(async () => {
  await fetchCart()
})

const updateItemQuantity = async (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1) return
  
  updatingQuantity.value = true
  try {
    await updateQuantity(item.id, { quantity: newQuantity })
  } catch (err) {
    console.error('Error updating quantity:', err)
  } finally {
    updatingQuantity.value = false
  }
}

const applyDiscount = async () => {
  if (!discountCode.value) return
  
  applyingDiscount.value = true
  discountError.value = ''
  discountSuccess.value = ''
  
  try {
    // TODO: Implement discount code API call
    // For now, simulate a discount
    if (discountCode.value.toLowerCase() === 'save10') {
      discountAmount.value = parseFloat(cart.value?.total || 0) * 0.1
      discountSuccess.value = 'Discount code applied successfully!'
    } else if (discountCode.value.toLowerCase() === 'save20') {
      discountAmount.value = parseFloat(cart.value?.total || 0) * 0.2
      discountSuccess.value = 'Discount code applied successfully!'
    } else {
      discountError.value = 'Invalid discount code'
      discountAmount.value = 0
    }
  } catch (err) {
    discountError.value = 'Failed to apply discount code'
    console.error('Error applying discount:', err)
  } finally {
    applyingDiscount.value = false
  }
}

const proceedToPayment = () => {
  // TODO: Implement payment flow
  console.log('Proceeding to checkout')
}
</script>
