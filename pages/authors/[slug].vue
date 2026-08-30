<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Author Header -->
      <div v-if="author" class="mb-8">
        <div class="flex items-center gap-6 mb-4">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-4xl font-bold text-primary-600">
            {{ getInitials(author.name) }}
          </div>
          <div>
            <h1 class="text-4xl font-bold text-gray-800 font-heading">{{ author.name }}</h1>
            <p class="text-gray-600 mt-1">{{ pagination.total }} books found</p>
            <p v-if="author.bio" class="text-gray-500 mt-2 max-w-2xl">{{ author.bio }}</p>
          </div>
        </div>
        <NuxtLink to="/authors" class="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Authors
        </NuxtLink>
      </div>
      
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Price Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div class="flex items-center gap-2">
              <input 
                v-model.number="filters.minPrice" 
                type="number" 
                placeholder="Min" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span class="text-gray-500">-</span>
              <input 
                v-model.number="filters.maxPrice" 
                type="number" 
                placeholder="Max" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <!-- Sort By -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select 
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
          </div>
          
          <!-- Sort Order -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <select 
              v-model="filters.sortOrder"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          
          <!-- Toggles -->
          <div class="flex items-end gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                v-model="filters.discountedOnly" 
                type="checkbox" 
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">Discounted Only</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                v-model="filters.inStockOnly" 
                type="checkbox" 
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>
        
        <!-- Apply Filters Button -->
        <div class="mt-4 flex gap-2">
          <button 
            @click="applyFilters"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            Apply Filters
          </button>
          <button 
            @click="clearFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
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
          <p class="text-gray-600 font-heading">No books found by this author.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import { useAuthors } from '~/composables/useAuthors'
import BookCard from "~/components/common/BookCard.vue";

const route = useRoute()
const { fetchBooksByAuthor } = useBooks()
const { fetchAllAuthors } = useAuthors()

const books = ref<any[]>([])
const author = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 12,
  total: 0
})

const filters = ref({
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  discountedOnly: false,
  inStockOnly: false,
  sortBy: 'newest',
  sortOrder: 'desc'
})

const loadAuthorBooks = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const slug = route.params.slug as string
    
    // Load author info from API response or fallback to authors list
    if (!author.value) {
      const allAuthors = await fetchAllAuthors()
      author.value = allAuthors.find((a: any) => a.slug === slug)
    }
    
    // Load books for this author with filters
    const result = await fetchBooksByAuthor(
      slug,
      page,
      12,
      filters.value.sortBy,
      filters.value.sortOrder,
      {
        minPrice: filters.value.minPrice,
        maxPrice: filters.value.maxPrice,
        discountedOnly: filters.value.discountedOnly,
        inStockOnly: filters.value.inStockOnly
      }
    )
    
    books.value = result.books
    
    // Update author info from API response if available
    if (result.author) {
      author.value = {
        ...author.value,
        ...result.author
      }
    }
    
    pagination.value = result.pagination
  } catch (err: any) {
    error.value = err.message || 'Failed to load author books'
    console.error('Error loading author books:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  loadAuthorBooks(1)
}

const clearFilters = () => {
  filters.value = {
    minPrice: undefined,
    maxPrice: undefined,
    discountedOnly: false,
    inStockOnly: false,
    sortBy: 'newest',
    sortOrder: 'desc'
  }
  loadAuthorBooks(1)
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    loadAuthorBooks(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getInitials = (name: string): string => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  
  const firstInitial = parts[0]?.charAt(0) || ''
  if (parts.length === 1) {
    return firstInitial.toUpperCase()
  }
  
  const lastInitial = parts[parts.length - 1]?.charAt(0) || ''
  return (firstInitial + lastInitial).toUpperCase()
}

// Load books when route changes
watch(() => route.params.slug, () => {
  author.value = null
  clearFilters()
})

// Load initial page
onMounted(() => {
  loadAuthorBooks(1)
})

definePageMeta({
  layout: 'default'
})
</script>
