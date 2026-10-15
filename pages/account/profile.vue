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
                  disabled
                />
              </div>

              <div>
                <label class="block text-gray-700 font-medium mb-2">Mobile Number</label>
                <input
                  v-model="profileForm.mobile_no"
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

              <div v-if="passwordMessage" :class="[
                'mt-4 p-4 rounded-lg',
                passwordMessageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              ]">
                {{ passwordMessage }}
              </div>
            </form>
          </div>

          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-6">Preferences</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 class="font-medium text-gray-800">Email Notifications</h3>
                  <p class="text-gray-600 text-sm">Receive transactional emails</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="preferences.emailNotifications" disabled class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

<!--              <div class="flex items-center justify-between p-4 border rounded-lg">-->
<!--                <div>-->
<!--                  <h3 class="font-medium text-gray-800">SMS Notifications</h3>-->
<!--                  <p class="text-gray-600 text-sm">Receive order updates via SMS</p>-->
<!--                </div>-->
<!--                <label class="relative inline-flex items-center cursor-pointer">-->
<!--                  <input type="checkbox" v-model="preferences.smsNotifications" class="sr-only peer" />-->
<!--                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>-->
<!--                </label>-->
<!--              </div>-->

<!--              <div class="flex items-center justify-between p-4 border rounded-lg">-->
<!--                <div>-->
<!--                  <h3 class="font-medium text-gray-800">Newsletter Subscription</h3>-->
<!--                  <p class="text-gray-600 text-sm">Subscribe to our newsletter for offers and updates</p>-->
<!--                </div>-->
<!--                <label class="relative inline-flex items-center cursor-pointer">-->
<!--                  <input type="checkbox" v-model="preferences.newsletter" class="sr-only peer" />-->
<!--                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>-->
<!--                </label>-->
<!--              </div>-->

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

              <div>
                <label class="block text-gray-700 font-medium mb-2">Enter your password</label>
                <input
                  v-model="deletePassword"
                  type="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Your password"
                />
              </div>

              <div v-if="deleteMessage" :class="[
                'p-4 rounded-lg',
                deleteMessageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              ]">
                {{ deleteMessage }}
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
  mobile_no: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordMessage = ref('')
const passwordMessageType = ref<'success' | 'error' | ''>('')

const preferences = ref({
  emailNotifications: true,
  smsNotifications: false,
  newsletter: true
})

const deleteConfirmation = ref('')
const deletePassword = ref('')
const deleteMessage = ref('')
const deleteMessageType = ref<'success' | 'error' | ''>('')

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
    mobile_no: user.value.mobile_no || ''
  }
})

// Watch for user data changes to update form
watch(user, (newUser) => {
  if (newUser) {
    profileForm.value = {
      name: newUser.name || '',
      email: newUser.email || '',
      mobile_no: newUser.mobile_no || ''
    }
  }
}, { immediate: true })

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
  passwordMessage.value = ''
  passwordMessageType.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordMessage.value = 'Passwords do not match'
    passwordMessageType.value = 'error'
    return
  }

  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
    passwordMessage.value = 'Please fill in all password fields'
    passwordMessageType.value = 'error'
    return
  }
  
  loading.value = true
  try {
    const { post } = useApi()
    await post('auth/change-password', {
      current_password: passwordForm.value.currentPassword,
      password: passwordForm.value.newPassword,
      password_confirmation: passwordForm.value.confirmPassword
    })
    
    passwordMessage.value = 'Password changed successfully'
    passwordMessageType.value = 'success'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Failed to change password:', error)
    passwordMessage.value = 'Failed to change password. Please check your current password and try again.'
    passwordMessageType.value = 'error'
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
  deleteMessage.value = ''
  deleteMessageType.value = ''

  if (deleteConfirmation.value !== 'DELETE') {
    return
  }

  if (!deletePassword.value) {
    deleteMessage.value = 'Please enter your password to delete your account'
    deleteMessageType.value = 'error'
    return
  }
  
  loading.value = true
  try {
    const { post } = useApi()
    await post('/auth/delete-account', {
      password: deletePassword.value,
      confirmation: true
    })
    
    deleteMessage.value = 'Account deleted successfully'
    deleteMessageType.value = 'success'
    
    // Clear cookies and redirect to home
    const accessToken = useCookie('access_token')
    const sessionId = useCookie('session_id')
    accessToken.value = null
    sessionId.value = null
    
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } catch (error) {
    console.error('Failed to delete account:', error)
    deleteMessage.value = 'Failed to delete account. Please check your password and try again.'
    deleteMessageType.value = 'error'
  } finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'default'
})
</script>
