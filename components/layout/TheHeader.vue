<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-orange-600 hover:text-orange-700 transition">
            NepliBookInEurope
          </NuxtLink>
        </div>
        
        <!-- Navigation -->
        <nav class="hidden md:flex space-x-8">
          <NuxtLink 
            v-for="link in navigationLinks" 
            :key="link.href"
            :to="link.href" 
            class="text-gray-700 hover:text-orange-600 transition"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        
        <!-- Auth & Cart -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/login" class="text-gray-700 hover:text-orange-600 transition font-medium">
            Login
          </NuxtLink>
          <button class="relative text-gray-700 hover:text-orange-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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

const navigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Featured', href: '/featured' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

const cartCount = ref(0)
</script>
