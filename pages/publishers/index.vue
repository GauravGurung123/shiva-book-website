<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center font-heading">Browse by Publisher</h1>
      
      <!-- Search and Filters -->
      <SearchAndFilters
        search-placeholder="Search publishers by name..."
        :show-category-filter="false"
        :show-price-filter="false"
        @search="handleSearch"
        @clear="handleClearFilters"
      />
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Publishers Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="publisher in publishers" 
            :key="publisher.id"
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center border border-gray-100 hover:border-primary-200 group"
          >
            <div class="w-20 h-20 mx-auto mb-4 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl font-bold text-primary-600 group-hover:from-primary-200 group-hover:to-primary-300 transition">
              📚
            </div>
            <h3 class="font-semibold text-gray-700 group-hover:text-primary-600 transition font-heading text-lg">{{ publisher.name }}</h3>
            <p v-if="publisher.description" class="text-gray-500 text-sm mt-2 line-clamp-2">{{ publisher.description }}</p>
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
        <div v-if="publishers.length === 0 && !loading" class="text-center py-12">
          <p class="text-gray-600 font-heading">No publishers found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePublishers } from '~/composables/usePublishers'
import SearchAndFilters from "~/components/common/SearchAndFilters.vue";

const { fetchPublishers } = usePublishers()

const publishers = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 25,
  total: 0
})

const currentFilters = ref({
  searchQuery: '',
  sortBy: 'newest'
})

const loadPublishers = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    // Map sortBy to API parameters
    let sortBy = 'id'
    let descending = false
    
    switch (currentFilters.value.sortBy) {
      case 'newest':
        sortBy = 'id'
        descending = true
        break
      case 'oldest':
        sortBy = 'id'
        descending = false
        break
      case 'name-asc':
        sortBy = 'name'
        descending = false
        break
      case 'name-desc':
        sortBy = 'name'
        descending = true
        break
      default:
        sortBy = 'id'
        descending = false
    }
    
    const result = await fetchPublishers(page, 25, sortBy, descending)
    publishers.value = result.publishers
    pagination.value = result.pagination
  } catch (err: any) {
    error.value = err.message || 'Failed to load publishers'
    console.error('Error loading publishers:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    loadPublishers(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSearch = (query: string, filters: any) => {
  currentFilters.value = {
    searchQuery: query,
    sortBy: filters.sortBy
  }
  loadPublishers(1)
}

const handleClearFilters = () => {
  currentFilters.value = {
    searchQuery: '',
    sortBy: 'newest'
  }
  loadPublishers(1)
}

// Load initial page
onMounted(() => {
  loadPublishers(1)
})

definePageMeta({
  layout: 'default'
})
</script>
