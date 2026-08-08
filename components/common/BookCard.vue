<template>
  <div class="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition">
    <div class="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
      <span class="text-gray-400">Book Cover</span>
    </div>
    <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{{ book.title }}</h3>
    <p class="text-gray-600 text-xs mb-2">{{ book.author }}</p>
    <div class="flex justify-between items-center">
      <span class="text-orange-600 font-bold">{{ book.price }}</span>
      <button 
        @click="addToCart"
        class="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition"
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
