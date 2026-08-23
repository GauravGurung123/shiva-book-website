<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16">
    <div class="max-w-md w-full mx-auto px-4 text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <!-- Error Message -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4 font-heading">Page Not Found</h1>
      
      <p class="text-gray-600 mb-8">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      
      <!-- Go Back Button -->
      <NuxtLink
        to="/"
        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-md hover:shadow-lg font-heading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Go Back Home
      </NuxtLink>
      
      <!-- Additional Info (if error details available) -->
      <div v-if="error && error.statusCode" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm">
          Error {{ error.statusCode }}: {{ error.statusMessage || 'An error occurred' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error?: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<ErrorProps>()

// Set page title
useHead({
  title: 'Page Not Found'
})
</script>
