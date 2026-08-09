<template>
  <section id="publications" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center font-heading">Browse by Publication</h2>
      
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
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="publication in displayPublications" 
            :key="publication.id"
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center border border-gray-100 hover:border-primary-200 group"
          >
            <div class="w-16 h-16 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl group-hover:from-primary-200 group-hover:to-primary-300 transition">
              📚
            </div>
            <h3 class="font-semibold text-gray-700 group-hover:text-primary-600 transition font-heading">{{ publication.name }}</h3>
          </div>
        </div>
        
        <!-- View More Button -->
        <div v-if="showViewMore" class="text-center mt-8">
          <NuxtLink 
            to="/publications" 
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl font-heading"
          >
            View All Publications
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Publication } from '~/types'

interface Props {
  publications: Publication[]
  loading?: boolean
  error?: string | null
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 8 // 2 rows on desktop (4 columns x 2 rows)
})

// Calculate how many publications to display
const displayPublications = computed(() => {
  return props.publications.slice(0, props.limit)
})

// Show "View More" button if there are more publications than the limit
const showViewMore = computed(() => {
  return props.publications.length > props.limit
})
</script>
