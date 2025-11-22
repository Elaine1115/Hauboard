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

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to gallery section
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }
}

const prevPage = () => goToPage(currentPage.value - 1)
const nextPage = () => goToPage(currentPage.value + 1)

// Generate visible page numbers
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5, -1, total)
    } else if (current >= total - 2) {
      pages.push(1, -1, total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, -1, current - 1, current, current + 1, -1, total)
    }
  }

  return pages
})

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
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-12">
          <!-- Previous Button -->
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 text-white transition-all hover:border-emerald-500 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:bg-gray-800"
          >
            <Icon name="ph:caret-left" class="w-5 h-5" />
          </button>

          <!-- Page Numbers -->
          <template v-for="(page, index) in visiblePages" :key="index">
            <span v-if="page === -1" class="px-2 text-gray-500">...</span>
            <button
              v-else
              @click="goToPage(page)"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all',
                currentPage === page
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                  : 'border border-gray-700 bg-gray-800 text-white hover:border-emerald-500 hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Next Button -->
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 text-white transition-all hover:border-emerald-500 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:bg-gray-800"
          >
            <Icon name="ph:caret-right" class="w-5 h-5" />
          </button>
        </div>

        <!-- Page Info -->
        <div v-if="totalPages > 1" class="text-center mt-4 text-gray-400 text-sm">
          {{ locale === 'zh' ? `第 ${currentPage} 頁，共 ${totalPages} 頁` : `Page ${currentPage} of ${totalPages}` }}
        </div>

        <!-- Empty State -->
        <div v-if="allImages.length === 0" class="text-center py-20">
          <p class="text-gray-400 text-lg">No images available.</p>
        </div>
      </div>
    </section>
  </div>
</template>
