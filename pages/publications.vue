<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center font-heading">Browse by Publication</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Publications Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="publication in publications" 
            :key="publication.id"
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center border border-gray-100 hover:border-primary-200 group"
          >
            <div class="w-20 h-20 mx-auto mb-4 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl font-bold text-primary-600 group-hover:from-primary-200 group-hover:to-primary-300 transition">
              📚
            </div>
            <h3 class="font-semibold text-gray-700 group-hover:text-primary-600 transition font-heading text-lg">{{ publication.name }}</h3>
            <p v-if="publication.description" class="text-gray-500 text-sm mt-2 line-clamp-2">{{ publication.description }}</p>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex justify-center items-center mt-8 space-x-2">
          <button 
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-heading"
          >
            Previous
          </button>
          
          <span class="text-gray-600 font-heading">
            Page {{ pagination.currentPage }} of {{ pagination.lastPage }} ({{ pagination.total }} total)
          </span>
          
          <button 
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === pagination.lastPage"
            class="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-heading"
          >
            Next
          </button>
        </div>
        
        <!-- Empty State -->
        <div v-if="publications.length === 0 && !loading" class="text-center py-12">
          <p class="text-gray-600 font-heading">No publications found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePublications } from '~/composables/usePublications'

const { fetchPublications } = usePublications()

const publications = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 25,
  total: 0
})

const loadPublications = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const result = await fetchPublications(page, 25, 'id', false)
    publications.value = result.publications
    pagination.value = result.pagination
  } catch (err: any) {
    error.value = err.message || 'Failed to load publications'
    console.error('Error loading publications:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    loadPublications(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Load initial page
onMounted(() => {
  loadPublications(1)
})

definePageMeta({
  layout: 'default'
})
</script>
