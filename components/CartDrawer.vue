<template>
  <Transition name="slide">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 transition-opacity"
        @click="closeDrawer"
      ></div>
      
      <!-- Drawer -->
      <div class="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800 font-heading">Shopping Cart</h2>
          <button 
            @click="closeDrawer"
            class="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!cart || cart.items.length === 0" class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-600 font-heading">Your cart is empty</p>
          </div>
          
          <!-- Cart Items List -->
          <div v-else class="space-y-4">
            <div 
              v-for="item in cart.items" 
              :key="item.id"
              class="flex gap-4 p-4 bg-gray-50 rounded-lg"
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
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 font-heading">{{ item.book.title }}</h3>
                <p class="text-gray-600 text-xs mb-2">{{ item.book.author || '' }}</p>
                <p class="text-primary-600 font-bold">€{{ parseFloat(item.book.final_price || item.book.price || 0).toFixed(2) }}</p>
                
                <!-- Quantity Controls -->
                <div class="flex items-center gap-2 mt-2">
                  <button 
                    @click="updateItemQuantity(item, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    -
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button 
                    @click="updateItemQuantity(item, item.quantity + 1)"
                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                  <button 
                    @click="removeItem(item)"
                    class="ml-auto text-red-600 hover:text-red-700 text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div v-if="cart && cart.items.length > 0" class="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600 font-medium">Subtotal</span>
            <span class="text-xl font-bold text-gray-800">€{{ parseFloat(cart.total || 0).toFixed(2) }}</span>
          </div>
          
          <div class="space-y-3">
            <button 
              @click="goToCheckout"
              class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Order</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button 
              @click="closeDrawer"
              class="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { cart, loading, fetchCart, updateQuantity, removeFromCart } = useCart()

// Fetch cart when drawer opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await fetchCart()
  }
})

const closeDrawer = () => {
  emit('close')
}

const updateItemQuantity = async (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1) return
  
  try {
    await updateQuantity(item.id, { quantity: newQuantity })
  } catch (err) {
    console.error('Error updating quantity:', err)
  }
}

const removeItem = async (item: CartItem) => {
  try {
    await removeFromCart(item.id)
  } catch (err) {
    console.error('Error removing item:', err)
  }
}

const { isAuthenticated } = useAuth()

const goToCheckout = () => {
  closeDrawer()
  if (!isAuthenticated.value) {
    navigateTo('/login')
  } else {
    navigateTo('/checkout')
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}
</style>
