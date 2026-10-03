<template>
  <section id="new-arrivals" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2 text-center font-heading">New Arrivals</h2>
      <p class="text-gray-600 text-center mb-8 font-heading">Fresh off the press - Last 7 days</p>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Books Grid - One Row (5 books)  -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <BookCard 
            v-for="book in displayBooks" 
            :key="book.id" 
            :book="book"
          />
        </div>
        
        <!-- Show More Button -->
        <div v-if="books.length > 5" class="text-center">
          <NuxtLink 
            to="/new-arrivals" 
            class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium font-heading"
          >
            View All New Arrivals ({{ books.length }})
          </NuxtLink>
        </div>
        
        <!-- Empty State -->
        <div v-if="books.length === 0 && !loading" class="text-center py-12">
          <p class="text-gray-600 font-heading">No new arrivals yet. Check back soon for the latest books.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Book } from '~/types'
import BookCard from "~/components/common/BookCard.vue";

interface Props {
  books: Book[]
  loading?: boolean
  error?: string | null
}

const props = defineProps<Props>()

// Display only first 5 books (one row)
const displayBooks = computed(() => props.books.slice(0, 5))
</script>
