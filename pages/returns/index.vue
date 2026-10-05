<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8 font-heading">Return Requests</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!returnRequests || returnRequests.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
        <p class="text-gray-600 font-heading mb-4">You have no return requests</p>
        <NuxtLink to="/orders" class="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-700 transition">
          View Orders
        </NuxtLink>
      </div>
      
      <!-- Return Requests List -->
      <div v-else class="space-y-6">
        <div 
          v-for="request in returnRequests" 
          :key="request.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <!-- Request Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 class="font-bold text-gray-800 font-heading">Request #{{ request.id }}</h3>
              <p class="text-sm text-gray-600">Order: {{ request.order_number }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(request.created_at) }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(request.status)"
              >
                {{ formatStatus(request.status) }}
              </span>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {{ formatType(request.type) }}
              </span>
            </div>
          </div>
          
          <!-- Request Details -->
          <div class="px-6 py-4">
            <div class="mb-4">
              <p class="text-sm text-gray-600"><strong>Reason:</strong> {{ request.reason }}</p>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <NuxtLink 
                  :to="`/returns/${request.id}`"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Details
                </NuxtLink>
              </div>
              <button 
                v-if="request.status === 'pending'"
                @click="cancelRequest(request.id)"
                :disabled="cancelling"
                class="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ cancelling ? 'Cancelling...' : 'Cancel Request' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReturnRequest } from '~/types'

const { get, post } = useApi()
const { isAuthenticated } = useAuth()

const returnRequests = ref<ReturnRequest[]>([])
const loading = ref(false)
const error = ref('')
const cancelling = ref(false)

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/login')
}

onMounted(async () => {
  await fetchReturnRequests()
})

const fetchReturnRequests = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get<{ data: ReturnRequest[] }>('/return-requests')
    returnRequests.value = response.data.data
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to load return requests. Please try again.'
    console.error('Error fetching return requests:', err)
  } finally {
    loading.value = false
  }
}

const cancelRequest = async (id: number) => {
  if (!confirm('Are you sure you want to cancel this return request?')) {
    return
  }
  
  cancelling.value = true
  try {
    await post(`/return-requests/${id}/cancel`, {})
    await fetchReturnRequests()
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to cancel return request. Please try again.'
    console.error('Error cancelling return request:', err)
  } finally {
    cancelling.value = false
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
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    shipped: 'Shipped',
    received: 'Received',
    refunded: 'Refunded'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    shipped: 'bg-purple-100 text-purple-800',
    received: 'bg-indigo-100 text-indigo-800',
    refunded: 'bg-green-100 text-green-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const formatType = (type: string) => {
  const typeMap: Record<string, string> = {
    withdrawal: 'Withdrawal',
    defective: 'Defective',
    damaged: 'Damaged',
    incorrect_item: 'Incorrect Item'
  }
  return typeMap[type] || type
}
</script>
