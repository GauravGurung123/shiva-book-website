<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-4">
        <nav class="text-sm text-gray-600">
          <span @click="router.push('/')" class="hover:text-primary-600 cursor-pointer">Homepage</span>
          <span class="mx-2">></span>
          <span @click="router.push('/account/overview')" class="hover:text-primary-600 cursor-pointer">My page</span>
          <span class="mx-2">></span>
          <span class="text-gray-800 font-medium">My Address</span>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800">My Addresses</h1>
      </div>

      <!-- Address Cards Grid -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Loading addresses...</p>
      </div>

      <div v-else-if="addresses.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No addresses saved</h3>
        <p class="text-gray-600 mb-4">You haven't saved any addresses yet.</p>
        <button
          @click="openAddressModal()"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          Add Your First Address
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Address Cards -->
        <div
          v-for="address in addresses"
          :key="address.id"
          class="bg-white rounded-lg shadow-md p-6 relative hover:shadow-lg transition"
          :class="{ 'border-2 border-primary-500': address.is_default }"
        >
          <!-- Default Badge -->
          <div v-if="address.is_default" class="absolute top-4 right-4 bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded">
            Default
          </div>

          <!-- Address Label -->
          <h3 class="font-semibold text-gray-800 mb-2">{{ address.label || 'Address' }}</h3>

          <!-- Address Details -->
          <div class="space-y-1 text-gray-600 text-sm mb-4">
            <p>{{ address.address_line1 }}</p>
            <p v-if="address.address_line2">{{ address.address_line2 }}</p>
            <p>{{ address.city }}, {{ address.state }}</p>
            <p>{{ address.postal_code }}</p>
            <p>{{ address.country_data?.common_name || address.country }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2 pt-4 border-t">
            <button
              @click="openAddressModal(address)"
              class="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Edit
            </button>
            <button
              v-if="!address.is_default"
              @click="handleSetDefault(address.id)"
              class="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Set Default
            </button>
            <button
              @click="handleDelete(address.id)"
              class="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Form Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>
          
          <!-- Modal -->
          <div
            class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-6 border-b border-gray-200 flex-shrink-0">
              <h2 class="text-xl py-2 font-semibold text-gray-900">
                {{ editingAddress ? 'Edit Address' : 'Add a new address' }}
              </h2>
              <button
                @click="closeModal"
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="overflow-y-auto px-6 py-4 max-h-[calc(90vh-140px)]">
              <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Country, Full Name, Phone Number in same row -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Country *</label>
                <select
                  v-model="addressForm.country_uuid"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select</option>
                  <option
                    v-for="country in countries"
                    :key="country.uuid"
                    :value="country.uuid"
                  >
                    {{ country.flag_emoji }} {{ country.common_name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Full Name *</label>
                <input
                  v-model="addressForm.label"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Phone</label>
                <input
                  v-model="addressForm.extra.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+351 912 345 678"
                />
              </div>
            </div>

            <!-- Address Line 1 -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Address Line 1 *</label>
              <input
                v-model="addressForm.address_line1"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Street address, apartment, etc."
              />
            </div>

            <!-- Address Line 2 -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Address Line 2</label>
              <input
                v-model="addressForm.address_line2"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            <!-- Postcode, City, Province in same row -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Postcode *</label>
                <input
                  v-model="addressForm.postal_code"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Postal code"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">City *</label>
                <input
                  v-model="addressForm.city"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Province/State *</label>
                <input
                  v-model="addressForm.state"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="State"
                />
              </div>
            </div>

            <!-- NIF (Optional - for specific regions) -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">NIF / Tax ID (Optional)</label>
              <input
                v-model="addressForm.extra.nif"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tax identification number"
              />
            </div>

            <!-- Delivery Instructions -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">Delivery Instructions (Optional)</label>
              <textarea
                v-model="addressForm.extra.delivery_instructions"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Any special delivery instructions"
              ></textarea>
            </div>

            <!-- Set as Default Checkbox -->
            <div class="flex items-center">
              <input
                id="is_default"
                v-model="addressForm.is_default"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label for="is_default" class="ml-2 text-gray-700">
                Make this my default address
              </label>
            </div>

            <!-- Submit Button -->
            <div class="flex space-x-4 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address') }}
              </button>
            </div>
          </form>
        </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

<script setup lang="ts">
import type { Address, Country, AddressFormData } from '~/composables/useAddress'

const { user, fetchUser } = useAuth()
const { getAddresses, getCountries, createAddress, updateAddress, setDefaultAddress, deleteAddress } = useAddress()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const showModal = ref(false)
const editingAddress = ref<Address | null>(null)
const addresses = ref<Address[]>([])
const countries = ref<Country[]>([])

const addressForm = ref<AddressFormData>({
  label: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country_uuid: '',
  is_default: false,
  extra: {
    phone: '',
    nif: '',
    delivery_instructions: ''
  }
})

onMounted(async () => {
  const accessToken = useCookie('access_token')
  
  if (!accessToken.value) {
    router.push('/login')
    return
  }
  
  if (!user.value && accessToken.value) {
    try {
      await fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/login')
      return
    }
  }
  
  if (!user.value) {
    router.push('/login')
    return
  }

  await loadAddresses()
  await loadCountries()
})

const loadAddresses = async () => {
  try {
    const response = await getAddresses()
    addresses.value = response?.data
  } catch (error) {
    console.error('Failed to load addresses:', error)
  } finally {
    loading.value = false
  }
}

const loadCountries = async () => {
  try {
    const response = await getCountries('Europe')
    countries.value = response?.data
  } catch (error) {
    console.error('Failed to load countries:', error)
  }
}

const openAddressModal = (address: Address | null = null) => {
  editingAddress.value = address
  
  if (address) {
    addressForm.value = {
      label: address.label,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country_uuid: address.country_uuid,
      is_default: address.is_default,
      extra: address.extra || {
        phone: '',
        nif: '',
        delivery_instructions: ''
      }
    }
  } else {
    addressForm.value = {
      label: user.value?.name || '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country_uuid: '',
      is_default: false,
      extra: {
        phone: '',
        nif: '',
        delivery_instructions: ''
      }
    }
  }
  
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingAddress.value = null
  addressForm.value = {
    label: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country_uuid: '',
    is_default: false,
    extra: {
      phone: '',
      nif: '',
      delivery_instructions: ''
    }
  }
}

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    if (editingAddress.value) {
      await updateAddress(editingAddress.value.id, addressForm.value)
    } else {
      await createAddress(addressForm.value)
    }
    
    await loadAddresses()
    closeModal()
  } catch (error) {
    console.error('Failed to save address:', error)
    alert('Failed to save address. Please try again.')
  } finally {
    submitting.value = false
  }
}

const handleSetDefault = async (id: number) => {
  try {
    await setDefaultAddress(id)
    await loadAddresses()
  } catch (error) {
    console.error('Failed to set default address:', error)
    alert('Failed to set default address. Please try again.')
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this address?')) {
    return
  }
  
  try {
    await deleteAddress(id)
    await loadAddresses()
  } catch (error) {
    console.error('Failed to delete address:', error)
    alert('Failed to delete address. Please try again.')
  }
}

definePageMeta({
  layout: 'default'
})
</script>
