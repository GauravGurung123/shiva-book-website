<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center font-heading">Common Questions</h2>
      <div class="max-w-3xl mx-auto space-y-4">
        <div 
          v-for="faq in faqs" 
          :key="faq.id"
          class="bg-gradient-to-br from-primary-50 to-white rounded-lg p-6 border border-primary-100 hover:shadow-md transition"
        >
          <h3 class="font-semibold text-gray-800 mb-2 font-heading">{{ faq.question }}</h3>
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
