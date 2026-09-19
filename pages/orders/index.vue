<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 font-heading">My Orders</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!orders || orders.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-600 font-heading mb-4">You have no orders yet</p>
        <NuxtLink to="/books" class="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-700 transition">
          Browse Books
        </NuxtLink>
      </div>
      
      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <!-- Order Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="font-bold text-gray-800 font-heading">{{ order.order_number }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(order.status)"
              >
                {{ formatStatus(order.status) }}
              </span>
              <NuxtLink 
                :to="`/orders/${order.order_number}`"
                class="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View Details
              </NuxtLink>
            </div>
          </div>
          
          <!-- Order Items Preview -->
          <div class="px-6 py-4">
            <div class="flex items-center gap-4">
              <div class="flex -space-x-2">
                <div 
                  v-for="(item, index) in order.items.slice(0, 3)" 
                  :key="item.id"
                  class="w-12 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded border border-primary-200 flex items-center justify-center overflow-hidden"
                >
                  <img 
                    v-if="item.book?.photo_url || item.book?.coverImage" 
                    :src="item.book.photo_url || item.book.coverImage" 
                    :alt="item.book.title"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-gray-400 text-xs">No Image</span>
                </div>
                <div 
                  v-if="order.items.length > 3"
                  class="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"
                >
                  <span class="text-gray-600 text-sm font-medium">+{{ order.items.length - 3 }}</span>
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-600">{{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-800">€{{ parseFloat(order.total || order.total_amount || 0).toFixed(2) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Order Notes -->
          <div v-if="order.notes" class="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800">{{ order.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'

const { get } = useApi()
const { isAuthenticated } = useAuth()

const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref('')

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/login')
}

onMounted(async () => {
  await fetchOrders()
})

const fetchOrders = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get<{ data: Order[] }>('/orders')
    orders.value = response.data
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to Load orders. Please try again.'
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'Pending Payment',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    failed: 'Failed'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}
</script>
