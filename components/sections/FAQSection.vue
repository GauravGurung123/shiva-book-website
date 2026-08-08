<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Common Questions</h2>
      <div class="max-w-3xl mx-auto space-y-4">
        <div 
          v-for="faq in faqs" 
          :key="faq.id"
          class="bg-gray-50 rounded-lg p-6"
        >
          <h3 class="font-semibold text-gray-800 mb-2">{{ faq.question }}</h3>
          <p class="text-gray-600">{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FAQ } from '~/types'

interface Props {
  faqs: FAQ[]
}

defineProps<Props>()
</script>
