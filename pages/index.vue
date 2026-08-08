<template>
  <div>
    <NuxtRouteAnnouncer />
    <HeroSection />
    <CategoriesSection 
      :categories="categories" 
      :loading="categoriesLoading" 
      :error="categoriesError" 
    />
    <FeaturedBooksSection 
      :books="featuredBooks" 
      :loading="booksLoading" 
      :error="booksError"
      @add-to-cart="handleAddToCart" 
    />
    <NewArrivalsSection 
      :books="newArrivals" 
      :loading="booksLoading" 
      :error="booksError"
      @add-to-cart="handleAddToCart" 
    />
    <WhyChooseUsSection />
    <FAQSection :faqs="faqs" />
  </div>
</template>

<script setup lang="ts">
import { useBooks } from '~/composables/useBooks'
import { useCategories } from '~/composables/useCategories'
import { useFAQs } from '~/composables/useFAQs'

const { featuredBooks, newArrivals, loading: booksLoading, error: booksError } = useBooks()
const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
const { faqs } = useFAQs()

const handleAddToCart = (book: any) => {
  console.log('Added to cart:', book.title)
  // TODO: Implement cart functionality
}

definePageMeta({
  layout: 'default'
})
</script>
