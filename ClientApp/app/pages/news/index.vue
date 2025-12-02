<script setup lang="ts">
import { ref, computed } from 'vue'
import newsData from '../../../i18n/locales/news.json'

const { locale } = useI18n()
const themeStore = useThemeStore()

// Get data based on locale
const data = computed(() => {
  const lang = locale.value as 'zh' | 'en'
  const suffix = `_${lang}`

  return {
    seo: {
      title: newsData.seo[`title${suffix}` as keyof typeof newsData.seo] as string,
      description: newsData.seo[`description${suffix}` as keyof typeof newsData.seo] as string
    },
    hero: {
      title: newsData.hero[`title${suffix}` as keyof typeof newsData.hero] as string,
      subtitle: newsData.hero[`subtitle${suffix}` as keyof typeof newsData.hero] as string
    },
    detail: {
      backToNews: newsData.detail[`backToNews${suffix}` as keyof typeof newsData.detail] as string,
      notFound: newsData.detail[`notFound${suffix}` as keyof typeof newsData.detail] as string,
      notFoundDesc: newsData.detail[`notFoundDesc${suffix}` as keyof typeof newsData.detail] as string
    },
    readMore: newsData[`readMore${suffix}` as keyof typeof newsData] as string,
    noNews: newsData[`noNews${suffix}` as keyof typeof newsData] as string,
    items: newsData.items
      .filter(item => !item.isHide)
      .map(item => ({
        id: item.id,
        date: item.date,
        title: item[`title${suffix}` as keyof typeof item] as string,
        category: item[`category${suffix}` as keyof typeof item] as string,
        excerpt: item[`excerpt${suffix}` as keyof typeof item] as string,
        content: item[`content${suffix}` as keyof typeof item] as string,
        image: item.image,
        images: item.images
      }))
  }
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

const onPageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

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

const getCategoryColor = (category: string): { bg: string; text: string } => {
  // Use category string hash to get consistent color for same category
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % categoryColors.length
  return categoryColors[index]!
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
  <div class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="data.hero.title"
      :subtitle="data.hero.subtitle"
      background-image="/assets/gradient.png"
    />

    <!-- News Section -->
    <section
      class="py-16 md:py-24"
      :class="themeStore.isDark ? '' : 'bg-gray-50'"
    >
      <div class="mx-auto max-w-6xl px-4 md:px-6">
        <!-- News Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="item in paginatedNews"
            :key="item.id"
            :to="`/news/${item.id}`"
            class="group relative block overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10"
            :class="themeStore.isDark
              ? 'border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50'
              : 'border border-gray-200 bg-white/80 shadow-lg hover:bg-white'"
          >
            <!-- Image -->
            <div
              class="relative aspect-[16/9] overflow-hidden"
              :class="themeStore.isDark ? 'bg-gray-800' : 'bg-white'"
            >
              <img
                v-if="getFirstImage(item)"
                :src="getFirstImage(item)"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center"
                :class="themeStore.isDark ? 'bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900' : 'bg-gray-100'"
              >
                <div
                  class="flex h-16 w-16 items-center justify-center rounded-full"
                  :class="themeStore.isDark ? 'bg-gray-700/50' : 'bg-gray-100'"
                >
                  <Icon name="ph:article-duotone" class="h-8 w-8 text-emerald-500/70" />
                </div>
              </div>
              <!-- Category Badge -->
              <div class="absolute left-4 top-4">
                <span
                  v-if="item.category"
                  :class="[
                    'rounded-full px-3 py-1 text-xs font-medium',
                    getCategoryColor(item.category ?? '').bg,
                    getCategoryColor(item.category ?? '').text
                  ]"
                >
                  {{ item.category }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <!-- Date -->
              <div
                class="mb-3 flex items-center gap-2 text-sm"
                :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                <Icon name="ph:calendar" class="h-4 w-4" />
                <time :datetime="item.date">{{ formatDate(item.date) }}</time>
              </div>

              <!-- Title -->
              <h2
                class="mb-3 text-xl font-bold transition-colors group-hover:text-emerald-500"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ item.title }}
              </h2>

              <!-- Excerpt -->
              <p
                class="mb-4 line-clamp-3"
                :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-600'"
              >
                {{ item.excerpt }}
              </p>

              <!-- Read More -->
              <span class="inline-flex items-center gap-2 text-sm font-medium text-emerald-500 transition-colors group-hover:text-emerald-600">
                {{ data.readMore }}
                <Icon name="ph:arrow-right" class="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:current-page="onPageChange"
        />

        <!-- Empty State -->
        <div v-if="data.items.length === 0" class="text-center py-20">
          <Icon name="ph:newspaper" class="mx-auto mb-4 h-16 w-16" :class="themeStore.isDark ? 'text-gray-600' : 'text-gray-400'" />
          <p class="text-lg" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">{{ data.noNews }}</p>
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
