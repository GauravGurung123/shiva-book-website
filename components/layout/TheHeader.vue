<template>
  <header class="bg-white shadow-sm sticky top-0 z-50 border-b border-primary-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <img 
              :src="siteLogo" 
              :alt="`${siteName} Logo`" 
              class="h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </NuxtLink>
        </div>
        
        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink 
            v-for="link in navigationLinks" 
            :key="link.href"
            :to="link.href" 
            class="text-gray-700 hover:text-primary-600 transition font-medium relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all hover:after:w-full"
            active-class="text-primary-600 after:w-full"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        
        <!-- Auth & Cart -->
        <div class="flex items-center space-x-4">
          <!-- Show login link when not authenticated -->
          <NuxtLink 
            v-if="!isAuthenticated" 
            to="/login" 
            class="text-gray-700 hover:text-primary-600 transition font-medium font-heading"
          >
            Login
          </NuxtLink>
          
          <!-- Show user profile when authenticated -->
          <div v-else class="flex items-center space-x-3">
            <NuxtLink 
              to="/account/overview" 
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
            >
              <!-- User avatar or default -->
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                <img 
                  v-if="user?.photo_url" 
                  :src="user.photo_url" 
                  :alt="user.name"
                  class="w-full h-full object-cover"
                />
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="font-medium font-heading hidden sm:inline">{{ user?.name }}</span>
            </NuxtLink>
          </div>
          
          <!-- Cart button -->
          <button class="relative text-gray-700 hover:text-primary-600 transition p-2 rounded-full hover:bg-primary-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {{ cartCount }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavigationLink } from '~/types'

const { isAuthenticated, user } = useAuth()
const { getSetting, fetchMultipleSettings } = useSettings()

const siteLogo = ref('/logo.png')
const siteName = ref('NepaliBookInEurope')

const navigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Authors', href: '/authors' },
  { label: 'Publishers', href: '/publishers' },
  { label: 'Books', href: '/books' },
  { label: 'Blog', href: '/blog' },
  { label: 'Featured', href: '/featured' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

const cartCount = ref(0)

onMounted(async () => {
  await fetchMultipleSettings(['site_logo', 'site_name'])
  siteLogo.value = getSetting('site_logo', '/logo.png')
  siteName.value = getSetting('site_name', 'NepaliBookInEurope')
})
</script>
