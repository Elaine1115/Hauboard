<script setup lang="ts">
import { ref, computed } from 'vue'
import newsData from '../../../i18n/locales/news.json'

const { locale } = useI18n()

// Get data based on locale
const data = computed(() => {
  return locale.value === 'zh' ? newsData.zh : newsData.en
})

// Pagination settings
const itemsPerPage = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(data.value.items.length / itemsPerPage))

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return data.value.items.slice(start, end)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
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

// Get first image (handles both images array and single image)
const getFirstImage = (item: any) => {
  if (item.images && item.images.length > 0) {
    return item.images[0]
  }
  return item.image || null
}

// Category color rotation (3 colors)
const categoryColors = [
  { bg: 'bg-emerald-500/90', text: 'text-white' },
  { bg: 'bg-blue-500/90', text: 'text-white' },
  { bg: 'bg-purple-500/90', text: 'text-white' },
]

const getCategoryColor = (category: string) => {
  // Use category string hash to get consistent color for same category
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % categoryColors.length
  return categoryColors[index]
}

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  if (locale.value === 'zh') {
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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

    <!-- News Section -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4 md:px-6">
        <!-- News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="item in paginatedNews"
            :key="item.id"
            :to="`/news/${item.id}`"
            class="group relative block overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <!-- Image -->
            <div class="relative aspect-[16/9] overflow-hidden bg-gray-800">
              <img
                v-if="getFirstImage(item)"
                :src="getFirstImage(item)"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700/50">
                  <Icon name="ph:article-duotone" class="h-8 w-8 text-emerald-500/70" />
                </div>
              </div>
              <!-- Category Badge -->
              <div class="absolute left-4 top-4">
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm',
                    getCategoryColor(item.category).bg,
                    getCategoryColor(item.category).text
                  ]"
                >
                  {{ item.category }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Date -->
              <div class="mb-3 flex items-center gap-2 text-sm text-gray-400">
                <Icon name="ph:calendar" class="h-4 w-4" />
                <time :datetime="item.date">{{ formatDate(item.date) }}</time>
              </div>

              <!-- Title -->
              <h2 class="mb-3 text-xl font-bold text-white transition-colors group-hover:text-emerald-400">
                {{ item.title }}
              </h2>

              <!-- Excerpt -->
              <p class="mb-4 text-gray-400 line-clamp-3">
                {{ item.excerpt }}
              </p>

              <!-- Read More -->
              <span class="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                {{ data.readMore }}
                <Icon name="ph:arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </NuxtLink>
        </div>

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
        <div v-if="data.items.length === 0" class="text-center py-20">
          <Icon name="ph:newspaper" class="mx-auto mb-4 h-16 w-16 text-gray-600" />
          <p class="text-gray-400 text-lg">{{ data.noNews }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
