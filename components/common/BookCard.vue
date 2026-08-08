<template>
  <div class="bg-white rounded-lg p-4 hover:shadow-lg transition border border-gray-100 group">
    <div class="bg-gradient-to-br from-primary-50 to-primary-100 h-48 rounded mb-4 flex items-center justify-center border border-primary-200">
      <span class="text-gray-400">Book Cover</span>
    </div>
    <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 font-heading group-hover:text-primary-600 transition">{{ book.title }}</h3>
    <p class="text-gray-600 text-xs mb-2">{{ book.author }}</p>
    <div class="flex justify-between items-center">
      <span class="text-primary-600 font-bold">{{ book.price }}</span>
      <button 
        @click="addToCart"
        class="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded text-sm hover:from-primary-600 hover:to-primary-700 transition shadow"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

interface Props {
  book: Book
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addToCart: [book: Book]
}>()

const addToCart = () => {
  emit('addToCart', props.book)
}
</script>
