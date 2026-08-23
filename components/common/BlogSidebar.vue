<template>
  <div class="space-y-6">
    <!-- Featured Books Section -->
    <div class="bg-white rounded-lg shadow border border-gray-100 p-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4 font-heading flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Featured Books
      </h3>
      
      <div v-if="featuredLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="featuredError" class="text-center py-4 text-red-500 text-sm">
        {{ featuredError }}
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="book in featuredBooks"
          :key="book.id"
          class="flex items-start space-x-3 group cursor-pointer"
        >
          <div class="w-16 h-20 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded border border-primary-200 flex items-center justify-center overflow-hidden">
            <img
              v-if="book.coverImage"
              :src="book.coverImage"
              :alt="book.title"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xs text-gray-400">No Cover</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition font-heading line-clamp-2">
              {{ book.title }}
            </h4>
            <p class="text-gray-500 text-xs mt-1">{{ book.author }}</p>
            <p class="text-primary-600 font-bold text-sm mt-1">{{ book.price }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Newest Arrivals Section -->
    <div class="bg-white rounded-lg shadow border border-gray-100 p-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4 font-heading flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Newest Arrivals
      </h3>
      
      <div v-if="newArrivalsLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="newArrivalsError" class="text-center py-4 text-red-500 text-sm">
        {{ newArrivalsError }}
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="book in newArrivals"
          :key="book.id"
          class="flex items-start space-x-3 group cursor-pointer"
        >
          <div class="w-16 h-20 flex-shrink-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded border border-primary-200 flex items-center justify-center overflow-hidden">
            <img
              v-if="book.coverImage"
              :src="book.coverImage"
              :alt="book.title"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xs text-gray-400">No Cover</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-800 text-sm group-hover:text-primary-600 transition font-heading line-clamp-2">
              {{ book.title }}
            </h4>
            <p class="text-gray-500 text-xs mt-1">{{ book.author }}</p>
            <p class="text-primary-600 font-bold text-sm mt-1">{{ book.price }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Categories Section -->
    <div class="bg-white rounded-lg shadow border border-gray-100 p-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4 font-heading flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Categories
      </h3>
      
      <div v-if="categoriesLoading" class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else class="space-y-2">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="flex items-center justify-between text-gray-600 hover:text-primary-600 transition text-sm py-2 border-b border-gray-100 last:border-0"
        >
          <span class="flex items-center">
            <span class="mr-2">{{ category.icon }}</span>
            {{ category.name }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import { useCategories } from '~/composables/useCategories'

const { featuredBooks, newArrivals, loading: booksLoading, error: booksError } = useBooks()
const { categories, loading: categoriesLoading } = useCategories()

const featuredLoading = computed(() => booksLoading.value)
const featuredError = computed(() => booksError.value)
const newArrivalsLoading = computed(() => booksLoading.value)
const newArrivalsError = computed(() => booksError.value)
</script>
