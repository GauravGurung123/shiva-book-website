<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2 text-center">New Arrivals</h1>
      <p class="text-gray-600 text-center mb-8">Fresh off the press</p>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Books Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <BookCard 
          v-for="book in newArrivals" 
          :key="book.id" 
          :book="book"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import BookCard from "~/components/common/BookCard.vue";

const { newArrivals, loading, error } = useBooks()

const handleAddToCart = (book: any) => {
  console.log('Added to cart:', book.title)
}

definePageMeta({
  layout: 'default'
})
</script>
