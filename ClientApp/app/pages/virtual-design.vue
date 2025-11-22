<script setup lang="ts">
import { ref, computed } from 'vue'
import virtualDesignData from '../../i18n/locales/virtual-design.json'

const { locale } = useI18n()

// Get data based on locale
const data = computed(() => {
  return locale.value === 'zh' ? virtualDesignData.zh : virtualDesignData.en
})

const allImages = computed(() => data.value.images)

// Pagination settings - 4 rows × 5 columns = 20 images per page
const imagesPerPage = 20
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allImages.value.length / imagesPerPage))

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * imagesPerPage
  const end = start + imagesPerPage
  return allImages.value.slice(start, end)
})

const onPageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

// SEO
useSeoMeta({
  title: computed(() => data.value.seo.title),
  description: computed(() => data.value.seo.description),
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 md:py-32">
      <div class="absolute inset-0 bg-[url('/assets/gradient.png')] bg-cover bg-center opacity-20"></div>

      <div class="container relative mx-auto px-4 md:px-6">
        <div class="mx-auto max-w-4xl text-center">
          <h1
            class="mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl"
          >
            {{ data.hero.title }}
          </h1>
          <p class="text-lg text-gray-300 md:text-xl">
            {{ data.hero.subtitle }}
          </p>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <!-- Gallery Grid -->
        <LightGalleryGrid
          :images="paginatedImages"
          :show-alt="false"
          aspect-ratio="4/3"
          grid-cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        />

        <!-- Pagination -->
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:current-page="onPageChange"
        />

        <!-- Empty State -->
        <div v-if="allImages.length === 0" class="text-center py-20">
          <p class="text-gray-400 text-lg">No images available.</p>
        </div>
      </div>
    </section>
  </div>
</template>
