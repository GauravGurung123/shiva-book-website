<template>
  <section id="categories" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Browse by Genre</h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center"
        >
          <div class="text-3xl mb-2">{{ category.icon }}</div>
          <h3 class="font-semibold text-gray-700">{{ category.name }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
  categories: Category[]
  loading?: boolean
  error?: string | null
}

defineProps<Props>()
</script>
