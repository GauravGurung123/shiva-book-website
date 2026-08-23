<template>
  <div class="flex items-start p-6 bg-white shadow-md rounded-lg group" :class="{ 'mb-8': !isLast }">
    <!-- Date on Left -->
    <div class="flex-shrink-0 w-16 text-center mr-6">
      <div class="text-2xl font-bold text-gray-800 font-heading">{{ formatDateDay(post.date) }}</div>
      <div class="text-sm text-gray-500 uppercase font-heading">{{ formatDateMonth(post.date) }}</div>
    </div>
    
    <!-- Content in Middle -->
    <div class="flex-1 min-w-0 pr-6">
      <!-- Category and Author -->
      <div class="flex items-center text-sm text-gray-500 mb-2">
        <span class="text-primary-600 font-medium">{{ post.category }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.author }}</span>
      </div>
      
      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition font-heading">
        <NuxtLink :to="`/blog/${post.slug}`">
          {{ post.title }}
        </NuxtLink>
      </h3>
    </div>
    
    <!-- Thumbnail on Right -->
    <div class="flex-shrink-0 w-32 h-24 overflow-hidden rounded">
      <img
        :src="post.thumbnail"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  category: string
  date: string
  thumbnail: string
  slug: string
}

interface Props {
  post: BlogPost
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false
})

const formatDateDay = (dateString: string): string => {
  const date = new Date(dateString)
  return date.getDate().toString()
}

const formatDateMonth = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short' })
}
</script>
