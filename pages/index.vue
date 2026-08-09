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
    <PublicationsSection 
      :publications="publications" 
      :loading="publicationsLoading" 
      :error="publicationsError" 
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
import { usePublications } from '~/composables/usePublications'
import { useFAQs } from '~/composables/useFAQs'
import HeroSection from "~/components/sections/HeroSection.vue";
import CategoriesSection from "~/components/sections/CategoriesSection.vue";
import AuthorsSection from "~/components/sections/AuthorsSection.vue";
import PublicationsSection from "~/components/sections/PublicationsSection.vue";
import FeaturedBooksSection from "~/components/sections/FeaturedBooksSection.vue";
import NewArrivalsSection from "~/components/sections/NewArrivalsSection.vue";
import WhyChooseUsSection from "~/components/sections/WhyChooseUsSection.vue";
import FAQSection from "~/components/sections/FAQSection.vue";

const { featuredBooks, newArrivals, loading: booksLoading, error: booksError } = useBooks()
const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
const { authors, loading: authorsLoading, error: authorsError } = useAuthors()
const { publications, loading: publicationsLoading, error: publicationsError } = usePublications()
const { faqs } = useFAQs()

const handleAddToCart = (book: any) => {
  console.log('Added to cart:', book.title)
  // TODO: Implement cart functionality
}

definePageMeta({
  layout: 'default'
})
</script>
