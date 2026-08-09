<template>
  <header class="bg-white shadow-sm sticky top-0 z-50 border-b border-primary-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="NepaliBookInEurope Logo" 
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
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        
        <!-- Auth & Cart -->
        <div class="flex items-center space-x-4">
          <NuxtLink to="/login" class="text-gray-700 hover:text-primary-600 transition font-medium font-heading">
            Login
          </NuxtLink>
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

const navigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'Authors', href: '/authors' },
  { label: 'Publishers', href: '/publishers' },
  { label: 'Books', href: '/books' },
  { label: 'Featured', href: '/featured' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
]

const cartCount = ref(0)
</script>
