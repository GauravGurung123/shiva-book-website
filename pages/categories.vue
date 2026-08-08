<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center font-heading">Browse by Category</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center border border-gray-100 hover:border-primary-200 group"
        >
          <div class="text-3xl mb-2">{{ category.icon }}</div>
          <h3 class="font-semibold text-gray-700 group-hover:text-primary-600 transition font-heading">{{ category.name }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategories } from '~/composables/useCategories'

const { fetchAllCategories } = useCategories()

const categories = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadCategories = async () => {
  loading.value = true
  error.value = null
  
  try {
    categories.value = await fetchAllCategories()
  } catch (err: any) {
    error.value = err.message || 'Failed to load categories'
    console.error('Error loading categories:', err)
  } finally {
    loading.value = false
  }
}

// Load all categories on mount
onMounted(() => {
  loadCategories()
})

definePageMeta({
  layout: 'default'
})
</script>
