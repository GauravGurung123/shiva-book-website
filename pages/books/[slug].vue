<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>
      
      <!-- Book Details -->
      <div v-else-if="book" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <!-- Book Cover -->
          <div class="flex justify-center items-start">
            <div class="relative">
              <img 
                :src="book.coverImage || '/placeholder-book.jpg'" 
                :alt="book.title"
                class="w-full max-w-md rounded-lg shadow-lg object-cover"
              />
              <div v-if="book.discount_price && book.discount_price < book.price" class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {{ Math.round((1 - book.discount_price / book.price) * 100) }}% OFF
              </div>
            </div>
          </div>
          
          <!-- Book Info -->
          <div class="flex flex-col">
            <h1 class="text-3xl font-bold text-gray-800 mb-2 font-heading">{{ book.title }}</h1>
            
            <!-- Authors -->
            <div v-if="book.authors && book.authors.length > 0" class="mb-4">
              <p class="text-gray-600">
                <span class="font-semibold">By:</span>
                <span v-for="(author, index) in book.authors" :key="author.id">
                  <NuxtLink :to="`/authors/${author.slug}`" class="text-primary-600 hover:text-primary-700 hover:underline">
                    {{ author.name }}
                  </NuxtLink>
                  <span v-if="index < book.authors.length - 1">, </span>
                </span>
              </p>
            </div>
            
            <!-- Publisher -->
            <div v-if="book.publisher" class="mb-4">
              <p class="text-gray-600">
                <span class="font-semibold">Publisher:</span>
                <NuxtLink :to="`/publishers/${book.publisher.slug}`" class="text-primary-600 hover:text-primary-700 hover:underline ml-1">
                  {{ book.publisher.name }}
                </NuxtLink>
              </p>
            </div>
            
            <!-- Categories -->
            <div v-if="book.categories && book.categories.length > 0" class="mb-4">
              <p class="text-gray-600">
                <span class="font-semibold">Categories:</span>
                <span v-for="(category, index) in book.categories" :key="category.id">
                  <NuxtLink :to="`/categories/${category.slug}`" class="text-primary-600 hover:text-primary-700 hover:underline">
                    {{ category.name }}
                  </NuxtLink>
                  <span v-if="index < book.categories.length - 1">, </span>
                </span>
              </p>
            </div>
            
            <!-- Price -->
            <div class="mb-6">
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-bold text-primary-600">
                  €{{ parseFloat(book.final_price || book.price || 0).toFixed(2) }}
                </span>
                <span 
                  v-if="book.discount_price && book.discount_price < book.price" 
                  class="text-xl text-gray-400 line-through"
                >
                  €{{ parseFloat(book.price || 0).toFixed(2) }}
                </span>
              </div>
            </div>
            
            <!-- Stock Status -->
            <div class="mb-6">
              <span 
                :class="book.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ book.stock_quantity > 0 ? `In Stock (${book.stock_quantity} available)` : 'Out of Stock' }}
              </span>
            </div>
            
            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <p class="text-gray-600 leading-relaxed">{{ book.description || 'No description available.' }}</p>
            </div>
            
            <!-- Book Details -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div v-if="book.isbn">
                <p class="text-sm text-gray-500">ISBN</p>
                <p class="text-gray-800 font-medium">{{ book.isbn }}</p>
              </div>
              <div v-if="book.pages">
                <p class="text-sm text-gray-500">Pages</p>
                <p class="text-gray-800 font-medium">{{ book.pages }}</p>
              </div>
              <div v-if="book.language">
                <p class="text-sm text-gray-500">Language</p>
                <p class="text-gray-800 font-medium">{{ book.language }}</p>
              </div>
              <div v-if="book.published_date">
                <p class="text-sm text-gray-500">Published</p>
                <p class="text-gray-800 font-medium">{{ formatDate(book.published_date) }}</p>
              </div>
            </div>
            
            <!-- Quantity and Add to Cart -->
            <div class="mt-auto">
              <div class="flex items-center gap-4 mb-4">
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    @click="decrementQuantity"
                    :disabled="quantity <= 1"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    -
                  </button>
                  <span class="px-4 py-2 text-gray-800 font-medium min-w-[60px] text-center">{{ quantity }}</span>
                  <button 
                    @click="incrementQuantity"
                    :disabled="quantity >= (book.stock_quantity || 99)"
                    class="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                @click="handleAddToCart"
                :disabled="book.stock_quantity === 0"
                class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ book.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <p class="text-gray-600 font-heading">Book not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '~/types'

const route = useRoute()
const { fetchBookBySlug } = useBooks()

const book = ref<Book | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)

const loadBook = async () => {
  loading.value = true
  error.value = null
  
  try {
    const slug = route.params.slug as string
    console.log('Loading book with slug:', slug)
    const bookData = await fetchBookBySlug(slug)
    console.log('Book data received:', bookData)
    
    if (bookData) {
      book.value = bookData
    } else {
      error.value = 'Book not found'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load book details'
    console.error('Error loading book:', err)
  } finally {
    loading.value = false
  }
}

const incrementQuantity = () => {
  if (book.value && quantity.value < (book.value.stock_quantity || 99)) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleAddToCart = () => {
  if (book.value) {
    console.log('Added to cart:', {
      book: book.value.title,
      quantity: quantity.value,
      price: book.value.final_price || book.value.price
    })
    // TODO: Implement cart functionality
    // You can use Pinia store or localStorage to manage cart
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Load book when route changes
watch(() => route.params.slug, () => {
  loadBook()
})

// Load initial book
onMounted(() => {
  loadBook()
})

definePageMeta({
  layout: 'default'
})
</script>
