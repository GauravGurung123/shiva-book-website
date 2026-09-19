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
      
      <!-- Order Details -->
      <div v-else-if="order">
        <div class="mb-6">
          <NuxtLink to="/orders" class="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Orders
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Order Header -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-800 font-heading">{{ order.order_number }}</h1>
                  <p class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</p>
                </div>
                <span 
                  class="px-4 py-2 rounded-full text-sm font-medium"
                  :class="getStatusClass(order.status)"
                >
                  {{ formatStatus(order.status) }}
                </span>
              </div>
              
              <!-- Order Notes -->
              <div v-if="order.notes" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm text-yellow-800">{{ order.notes }}</p>
                </div>
              </div>
              
              <!-- Order Items -->
              <div class="border-t border-gray-200 pt-6">
                <h2 class="text-lg font-bold text-gray-800 mb-4 font-heading">Order Items</h2>
                <div class="space-y-4">
                  <div 
                    v-for="item in order.items" 
                    :key="item.id"
                    class="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div class="w-20 h-28 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded flex items-center justify-center border border-primary-200">
                      <img 
                        v-if="item.book?.photo_url || item.book?.coverImage" 
                        :src="item.book.photo_url || item.book.coverImage" 
                        :alt="item.book.title"
                        class="w-full h-full object-cover rounded"
                      />
                      <span v-else class="text-gray-400 text-xs">No Image</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-800 mb-1 font-heading">{{ item.book.title }}</h3>
                      <p class="text-gray-600 text-sm mb-2">{{ item.book.author || '' }}</p>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Qty: {{ item.quantity }}</span>
                        <span class="text-gray-800 font-bold">€{{ item.subtotal.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Payment Instructions (for pending orders) -->
            <div v-if="order.status === 'pending'" class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4 font-heading">Payment Instructions</h2>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 class="font-bold text-gray-800 mb-4">Please make payment to our IBAN:</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">IBAN:</span>
                    <span class="font-mono font-bold text-gray-800">{{ shopIban || 'Loading...' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Account holder:</span>
                    <span class="font-bold text-gray-800">{{ shopAccountHolder || 'Loading...' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Amount:</span>
                    <span class="font-bold text-gray-800">€{{ parseFloat(order.total || order.total_amount || 0).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Reference:</span>
                    <span class="font-mono font-bold text-primary-600">{{ order.order_number }}</span>
                  </div>
                </div>
                
                <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p class="text-sm text-yellow-800">
                    <strong>Important:</strong> Please use your order number <span class="font-mono">{{ order.order_number }}</span> as the payment reference. Your order will expire in 3 days if payment is not received.
                  </p>
                </div>
              </div>
              
              <!-- Payment Proof Upload -->
              <div v-if="!hasPayment" class="border-t border-gray-200 pt-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 font-heading">Upload Payment Proof</h3>
                <form @submit.prevent="submitPayment" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select 
                      v-model="paymentMethod"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
<!--                      <option value="iban_transfer">IBAN Transfer</option>-->
<!--                      <option value="multibanco">Multibanco</option>-->
<!--                      <option value="mb_way">MB Way</option>-->
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Reference</label>
                    <input 
                      v-model="paymentReference"
                      type="text"
                      :placeholder="order.order_number"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    />
                    <p class="text-sm text-gray-500 mt-1">Use your order number as reference</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Screenshot <span class="text-red-500">(* Required)</span></label>
                    <input 
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="handleFileChange"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                    />
                    <p class="text-sm text-gray-500 mt-1">Upload a screenshot of your payment confirmation</p>
                  </div>
                  
                  <button 
                    type="submit"
                    :disabled="submittingPayment"
                    class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {{ submittingPayment ? 'Submitting...' : 'Submit Payment Proof' }}
                  </button>
                </form>
                
                <div v-if="paymentError" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-red-600">{{ paymentError }}</p>
                </div>
                
                <div v-if="paymentSuccess" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-green-600">{{ paymentSuccess }}</p>
                </div>
              </div>
              
              <!-- Payment Already Submitted -->
              <div v-else class="border-t border-gray-200 pt-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-green-800 font-medium">Payment proof submitted successfully!</p>
                  <p class="text-green-600 text-sm mt-2">Your payment is being verified. We will update your order status once verified.</p>
                </div>
              </div>
            </div>
            
            <!-- Order Status Info (for non-pending orders) -->
            <div v-else class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-bold text-gray-800 mb-4 font-heading">Order Status</h2>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Current Status:</span>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusClass(order.status)"
                  >
                    {{ formatStatus(order.status) }}
                  </span>
                </div>
                <div v-if="order.status === 'cancelled'" class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p class="text-red-600">This order has been cancelled. If you still want these items, please create a new order.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 class="text-xl font-bold text-gray-800 mb-6 font-heading">Order Summary</h2>
              
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>€{{ parseFloat(order.subtotal || 0).toFixed(2) }}</span>
                </div>
                <div v-if="order.tax > 0" class="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>€{{ parseFloat(order.tax || 0).toFixed(2) }}</span>
                </div>
                <div v-if="order.shipping_fee > 0" class="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>€{{ parseFloat(order.shipping_fee || 0).toFixed(2) }}</span>
                </div>
                <div v-if="order.discount_total > 0" class="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-€{{ parseFloat(order.discount_total || 0).toFixed(2) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>€{{ parseFloat(order.total || order.total_amount || 0).toFixed(2) }}</span>
                </div>
              </div>
              
              <div v-if="order.expires_at" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800">
                  <strong>Order expires:</strong> {{ formatDate(order.expires_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, Payment } from '~/types'

const route = useRoute()
const { get, post, postFormData } = useApi()
const { isAuthenticated } = useAuth()

const orderNumber = route.params.orderNumber as string

const order = ref<Order | null>(null)
const payment = ref<Payment | null>(null)
const loading = ref(false)
const error = ref('')

// Shop settings
const shopIban = ref('')
const shopAccountHolder = ref('')

// Payment form
const paymentMethod = ref<'bank_transfer' | 'iban_transfer' | 'multibanco' | 'mb_way'>('bank_transfer')
const paymentReference = ref('')
const selectedFile = ref<File | null>(null)
const submittingPayment = ref(false)
const paymentError = ref('')
const paymentSuccess = ref('')

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/login')
}

onMounted(async () => {
  await fetchOrder()
  await fetchPayment()
  await fetchSettings()
})

const fetchOrder = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get<{ data: Order }>(`/orders/${orderNumber}`)
    order.value = response.data
    paymentReference.value = order.value.order_number
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to load order. Please try again.'
    console.error('Error fetching order:', err)
  } finally {
    loading.value = false
  }
}

const fetchPayment = async () => {
  if (!order.value) return
  
  try {
    const response = await get<{ data: Payment }>(`/payments/orders/${order.value.order_number}`)
    payment.value = response.data
  } catch (err) {
    // Payment might not exist yet
    payment.value = null
  }
}

const fetchSettings = async () => {
  try {
    const [ibanResponse, accountHolderResponse] = await Promise.all([
      get<{ data: { value: string } }>('/settings/key/shop_iban'),
      get<{ data: { value: string } }>('/settings/key/shop_account_holder')
    ])
    shopIban.value = ibanResponse.data.value
    shopAccountHolder.value = accountHolderResponse.data.value
  } catch (err) {
    console.error('Error fetching shop settings:', err)
    // Keep default values if API fails
  }
}

const hasPayment = computed(() => payment.value !== null)

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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

const submitPayment = async () => {
  if (!order.value) return
  
  submittingPayment.value = true
  paymentError.value = ''
  paymentSuccess.value = ''
  
  try {
    const formData = new FormData()
    formData.append('payment_method', paymentMethod.value)
    formData.append('payment_reference', paymentReference.value || order.value.order_number)
    
    if (selectedFile.value) {
      formData.append('screenshot', selectedFile.value)
    }
    
    await postFormData(`/payments/orders/${order.value.order_number}`, formData)
    
    paymentSuccess.value = 'Payment proof submitted successfully!'
    await fetchPayment()
  } catch (err: any) {
    paymentError.value = err.response?._data?.message || 'Failed to submit payment proof. Please try again.'
    console.error('Error submitting payment:', err)
  } finally {
    submittingPayment.value = false
  }
}
</script>
