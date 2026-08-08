<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Contact Us</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Contact Information -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="bg-orange-600 text-white p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Email</h3>
                <p class="text-gray-600">support@NepaliBookInEurope.com</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="bg-orange-600 text-white p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Phone</h3>
                <p class="text-gray-600">+44 20 1234 5678</p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="bg-orange-600 text-white p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">WhatsApp</h3>
                <p class="text-gray-600">+44 20 1234 5678</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-medium mb-2">Name</label>
              <input 
                v-model="formData.name" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Your name"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Email</label>
              <input 
                v-model="formData.email" 
                type="email" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Subject</label>
              <input 
                v-model="formData.subject" 
                type="text" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label class="block text-gray-700 font-medium mb-2">Message</label>
              <textarea 
                v-model="formData.message" 
                rows="4" 
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button 
              type="submit"
              class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
  // TODO: Implement form submission
  alert('Thank you for your message! We will get back to you soon.')
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}

definePageMeta({
  layout: 'default'
})
</script>
