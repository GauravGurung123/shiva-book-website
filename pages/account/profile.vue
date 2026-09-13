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
          <span class="text-gray-800 font-medium">My Profile</span>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center space-x-4 mb-6">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">{{ user?.name || 'User' }}</h3>
                <p class="text-gray-600 text-sm">{{ user?.email || '' }}</p>
              </div>
            </div>

            <nav class="space-y-2">
              <button
                @click="activeTab = 'personal'"
                :class="[
                  'w-full text-left px-4 py-2 rounded-lg transition',
                  activeTab === 'personal' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                ]"
              >
                Personal Information
              </button>
              <button
                @click="activeTab = 'password'"
                :class="[
                  'w-full text-left px-4 py-2 rounded-lg transition',
                  activeTab === 'password' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                ]"
              >
                Password
              </button>
              <button
                @click="activeTab = 'preferences'"
                :class="[
                  'w-full text-left px-4 py-2 rounded-lg transition',
                  activeTab === 'preferences' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                ]"
              >
                Preferences
              </button>
              <button
                @click="activeTab = 'delete'"
                :class="[
                  'w-full text-left px-4 py-2 rounded-lg transition',
                  activeTab === 'delete' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100 text-red-600'
                ]"
              >
                Delete Account
              </button>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2">
          <!-- Personal Information -->
          <div v-if="activeTab === 'personal'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
            
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+351 912 345 678"
                />
              </div>

              <button
                type="submit"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>

          <!-- Password -->
          <div v-if="activeTab === 'password'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
            
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Current Password</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">New Password</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Update Password
              </button>
            </form>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Preferences</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 class="font-medium text-gray-800">Email Notifications</h3>
                  <p class="text-gray-600 text-sm">Receive order updates and promotional emails</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="preferences.emailNotifications" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 class="font-medium text-gray-800">SMS Notifications</h3>
                  <p class="text-gray-600 text-sm">Receive order updates via SMS</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="preferences.smsNotifications" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 class="font-medium text-gray-800">Newsletter Subscription</h3>
                  <p class="text-gray-600 text-sm">Subscribe to our newsletter for offers and updates</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="preferences.newsletter" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <button
                @click="handleSavePreferences"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Save Preferences
              </button>
            </div>
          </div>

          <!-- Delete Account -->
          <div v-if="activeTab === 'delete'" class="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
            <h2 class="text-xl font-bold text-red-600 mb-6">Delete Account</h2>
            
            <div class="space-y-4">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 class="font-medium text-red-800 mb-2">Warning: This action cannot be undone</h3>
                <p class="text-red-700 text-sm">
                  Deleting your account will permanently remove all your data including:
                </p>
                <ul class="text-red-700 text-sm mt-2 list-disc list-inside">
                  <li>Order history</li>
                  <li>Saved addresses</li>
                  <li>Personal information</li>
                  <li>Preferences and settings</li>
                </ul>
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Type "DELETE" to confirm</label>
                <input
                  v-model="deleteConfirmation"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="DELETE"
                />
              </div>

              <button
                @click="handleDeleteAccount"
                :disabled="deleteConfirmation !== 'DELETE'"
                :class="[
                  'px-6 py-2 rounded-lg font-semibold transition',
                  deleteConfirmation === 'DELETE'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuth()
const router = useRouter()

const activeTab = ref('personal')
const loading = ref(false)

const profileForm = ref({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = ref({
  emailNotifications: true,
  smsNotifications: false,
  newsletter: true
})

const deleteConfirmation = ref('')

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

  // Initialize form with user data
  profileForm.value = {
    name: user.value.name || '',
    email: user.value.email || '',
    phone: user.value.phone || ''
  }
})

const handleUpdateProfile = async () => {
  loading.value = true
  try {
    // TODO: Implement profile update API call
    alert('Profile update functionality to be implemented')
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  
  loading.value = true
  try {
    // TODO: Implement password change API call
    alert('Password change functionality to be implemented')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    loading.value = false
  }
}

const handleSavePreferences = async () => {
  loading.value = true
  try {
    // TODO: Implement preferences save API call
    alert('Preferences saved successfully')
  } catch (error) {
    console.error('Failed to save preferences:', error)
  } finally {
    loading.value = false
  }
}

const handleDeleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') {
    return
  }
  
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return
  }
  
  loading.value = true
  try {
    // TODO: Implement account deletion API call
    alert('Account deletion functionality to be implemented')
  } catch (error) {
    console.error('Failed to delete account:', error)
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default'
})
</script>
