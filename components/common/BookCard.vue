<template>
  <div @click="goToDetail" class="bg-white rounded-lg p-4 hover:shadow-lg transition border border-gray-100 group cursor-pointer">
    <div class="bg-gradient-to-br from-primary-50 to-primary-100 h-48 rounded mb-4 flex items-center justify-center border border-primary-200">
      <img 
        v-if="book.coverImage" 
        :src="book.coverImage" 
        :alt="book.title"
        class="w-full h-full object-cover rounded"
      />
      <span v-else class="text-gray-400">Book Cover</span>
    </div>
    <h3 class="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 font-heading group-hover:text-primary-600 transition">{{ book.title }}</h3>
    <p class="text-gray-600 text-xs mb-2">{{ book.author }}</p>
    <div class="flex justify-between items-center">
      <span class="text-primary-600 font-bold">{{ book.price }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

interface Props {
  book: Book
}

const props = defineProps<Props>()

const router = useRouter()

const goToDetail = () => {
  if (props.book.slug) {
    router.push(`/books/${props.book.slug}`)
  } else {
    console.error('Book slug is missing:', props.book)
  }
}
</script>
