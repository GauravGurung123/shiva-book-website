<template>
  <div>
    <NuxtRouteAnnouncer />
    <HeroSection />
    <CategoriesSection 
      :categories="categories" 
      :loading="categoriesLoading" 
      :error="categoriesError" 
    />
    <AuthorsSection 
      :authors="authors" 
      :loading="authorsLoading" 
      :error="authorsError" 
    />
    <PublishersSection 
      :publishers="publishers" 
      :loading="publishersLoading" 
      :error="publishersError" 
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
import { useAuthors } from '~/composables/useAuthors'
import { usePublishers } from '~/composables/usePublishers'
import { useFAQs } from '~/composables/useFAQs'
import HeroSection from "~/components/sections/HeroSection.vue";
import CategoriesSection from "~/components/sections/CategoriesSection.vue";
import AuthorsSection from "~/components/sections/AuthorsSection.vue";
import PublishersSection from "~/components/sections/PublishersSection.vue";
import FeaturedBooksSection from "~/components/sections/FeaturedBooksSection.vue";
import NewArrivalsSection from "~/components/sections/NewArrivalsSection.vue";
import WhyChooseUsSection from "~/components/sections/WhyChooseUsSection.vue";
import FAQSection from "~/components/sections/FAQSection.vue";

const { featuredBooks, newArrivals, loading: booksLoading, error: booksError } = useBooks()
const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
const { authors, loading: authorsLoading, error: authorsError } = useAuthors()
const { publishers, loading: publishersLoading, error: publishersError } = usePublishers()
const { faqs } = useFAQs()

const handleAddToCart = (book: any) => {
  console.log('Added to cart:', book.title)
  // TODO: Implement cart functionality
}

definePageMeta({
  layout: 'default'
})
</script>
