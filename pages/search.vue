<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-gray-800 font-heading">
              {{ searchQuery ? `Results for "${searchQuery}"` : 'Search Books' }}
            </h1>
            <p v-if="pagination.total > 0" class="text-gray-600 mt-1">
              {{ pagination.total }} {{ pagination.total === 1 ? 'result' : 'results' }} found
            </p>
          </div>
          
          <!-- Search Input -->
          <div class="relative w-full md:w-96">
            <input
              v-model="localSearchQuery"
              type="text"
              placeholder="Search books..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @keydown.enter="performSearch"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Results Section -->
        <main class="flex-1">
          <!-- Sort Options -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Sort by:</span>
              <select
                v-model="filters.sortBy"
                @change="performSearch"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Title: A to Z</option>
                <option value="title_desc">Title: Z to A</option>
              </select>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Results per page:</span>
              <select
                v-model.number="filters.perPage"
                @change="performSearch"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option :value="12">12</option>
                <option :value="24">24</option>
                <option :value="36">36</option>
                <option :value="48">48</option>
              </select>
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

          <!-- No Results State -->
          <div v-else-if="books.length === 0 && searchQuery" class="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="text-xl font-semibold text-gray-800 mb-2 font-heading">No results found</h3>
            <p class="text-gray-600 mb-4">
              We couldn't find any books matching "{{ searchQuery }}"
            </p>
            <p class="text-sm text-gray-500">Try adjusting your search terms or filters</p>
          </div>

          <!-- Initial State -->
          <div v-else-if="books.length === 0 && !searchQuery" class="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 class="text-xl font-semibold text-gray-800 mb-2 font-heading">Search for books</h3>
            <p class="text-gray-600">Enter a search term above to find books</p>
          </div>

          <!-- Books Grid -->
          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <BookCard
                v-for="book in books"
                :key="book.id"
                :book="book"
              />
            </div>

            <!-- Pagination -->
            <div v-if="pagination.lastPage > 1" class="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
              <button
                @click="goToPage(pagination.currentPage - 1)"
                :disabled="pagination.currentPage === 1"
                class="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-heading"
              >
                Previous
              </button>

              <div class="flex items-center gap-2">
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      'px-4 py-2 rounded-lg border transition font-heading',
                      page === pagination.currentPage
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-primary-300 text-primary-600 hover:bg-primary-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="px-2 text-gray-500">...</span>
                </template>
              </div>

              <button
                @click="goToPage(pagination.currentPage + 1)"
                :disabled="pagination.currentPage === pagination.lastPage"
                class="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-heading"
              >
                Next
              </button>
            </div>

            <div class="text-center mt-4 text-sm text-gray-600">
              Showing {{ ((pagination.currentPage - 1) * pagination.perPage) + 1 }} to {{ Math.min(pagination.currentPage * pagination.perPage, pagination.total) }} of {{ pagination.total }} results
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import BookCard from "~/components/common/BookCard.vue"

const route = useRoute()
const router = useRouter()
const { searchBooks } = useBooks()

const searchQuery = ref('')
const localSearchQuery = ref('')
const books = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 12,
  total: 0
})

const filters = ref({
  minPrice: null as number | null,
  maxPrice: null as number | null,
  discountedOnly: false,
  inStockOnly: false,
  sortBy: 'relevance' as 'relevance' | 'price' | 'title' | 'newest' | 'oldest',
  perPage: 12
})

// Computed visible pages for pagination
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const current = pagination.value.currentPage
  const last = pagination.value.lastPage
  const delta = 2

  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= delta + 2) {
      for (let i = 1; i <= delta + 2; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    } else if (current >= last - delta - 1) {
      pages.push(1)
      pages.push('...')
      for (let i = last - delta - 1; i <= last; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - delta; i <= current + delta; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    }
  }

  return pages
})

const performSearch = async () => {
  if (localSearchQuery.value.length < 2) {
    return
  }

  searchQuery.value = localSearchQuery.value
  pagination.value.currentPage = 1
  
  // Update URL
  router.push({
    path: '/search',
    query: {
      q: localSearchQuery.value,
      min_price: filters.value.minPrice?.toString(),
      max_price: filters.value.maxPrice?.toString(),
      discounted_only: filters.value.discountedOnly ? '1' : undefined,
      in_stock_only: filters.value.inStockOnly ? '1' : undefined,
      sort_by: filters.value.sortBy,
      per_page: filters.value.perPage.toString()
    }
  })

  await loadResults()
}

const applyFilters = () => {
  pagination.value.currentPage = 1
  loadResults()
}

const clearFilters = () => {
  filters.value = {
    minPrice: null,
    maxPrice: null,
    discountedOnly: false,
    inStockOnly: false,
    sortBy: 'relevance',
    perPage: 12
  }
  pagination.value.currentPage = 1
  loadResults()
}

const loadResults = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    books.value = []
    pagination.value = {
      currentPage: 1,
      lastPage: 1,
      perPage: 12,
      total: 0
    }
    return
  }

  loading.value = true
  error.value = null

  try {
    // Map sortBy to API format
    let sortBy: 'relevance' | 'price' | 'title' | 'newest' | 'oldest' = 'relevance'
    let sortOrder: 'asc' | 'desc' = 'desc'

    switch (filters.value.sortBy) {
      case 'price_asc':
        sortBy = 'price'
        sortOrder = 'asc'
        break
      case 'price_desc':
        sortBy = 'price'
        sortOrder = 'desc'
        break
      case 'title_asc':
        sortBy = 'title'
        sortOrder = 'asc'
        break
      case 'title_desc':
        sortBy = 'title'
        sortOrder = 'desc'
        break
      case 'newest':
        sortBy = 'newest'
        sortOrder = 'desc'
        break
      case 'oldest':
        sortBy = 'oldest'
        sortOrder = 'asc'
        break
      default:
        sortBy = 'relevance'
        sortOrder = 'desc'
    }

    const result = await searchBooks(searchQuery.value, {
      page: pagination.value.currentPage,
      perPage: filters.value.perPage,
      sortBy,
      sortOrder,
      minPrice: filters.value.minPrice || undefined,
      maxPrice: filters.value.maxPrice || undefined,
      discountedOnly: filters.value.discountedOnly || undefined,
      inStockOnly: filters.value.inStockOnly || undefined
    })

    books.value = result.books
    pagination.value = result.pagination
  } catch (err: any) {
    error.value = err.message || 'Failed to search books'
    console.error('Error searching books:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page
    loadResults()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Initialize from URL query params
onMounted(() => {
  const query = route.query.q as string
  if (query) {
    searchQuery.value = query
    localSearchQuery.value = query
    
    // Load filters from URL
    if (route.query.min_price) filters.value.minPrice = Number(route.query.min_price)
    if (route.query.max_price) filters.value.maxPrice = Number(route.query.max_price)
    if (route.query.discounted_only) filters.value.discountedOnly = true
    if (route.query.in_stock_only) filters.value.inStockOnly = true
    if (route.query.sort_by) filters.value.sortBy = route.query.sort_by as any
    if (route.query.per_page) filters.value.perPage = Number(route.query.per_page)
    
    loadResults()
  }
})

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.q && newQuery.q !== searchQuery.value) {
    searchQuery.value = newQuery.q as string
    localSearchQuery.value = newQuery.q as string
    pagination.value.currentPage = 1
    loadResults()
  }
}, { deep: true })

definePageMeta({
  layout: 'default'
})
</script>
