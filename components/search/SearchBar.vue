<template>
  <div ref="searchBarWrapper" class="relative">
    <div class="relative">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Search books..."
        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        @input="handleInput"
        @focus="showResults = true"
        @keydown.enter="handleEnter"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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

    <!-- Search Results Dropdown -->
    <div
      v-if="showResults && (searchResults.length > 0 || loading || searchQuery.length >= 2)"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-4 text-center text-gray-500">
        <svg
          class="animate-spin h-5 w-5 mx-auto text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-2 text-sm">Searching...</p>
      </div>

      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0">
        <NuxtLink
          v-for="book in searchResults"
          :key="book.id"
          :to="`/books/${book.slug}`"
          class="flex items-center p-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
          @click="showResults = false"
        >
          <img
            v-if="book.coverImage"
            :src="book.coverImage"
            :alt="book.title"
            class="w-12 h-16 object-cover rounded"
          />
          <div
            v-else
            class="w-12 h-16 bg-gray-200 rounded flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="font-medium text-gray-900 text-sm line-clamp-1">
              {{ book.title }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">{{ book.author }}</p>
            <p class="text-sm font-semibold text-primary-600 mt-1">
              {{ book.price }}
            </p>
          </div>
        </NuxtLink>

        <!-- View All Results Link -->
        <NuxtLink
          :to="`/search?q=${encodeURIComponent(searchQuery)}`"
          class="block p-3 text-center text-sm text-primary-600 hover:bg-gray-50 transition border-t border-gray-100"
          @click="showResults = false"
        >
          View all results
        </NuxtLink>
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery.length >= 2" class="p-4 text-center text-gray-500">
        <p class="text-sm">No books found</p>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
      v-if="showResults"
      class="fixed inset-0 z-40"
      @click="showResults = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

const { searchBooks } = useBooks()

const searchQuery = ref('')
const searchResults = ref<Book[]>([])
const loading = ref(false)
const showResults = ref(false)
const searchInput = ref<HTMLInputElement>()
const searchBarWrapper = ref<HTMLElement>()

let debounceTimer: NodeJS.Timeout | null = null

const handleInput = () => {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Don't search if query is less than 2 characters
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  // Set new timer with 500ms debounce
  debounceTimer = setTimeout(async () => {
    await performSearch()
  }, 500)
}

const performSearch = async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  loading.value = true
  showResults.value = true
  try {
    const result = await searchBooks(searchQuery.value, { perPage: 5 })
    searchResults.value = result.books || []
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const handleEnter = () => {
  if (searchQuery.value.length >= 2) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    showResults.value = false
  }
}

// Close results when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (searchBarWrapper.value && !searchBarWrapper.value.contains(event.target as Node)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
