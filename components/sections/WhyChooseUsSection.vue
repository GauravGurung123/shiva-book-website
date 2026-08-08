<template>
  <section id="about" class="py-16 bg-gradient-to-b from-primary-50 to-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center font-heading">Why Choose NepaliBookInEurope?</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="benefit in benefits" 
          :key="benefit.id"
          class="text-center"
        >
          <div class="bg-gradient-to-br from-primary-500 to-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="benefit.icon" />
            </svg>
          </div>
          <h3 class="font-bold text-gray-800 mb-2 font-heading">{{ benefit.title }}</h3>
          <p class="text-gray-600">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Benefit } from '~/types'

const benefits: Benefit[] = [
  {
    id: 1,
    title: '1-2 Day Dispatch',
    description: 'Fast shipping across Europe',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
  },
  {
    id: 2,
    title: 'Genuine Books Only',
    description: '100% authentic products',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 3,
    title: 'Competitive Pricing',
    description: 'Best prices guaranteed',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    id: 4,
    title: 'Dedicated Support',
    description: '24/7 customer assistance',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    id: 5,
    title: 'WhatsApp Support',
    description: 'Chat with us anytime',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  },
  {
    id: 6,
    title: 'COD Available',
    description: 'Pay on delivery',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  }
]
</script>
