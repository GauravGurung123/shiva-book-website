<template>
  <div class="min-h-screen bg-gray-50">
    <TheHeader />
    <slot />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout component
import TheHeader from "~/components/layout/TheHeader.vue";
import TheFooter from "~/components/layout/TheFooter.vue";
</script>
