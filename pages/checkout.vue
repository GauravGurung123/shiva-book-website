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
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Address Selection -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6 font-heading">Shipping Address</h2>
            
            <!-- Loading Addresses -->
            <div v-if="loadingAddresses" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            
            <!-- No Addresses -->
            <div v-else-if="!addresses || addresses.length === 0" class="text-center py-8">
              <p class="text-gray-600 mb-4">No addresses found. Please add an address first.</p>
              <NuxtLink to="/account/address" class="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-700 transition">
                Add Address
              </NuxtLink>
            </div>
            
            <!-- Address List -->
            <div v-else class="space-y-3">
              <div 
                v-for="address in addresses" 
                :key="address.id"
                @click="selectedShippingAddress = address.id;shippingCountryUuid = address.country_uuid"
                class="p-4 border rounded-lg cursor-pointer transition"
                :class="selectedShippingAddress === address.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-1">
                    <div 
                      class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      :class="selectedShippingAddress === address.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'"
                    >
                      <div v-if="selectedShippingAddress === address.id" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-800">{{ address.full_name }}</p>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ address.address_line_1 }}<br v-if="address.address_line_2" />
                      {{ address.address_line_2 }}<br v-if="address.address_line_2" />
                      {{ address.city }}, {{ address.state }} {{ address.postal_code }}<br />
                      {{ address.country }}
                    </p>
                    <p v-if="address.phone" class="text-sm text-gray-600 mt-1">{{ address.phone }}</p>
                  </div>
                  <span v-if="address.is_default" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Billing Address -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-800 font-heading">Billing Address</h2>
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="sameAsShipping"
                  class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span class="text-sm text-gray-600">Same as shipping</span>
              </label>
            </div>
            
            <!-- Loading Addresses -->
            <div v-if="loadingAddresses" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            
            <!-- No Addresses -->
            <div v-else-if="!addresses || addresses.length === 0" class="text-center py-8">
              <p class="text-gray-600 mb-4">No addresses found. Please add an address first.</p>
              <NuxtLink to="/account/address" class="inline-block bg-primary-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-700 transition">
                Add Address
              </NuxtLink>
            </div>
            
            <!-- Address List (hidden if same as shipping) -->
            <div v-else-if="!sameAsShipping" class="space-y-3">
              <div 
                v-for="address in addresses" 
                :key="address.id"
                @click="selectedBillingAddress = address.id"
                class="p-4 border rounded-lg cursor-pointer transition"
                :class="selectedBillingAddress === address.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="flex items-start gap-3">
                  <div class="mt-1">
                    <div 
                      class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      :class="selectedBillingAddress === address.id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'"
                    >
                      <div v-if="selectedBillingAddress === address.id" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-800">{{ address.full_name }}</p>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ address.address_line_1 }}<br v-if="address.address_line_2" />
                      {{ address.address_line_2 }}<br v-if="address.address_line_2" />
                      {{ address.city }}, {{ address.state }} {{ address.postal_code }}<br />
                      {{ address.country }}
                    </p>
                    <p v-if="address.phone" class="text-sm text-gray-600 mt-1">{{ address.phone }}</p>
                  </div>
                  <span v-if="address.is_default" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>
                </div>
              </div>
            </div>
            
            <div v-else class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Billing address will be the same as shipping address</p>
            </div>
          </div>
          
          <!-- Order Items -->
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
                <span v-if="loadingShippingFee">Calculating...</span>
                <span v-else-if="shippingFee > 0">€{{ shippingFee.toFixed(2) }}</span>
                <span v-else>Select shipping address</span>
              </div>
              <div class="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>€{{ (parseFloat(cart.total || 0) - discountAmount + shippingFee).toFixed(2) }}</span>
              </div>
            </div>
            
            <button 
              @click="proceedToOrder"
              :disabled="!selectedShippingAddress || (!sameAsShipping && !selectedBillingAddress)"
              class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Proceed to Order
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
import type { CartItem, Address } from '~/types'

const { cart, loading, error, fetchCart, itemCount, updateQuantity } = useCart()
const { isAuthenticated } = useAuth()
const { get } = useApi()

const discountCode = ref('')
const discountAmount = ref(0)
const applyingDiscount = ref(false)
const discountError = ref('')
const discountSuccess = ref('')
const shippingCountryUuid = ref<string | null>(null)
const shippingFee = ref(0)
const loadingShippingFee = ref(false)
const updatingQuantity = ref(false)

// Address selection
const addresses = ref<Address[]>([])
const loadingAddresses = ref(false)
const selectedShippingAddress = ref<number | null>(null)
const selectedBillingAddress = ref<number | null>(null)
const sameAsShipping = ref(true)

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/login')
}

onMounted(async () => {
  await fetchCart()
  await fetchAddresses()
})

const fetchAddresses = async () => {
  loadingAddresses.value = true
  try {
    const response = await get<{ data: Address[] }>('/addresses')
    addresses.value = response.data
    
    // Select default address for shipping
    const defaultAddress = addresses.value.find(addr => addr.is_default)
    if (defaultAddress) {
      selectedShippingAddress.value = defaultAddress.id
      selectedBillingAddress.value = defaultAddress.id
      shippingCountryUuid.value = defaultAddress.country_uuid
    } else if (addresses.value.length > 0) {
      selectedShippingAddress.value = addresses.value[0].id
      selectedBillingAddress.value = addresses.value[0].id
      shippingCountryUuid.value = addresses.value[0].country_uuid
    }
  } catch (err) {
    console.error('Error fetching addresses:', err)
  } finally {
    loadingAddresses.value = false
  }
}

// Sync billing address with shipping when sameAsShipping changes
watch(sameAsShipping, (newValue) => {
  if (newValue && selectedShippingAddress.value) {
    selectedBillingAddress.value = selectedShippingAddress.value
  }
})

watch(selectedShippingAddress, (newValue) => {
  if (sameAsShipping.value && newValue) {
    selectedBillingAddress.value = newValue
  }
})

// Watch shippingCountryUuid to recalculate shipping fee
watch([shippingCountryUuid, cart], () => {
  if (shippingCountryUuid.value && cart.value?.items.length > 0) {
    fetchShippingFee()
  } else {
    shippingFee.value = 0
  }
}, { deep: true })

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

const fetchShippingFee = async () => {
  if (!shippingCountryUuid.value || !cart.value?.items.length) {
    shippingFee.value = 0
    return
  }
  
  loadingShippingFee.value = true
  try {
    const { post } = useApi()
    const quantity = cart.value.items.reduce((sum, item) => sum + item.quantity, 0)
    const response = await post<{ data: { shipping_fee: number } }>('/shipping/calculate', {
      country_uuid: shippingCountryUuid.value,
      quantity: quantity
    })
    console.log('Shipping fee response:', response.data.shipping_fee)
    shippingFee.value = response.data.shipping_fee
  } catch (err) {
    console.error('Error calculating shipping fee:', err)
    shippingFee.value = 0
  } finally {
    loadingShippingFee.value = false
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

const proceedToOrder = async () => {
  if (!selectedShippingAddress.value || (!sameAsShipping.value && !selectedBillingAddress.value)) {
    error.value = 'Please select shipping and billing addresses'
    return
  }
  
  try {
    loading.value = true
    error.value = null
    
    // Create order via API
    const { post } = useApi()
    const response = await post<{ data: any }>('/orders', {
      shipping_address_id: selectedShippingAddress.value,
      billing_address_id: sameAsShipping.value ? selectedShippingAddress.value : selectedBillingAddress.value,
      notes: ''
    })
    
    const order = response.data
    
    // Navigate to order confirmation page with order number
    await navigateTo(`/orders/${order.order_number}`)
  } catch (err: any) {
    error.value = err.response?._data?.message || 'Failed to create order. Please try again.'
    console.error('Error creating order:', err)
  } finally {
    loading.value = false
  }
}
</script>
