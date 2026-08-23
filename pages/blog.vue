<template>
  <div class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header with Sort -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-800 font-heading">Latest posts</h1>
        <div class="flex items-center space-x-2">
          <label class="text-gray-600 text-sm font-medium">Sort by:</label>
          <select
            v-model="sortBy"
            class="px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition outline-none text-sm"
            @change="handleSort"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
      
      <!-- Main Content Area with Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <!-- Blog Posts (Left Column - 7/10 width) -->
        <div class="lg:col-span-7">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p class="text-red-600">{{ error }}</p>
          </div>
          
          <!-- Blog Posts Grid -->
          <div v-else>
            <div class="space-y-16">
              <BlogPostCard
                v-for="(post, index) in filteredPosts"
                :key="post.id"
                :post="post"
                :is-last="index === filteredPosts.length - 1"
              />
            </div>
            
            <!-- Pagination -->
            <div v-if="pagination.lastPage > 1" class="flex justify-center items-center mt-8 space-x-2">
              <button 
                @click="goToPage(pagination.currentPage - 1)"
                :disabled="pagination.currentPage === 1"
                class="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-heading"
              >
                Previous
              </button>
              
              <span class="text-gray-600 font-heading">
                Page {{ pagination.currentPage }} of {{ pagination.lastPage }} ({{ pagination.total }} total)
              </span>
              
              <button 
                @click="goToPage(pagination.currentPage + 1)"
                :disabled="pagination.currentPage === pagination.lastPage"
                class="px-4 py-2 rounded-lg border border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-heading"
              >
                Next
              </button>
            </div>
            
            <!-- Empty State -->
            <div v-if="filteredPosts.length === 0 && !loading" class="text-center py-12">
              <p class="text-gray-600 font-heading">No blog posts found.</p>
            </div>
          </div>
        </div>
        
        <!-- Sidebar (Right Column - 3/10 width) -->
        <div class="lg:col-span-3">
          <BlogSidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBlog } from '~/composables/useBlog'
import BlogPostCard from "~/components/common/BlogPostCard.vue";
import BlogSidebar from "~/components/common/BlogSidebar.vue";

const { fetchBlogPosts } = useBlog()

const posts = ref<any[]>([])
const filteredPosts = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0
})

const sortBy = ref('newest')

const loadPosts = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    // Map sortBy to API parameters
    let apiSortBy = 'date'
    let descending = true
    
    switch (sortBy.value) {
      case 'newest':
        apiSortBy = 'date'
        descending = true
        break
      case 'oldest':
        apiSortBy = 'date'
        descending = false
        break
      case 'title-asc':
        apiSortBy = 'title'
        descending = false
        break
      case 'title-desc':
        apiSortBy = 'title'
        descending = true
        break
    }
    
    const result = await fetchBlogPosts(page, 10, apiSortBy, descending)
    posts.value = result.posts
    pagination.value = result.pagination
    filteredPosts.value = result.posts
  } catch (err: any) {
    error.value = err.message || 'Failed to load blog posts'
    console.error('Error loading blog posts:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    loadPosts(page)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSort = () => {
  loadPosts(1)
}

// Load initial page
onMounted(() => {
  loadPosts(1)
})

definePageMeta({
  layout: 'default'
})
</script>
