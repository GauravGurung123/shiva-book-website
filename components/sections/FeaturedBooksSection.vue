<template>
  <section id="featured" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2 text-center font-heading">Editor's Picks</h2>
      <p class="text-gray-600 text-center mb-8 font-heading">Handpicked selections for you</p>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Books Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <BookCard 
          v-for="book in books" 
          :key="book.id" 
          :book="book"
          @add-to-cart="handleAddToCart"
        />
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

const emit = defineEmits<{
  addToCart: [book: Book]
}>()

const handleAddToCart = (book: Book) => {
  emit('addToCart', book)
}
</script>
