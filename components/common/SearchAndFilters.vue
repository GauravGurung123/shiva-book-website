<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
    <!-- Search Bar -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition outline-none"
          @keyup.enter="handleSearch"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
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
      <button
        @click="handleSearch"
        class="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg font-heading"
      >
        Search
      </button>
    </div>

    <!-- Filters Toggle -->
    <div class="flex items-center justify-between mb-4">
      <button
        @click="showFilters = !showFilters"
        class="flex items-center text-primary-600 hover:text-primary-700 font-medium transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2 transition-transform"
          :class="{ 'rotate-180': showFilters }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-red-500 hover:text-red-600 transition"
      >
        Clear All Filters
      </button>
    </div>

    <!-- Filters Content -->
    <div
      v-show="showFilters"
      class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100"
    >
      <!-- Category Filter -->
      <div v-if="showCategoryFilter">
        <h3 class="font-semibold text-gray-700 mb-3 font-heading">Categories</h3>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <label
            v-for="category in categories"
            :key="category.id"
            class="flex items-center space-x-2 cursor-pointer group"
          >
            <input
              v-model="selectedCategories"
              type="checkbox"
              :value="category.id"
              class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-gray-600 group-hover:text-gray-800 transition text-sm">
              {{ category.name }}
            </span>
          </label>
        </div>
      </div>

      <!-- Price Range Filter -->
      <div v-if="showPriceFilter">
        <h3 class="font-semibold text-gray-700 mb-3 font-heading">Price Range</h3>
        <div class="flex items-center space-x-2">
          <input
            v-model="minPrice"
            type="number"
            placeholder="Min"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition outline-none text-sm"
          />
          <span class="text-gray-400">-</span>
          <input
            v-model="maxPrice"
            type="number"
            placeholder="Max"
            class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition outline-none text-sm"
          />
        </div>
      </div>

      <!-- Sort By Filter -->
      <div>
        <h3 class="font-semibold text-gray-700 mb-3 font-heading">Sort By</h3>
        <select
          v-model="sortBy"
          class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition outline-none text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {type Category } from '~/types'

interface Props {
  searchPlaceholder?: string
  categories?: Category[]
  showCategoryFilter?: boolean
  showPriceFilter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search by title, author or description...',
  categories: () => [],
  showCategoryFilter: true,
  showPriceFilter: true
})

const emit = defineEmits<{
  search: [query: string, filters: SearchFilters]
  clear: []
}>()

interface SearchFilters {
  categories: string[]
  minPrice: number | null
  maxPrice: number | null
  sortBy: string
}

const showFilters = ref(false)
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const sortBy = ref('newest')

const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    minPrice.value !== null ||
    maxPrice.value !== null ||
    sortBy.value !== 'newest'
  )
})

const handleSearch = () => {
  const filters: SearchFilters = {
    categories: selectedCategories.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    sortBy: sortBy.value
  }
  emit('search', searchQuery.value, filters)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'newest'
  emit('clear')
}

// Watch for filter changes and auto-apply
watch([selectedCategories, minPrice, maxPrice, sortBy], () => {
  if (showFilters.value) {
    handleSearch()
  }
}, { deep: true })
</script>
