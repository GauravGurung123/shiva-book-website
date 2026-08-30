<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center font-heading">Browse All Books</h1>
      
      <!-- Search and Filters -->
      <SearchAndFilters
        :categories="categories"
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
      
      <!-- Books Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <BookCard 
            v-for="book in books" 
            :key="book.id" 
            :book="book"
          />
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
        <div v-if="books.length === 0 && !loading" class="text-center py-12">
          <p class="text-gray-600 font-heading">No books found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import { useCategories } from '~/composables/useCategories'
import BookCard from "~/components/common/BookCard.vue";
import SearchAndFilters from "~/components/common/SearchAndFilters.vue";

const { fetchBooks } = useBooks()
const { categories } = useCategories()

const books = ref<any[]>([])
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
  categories: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  sortBy: 'newest'
})

const loadBooks = async (page: number = 1) => {
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
        sortBy = 'title'
        descending = false
        break
      case 'name-desc':
        sortBy = 'title'
        descending = true
        break
      case 'price-asc':
        sortBy = 'price'
        descending = false
        break
      case 'price-desc':
        sortBy = 'price'
        descending = true
        break
    }
    
    const result = await fetchBooks(page, 25, sortBy, descending)
    books.value = result.books
    pagination.value = result.pagination
  } catch (err: any) {
    error.value = err.message || 'Failed to load books'
    console.error('Error loading books:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    loadBooks(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSearch = (query: string, filters: any) => {
  currentFilters.value = {
    searchQuery: query,
    categories: filters.categories,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy
  }
  loadBooks(1)
}

const handleClearFilters = () => {
  currentFilters.value = {
    searchQuery: '',
    categories: [],
    minPrice: null,
    maxPrice: null,
    sortBy: 'newest'
  }
  loadBooks(1)
}

// Load initial page
onMounted(() => {
  loadBooks(1)
})

definePageMeta({
  layout: 'default'
})
</script>
