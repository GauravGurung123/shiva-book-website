<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Return Request Details -->
      <div v-else-if="returnRequest">
        <div class="mb-6">
          <NuxtLink to="/returns" class="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Return Requests
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Request Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Request Header -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-800 font-heading">Return Request #{{ returnRequest.id }}</h1>
                  <p class="text-sm text-gray-600">Order: {{ returnRequest.order_number }}</p>
                  <p class="text-sm text-gray-600">{{ formatDate(returnRequest.created_at) }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span 
                    class="px-4 py-2 rounded-full text-sm font-medium"
                    :class="getStatusClass(returnRequest.status)"
                  >
                    {{ formatStatus(returnRequest.status) }}
                  </span>
                  <span 
                    class="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {{ formatType(returnRequest.type) }}
                  </span>
                </div>
              </div>
              
              <!-- Request Details -->
              <div class="border-t border-gray-200 pt-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4 font-heading">Request Details</h2>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-gray-600"><strong>Reason:</strong></p>
                    <p class="text-gray-800 mt-1">{{ returnRequest.reason }}</p>
                  </div>
                  
                  <div v-if="returnRequest.items && returnRequest.items.length > 0">
                    <p class="text-sm text-gray-600"><strong>Items to Return:</strong></p>
                    <ul class="mt-2 space-y-2">
                      <li 
                        v-for="(item, index) in returnRequest.items" 
                        :key="index"
                        class="text-gray-800"
                      >
                        Order Item ID: {{ item.order_item_id }} - Quantity: {{ item.quantity }}
                      </li>
                    </ul>
                  </div>
                  
                  <div v-if="returnRequest.attachments && returnRequest.attachments.length > 0">
                    <p class="text-sm text-gray-600"><strong>Attachments:</strong></p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <a 
                        v-for="(attachment, index) in returnRequest.attachments" 
                        :key="index"
                        :href="attachment"
                        target="_blank"
                        class="text-primary-600 hover:text-primary-700 text-sm underline"
                      >
                        Attachment {{ index + 1 }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status Timeline -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-6 font-heading">Status Timeline</h2>
              <div class="space-y-4">
                <div 
                  v-for="step in statusSteps" 
                  :key="step.status"
                  class="flex items-start gap-4"
                >
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="getStepClass(step.status)"
                  >
                    <svg v-if="isStepCompleted(step.status)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div v-else class="w-2 h-2 bg-current rounded-full"></div>
                  </div>
                  <div>
                    <p class="font-medium text-gray-800">{{ step.label }}</p>
                    <p class="text-sm text-gray-600">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div v-if="returnRequest.status === 'pending'" class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4 font-heading">Actions</h2>
              <button 
                @click="openCancelDialog"
                :disabled="cancelling"
                class="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ cancelling ? 'Cancelling...' : 'Cancel Request' }}
              </button>
            </div>
            
            <!-- Instructions based on status -->
            <div v-if="returnRequest.status === 'approved'" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 class="font-bold text-gray-800 mb-2">Next Steps</h3>
              <p class="text-blue-800">Your return request has been approved. Please ship the items back to us using the shipping address provided in your order confirmation. Once shipped, the status will be updated.</p>
            </div>

<!--            <div v-if="returnRequest.status === 'shipped'" class="bg-purple-50 border border-purple-200 rounded-lg p-6">-->
<!--              <h3 class="font-bold text-gray-800 mb-2">Items Shipped</h3>-->
<!--              <p class="text-purple-800">You have shipped the items. We will inspect and update the status once the package arrives at our warehouse.</p>-->
<!--            </div>-->
            
<!--            <div v-if="returnRequest.status === 'received'" class="bg-green-50 border border-green-200 rounded-lg p-6">-->
<!--              <h3 class="font-bold text-gray-800 mb-2">Items Received</h3>-->
<!--              <p class="text-green-800">We have received your returned items. Your refund is being processed and will be issued shortly.</p>-->
<!--            </div>-->
            
<!--            <div v-if="returnRequest.status === 'refunded'" class="bg-green-50 border border-green-200 rounded-lg p-6">-->
<!--              <h3 class="font-bold text-gray-800 mb-2">Refund Issued</h3>-->
<!--              <p class="text-green-800">Your refund has been successfully issued. Please allow 5-7 business days for the refund to appear in your account.</p>-->
<!--            </div>-->

            <div v-if="returnRequest.status === 'cancelled'" class="bg-gray-100 border border-gray-300 rounded-lg p-6">
              <h3 class="font-bold text-gray-800 mb-2">Request Cancelled</h3>
              <p class="text-gray-700">This return request has been cancelled.</p>
            </div>
            
            <div v-if="returnRequest.status === 'rejected'" class="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 class="font-bold text-gray-800 mb-2">Request Rejected</h3>
              <p class="text-red-800">Your return request has been rejected. If you believe this is an error, please contact our support team.</p>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 class="text-xl font-bold text-gray-800 mb-6 font-heading">Order Information</h2>
              
              <div class="space-y-3">
                <div class="flex justify-between text-gray-600">
                  <span>Order Number:</span>
                  <span class="font-medium text-gray-800">{{ returnRequest.order_number }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Request Type:</span>
                  <span class="font-medium text-gray-800">{{ formatType(returnRequest.type) }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Current Status:</span>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="getStatusClass(returnRequest.status)"
                  >
                    {{ formatStatus(returnRequest.status) }}
                  </span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Created:</span>
                  <span class="font-medium text-gray-800">{{ formatDate(returnRequest.created_at) }}</span>
                </div>
              </div>
              
              <div class="mt-6 pt-6 border-t border-gray-200">
                <NuxtLink 
                  :to="`/orders/${returnRequest.order_number}`"
                  class="block w-full bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-700 transition text-center"
                >
                  View Order
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Return Request Confirmation Dialog -->
    <ConfirmDialog
      :is-open="showCancelDialog"
      title="Cancel Return Request"
      message="Are you sure you want to cancel this return request? This action cannot be undone."
      confirm-text="Yes, Cancel"
      :loading="cancelling"
      @close="closeCancelDialog"
      @confirm="confirmCancelRequest"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '~/components/ui/ConfirmDialog.vue'
import type { ReturnRequest } from '~/types'

const route = useRoute()
const { get, post } = useApi()
const { isAuthenticated } = useAuth()

const requestId = route.params.id as string

const returnRequest = ref<ReturnRequest | null>(null)
const loading = ref(false)
const error = ref('')
const cancelling = ref(false)
const showCancelDialog = ref(false)

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/login')
}

onMounted(async () => {
  await fetchReturnRequest()
})

const fetchReturnRequest = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get<any>(`/return-requests/${requestId}`)
    returnRequest.value = response?.data || response
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to load return request. Please try again.'
    console.error('Error fetching return request:', err)
  } finally {
    loading.value = false
  }
}

const openCancelDialog = () => {
  showCancelDialog.value = true
}

const closeCancelDialog = () => {
  showCancelDialog.value = false
}

const confirmCancelRequest = async () => {
  cancelling.value = true
  try {
    await post(`/return-requests/${requestId}/cancel`, {})
    showCancelDialog.value = false
    await fetchReturnRequest()
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

const statusSteps = [
  { status: 'pending', label: 'Request Submitted', description: 'Your return request has been submitted and is awaiting review.' },
  { status: 'approved', label: 'Request Approved', description: 'Your return request has been approved. Please ship the items back.' },
  { status: 'shipped', label: 'Items Shipped', description: 'You have shipped the items back to us.' },
  { status: 'received', label: 'Items Received', description: 'We have received your returned items.' },
  { status: 'refunded', label: 'Refund Issued', description: 'Your refund has been processed and issued.' }
]

const getStepClass = (status: string) => {
  if (!returnRequest.value) return 'bg-gray-200 text-gray-400'
  
  const currentIndex = statusSteps.findIndex(step => step.status === status)
  const currentStatusIndex = statusSteps.findIndex(step => step.status === returnRequest.value?.status)
  
  if (currentStatusIndex === -1) {
    return 'bg-gray-200 text-gray-400'
  }
  
  if (currentIndex < currentStatusIndex) {
    return 'bg-green-500 text-white'
  } else if (currentIndex === currentStatusIndex) {
    return 'bg-primary-600 text-white'
  } else {
    return 'bg-gray-200 text-gray-400'
  }
}

const isStepCompleted = (status: string) => {
  if (!returnRequest.value) return false
  
  const currentIndex = statusSteps.findIndex(step => step.status === status)
  const currentStatusIndex = statusSteps.findIndex(step => step.status === returnRequest.value?.status)
  
  if (currentStatusIndex === -1) {
    return false
  }
  
  return currentIndex < currentStatusIndex
}
</script>
