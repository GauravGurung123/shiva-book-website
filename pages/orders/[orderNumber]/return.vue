<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <NuxtLink :to="`/orders/${orderNumber}`" class="text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Order
        </NuxtLink>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-800 mb-8 font-heading">Request Return</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Return Form -->
      <div v-else-if="order" class="bg-white rounded-lg shadow p-6">
        <form @submit.prevent="submitReturnRequest" class="space-y-6">
          <!-- Order Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-600"><strong>Order:</strong> {{ order.order_number }}</p>
            <p class="text-sm text-gray-600"><strong>Total:</strong> €{{ parseFloat(order.total || order.total_amount || 0).toFixed(2) }}</p>
          </div>
          
          <!-- Return Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Return Type <span class="text-red-500">*</span></label>
            <select 
              v-model="returnType"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            >
              <option value="">Select return type</option>
              <option value="withdrawal">Withdrawal - Changed my mind</option>
              <option value="defective">Defective - Item has defects</option>
              <option value="damaged">Damaged - Item arrived damaged</option>
              <option value="incorrect_item">Incorrect Item - Wrong item received</option>
            </select>
          </div>
          
          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason <span class="text-red-500">*</span></label>
            <textarea 
              v-model="reason"
              required
              rows="4"
              placeholder="Please explain why you want to return this item..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
            ></textarea>
          </div>
          
          <!-- Items to Return -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Items to Return <span class="text-red-500">*</span></label>
            <div class="space-y-3">
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="flex items-center gap-4 p-4 border rounded-lg"
                :class="selectedItems.has(item.id) ? 'border-primary-600 bg-primary-50' : 'border-gray-200'"
              >
                <input 
                  type="checkbox"
                  :id="`item-${item.id}`"
                  :checked="selectedItems.has(item.id)"
                  @change="toggleItem(item.id)"
                  class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div class="w-16 h-20 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded flex items-center justify-center border border-primary-200">
                  <img 
                    v-if="item.book?.photo_url || item.book?.coverImage" 
                    :src="item.book.photo_url || item.book.coverImage" 
                    :alt="item.book.title"
                    class="w-full h-full object-cover rounded"
                  />
                  <span v-else class="text-gray-400 text-xs">No Image</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-800">{{ item.book.title }}</p>
                  <p class="text-sm text-gray-600">{{ item.book.author || '' }}</p>
                  <p class="text-sm text-gray-600">Qty: {{ item.quantity }} - €{{ item.subtotal.toFixed(2) }}</p>
                </div>
                <div v-if="selectedItems.has(item.id)" class="flex items-center gap-2">
                  <label class="text-sm text-gray-600">Return Qty:</label>
                  <input 
                    type="number"
                    :value="itemQuantities[item.id]"
                    @input="updateQuantity(item.id, $event)"
                    min="1"
                    :max="item.quantity"
                    class="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
            <p v-if="selectedItems.size === 0" class="text-red-600 text-sm mt-2">Please select at least one item to return</p>
          </div>
          
          <!-- Attachments -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
            <p class="text-sm text-gray-500 mb-3">Upload screenshots or photos showing the issue (max 5 files)</p>
            <input 
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileChange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            />
            <div v-if="attachments.length > 0" class="mt-3 flex flex-wrap gap-2">
              <div 
                v-for="(file, index) in attachments" 
                :key="index"
                class="relative inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                <span>{{ file.name }}</span>
                <button 
                  type="button"
                  @click="removeAttachment(index)"
                  class="text-red-600 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Submit Button -->
          <div class="flex items-center gap-4">
            <button 
              type="submit"
              :disabled="submitting || selectedItems.size === 0"
              class="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Submitting...' : 'Submit Return Request' }}
            </button>
            <NuxtLink 
              :to="`/orders/${orderNumber}`"
              class="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Cancel
            </NuxtLink>
          </div>
        </form>
        
        <div v-if="submitError" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600">{{ submitError }}</p>
        </div>
        
        <div v-if="submitSuccess" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-600">{{ submitSuccess }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, ReturnRequestItem, CreateReturnRequestData } from '~/types'

const route = useRoute()
const { get, post, postFormData } = useApi()
const { isAuthenticated } = useAuth()

const orderNumber = route.params.orderNumber as string

const order = ref<Order | null>(null)
const loading = ref(false)
const error = ref('')

// Form state
const returnType = ref<ReturnType | ''>('')
const reason = ref('')
const selectedItems = ref<Set<number>>(new Set())
const itemQuantities = ref<Record<number, number>>({})
const attachments = ref<File[]>([])
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref('')

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/login')
}

onMounted(async () => {
  await fetchOrder()
})

const fetchOrder = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await get<{ data: Order }>(`/orders/${orderNumber}`)
    order.value = response.data
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to load order. Please try again.'
    console.error('Error fetching order:', err)
  } finally {
    loading.value = false
  }
}

const toggleItem = (itemId: number) => {
  if (selectedItems.value.has(itemId)) {
    selectedItems.value.delete(itemId)
    delete itemQuantities.value[itemId]
  } else {
    selectedItems.value.add(itemId)
    const item = order.value?.items.find(i => i.id === itemId)
    if (item) {
      itemQuantities.value[itemId] = item.quantity
    }
  }
}

const updateQuantity = (itemId: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)
  const item = order.value?.items.find(i => i.id === itemId)
  
  if (item && value >= 1 && value <= item.quantity) {
    itemQuantities.value[itemId] = value
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    if (attachments.value.length + newFiles.length <= 5) {
      attachments.value = [...attachments.value, ...newFiles]
      submitError.value = ''
    } else {
      submitError.value = 'You can upload a maximum of 5 files'
    }
    target.value = ''
  }
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

const submitReturnRequest = async () => {
  if (selectedItems.value.size === 0) {
    submitError.value = 'Please select at least one item to return'
    return
  }
  
  if (!returnType.value || !reason.value) {
    submitError.value = 'Please fill in all required fields'
    return
  }
  
  submitting.value = true
  submitError.value = ''
  submitSuccess.value = ''
  
  try {
    const items: ReturnRequestItem[] = Array.from(selectedItems.value).map(itemId => ({
      order_item_id: itemId,
      quantity: itemQuantities.value[itemId] || 1
    }))
    
    const data: CreateReturnRequestData = {
      order_id: order.value!.id,
      type: returnType.value,
      reason: reason.value,
      items
    }
    
    if (attachments.value.length > 0) {
      const formData = new FormData()
      formData.append('order_id', data.order_id.toString())
      formData.append('type', data.type)
      formData.append('reason', data.reason)
      
      data.items.forEach((item, index) => {
        formData.append(`items[${index}][order_item_id]`, item.order_item_id.toString())
        formData.append(`items[${index}][quantity]`, item.quantity.toString())
      })
      
      attachments.value.forEach((file) => {
        formData.append('attachments[]', file)
      })
      
      await postFormData('/return-requests', formData)
    } else {
      await post('/return-requests', data)
    }
    
    submitSuccess.value = 'Return request submitted successfully! Redirecting to your return requests...'
    
    setTimeout(() => {
      navigateTo('/returns')
    }, 2000)
  } catch (err: any) {
    submitError.value = err.response?._data?.message || 'Failed to submit return request. Please try again.'
    console.error('Error submitting return request:', err)
  } finally {
    submitting.value = false
  }
}

type ReturnType = 'withdrawal' | 'defective' | 'damaged' | 'incorrect_item'
</script>
