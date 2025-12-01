<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import newsData from '../../../i18n/locales/news.json'

const route = useRoute()
const { locale } = useI18n()
const themeStore = useThemeStore()

// Get data based on locale
const data = computed(() => {
  const lang = locale.value as 'zh' | 'en'
  const suffix = `_${lang}`

  return {
    detail: {
      backToNews: newsData.detail[`backToNews${suffix}` as keyof typeof newsData.detail] as string,
      notFound: newsData.detail[`notFound${suffix}` as keyof typeof newsData.detail] as string,
      notFoundDesc: newsData.detail[`notFoundDesc${suffix}` as keyof typeof newsData.detail] as string
    },
    items: newsData.items.map(item => ({
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

// Find the news item by ID
const newsItem = computed(() => {
  const id = route.params.id as string
  return data.value.items.find(item => item.id === id)
})

// Get all images (handles both images array and single image)
const newsImages = computed(() => {
  if (!newsItem.value) return []
  const item = newsItem.value as any
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images as string[]
  }
  if (item.image) {
    return [item.image] as string[]
  }
  return []
})

// Carousel state
const currentImageIndex = ref(0)

// Reset index when news item changes
watch(() => newsItem.value?.id, () => {
  currentImageIndex.value = 0
})

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = newsImages.value.length - 1
  }
}

const nextImage = () => {
  if (currentImageIndex.value < newsImages.value.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}

const goToImage = (index: number) => {
  currentImageIndex.value = index
}

// Touch/swipe support for mobile
const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - go to next image
      nextImage()
    } else {
      // Swiped right - go to previous image
      prevImage()
    }
  }

  // Reset values
  touchStartX.value = 0
  touchEndX.value = 0
}

// Category color rotation (3 colors)
const categoryColors = [
  { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  { bg: 'bg-purple-500/20', text: 'text-purple-400' },
]

const getCategoryColor = (category: string): { bg: string; text: string } => {
  // Use category string hash to get consistent color for same category
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % categoryColors.length
  return categoryColors[index] ?? { bg: 'bg-emerald-500/20', text: 'text-emerald-400' }
}

// Get category color for current news item
const currentCategoryColor = computed(() => {
  return getCategoryColor(newsItem.value?.category || '')
})

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  if (locale.value === 'zh') {
    return date.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Format content with line breaks
const formattedContent = computed(() => {
  if (!newsItem.value?.content) return ''
  return newsItem.value.content.split('\n').filter(line => line.trim())
})

// SEO
useSeoMeta({
  title: computed(() => newsItem.value ? `${newsItem.value.title} - Hauboard` : data.value.detail.notFound),
  description: computed(() => newsItem.value?.excerpt || ''),
})
</script>

<template>
  <div class="min-h-screen">
    <!-- News Detail -->
    <template v-if="newsItem">
      <!-- Content -->
      <section
        class="py-12 md:py-16"
        :class="themeStore.isDark ? '' : 'bg-gray-50'"
      >
        <div class="container mx-auto px-4 md:px-6">
          <article class="mx-auto max-w-6xl">
            <!-- Header -->
            <header
              class="mb-8 rounded-2xl p-6 backdrop-blur-sm md:p-8"
              :class="themeStore.isDark
                ? 'border border-gray-800 bg-gray-900/80'
                : 'border border-gray-200 bg-white/80 shadow-lg'"
            >
              <!-- Category -->
              <span
                :class="[
                  'mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium',
                  currentCategoryColor.bg,
                  currentCategoryColor.text
                ]"
              >
                {{ newsItem?.category }}
              </span>

              <!-- Title -->
              <h1
                class="mb-4 text-3xl font-bold md:text-4xl"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ newsItem.title }}
              </h1>

              <!-- Meta -->
              <div
                class="flex items-center gap-4"
                :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                <div class="flex items-center gap-2">
                  <Icon name="ph:calendar" class="h-5 w-5" />
                  <time :datetime="newsItem.date">{{ formatDate(newsItem.date) }}</time>
                </div>
              </div>
            </header>

            <!-- Image Carousel -->
            <div v-if="newsImages.length > 0" class="mb-8">
              <div
                class="relative overflow-hidden rounded-2xl touch-pan-y"
                :class="themeStore.isDark ? 'bg-gray-800' : 'bg-gray-100'"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
              >
                <!-- Image -->
                <img
                  :src="newsImages[currentImageIndex]"
                  :alt="`${newsItem.title} - ${currentImageIndex + 1}`"
                  class="w-full h-auto aspect-video object-cover select-none pointer-events-none"
                />

                <!-- Navigation Arrows (overlay on image) -->
                <template v-if="newsImages.length > 1">
                  <!-- Previous Button -->
                  <button
                    @click="prevImage"
                    class="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                  >
                    <Icon name="ph:caret-left" class="h-6 w-6" />
                  </button>

                  <!-- Next Button -->
                  <button
                    @click="nextImage"
                    class="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                  >
                    <Icon name="ph:caret-right" class="h-6 w-6" />
                  </button>

                  <!-- Image Counter -->
                  <div class="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {{ currentImageIndex + 1 }} / {{ newsImages.length }}
                  </div>
                </template>
              </div>

              <!-- Dot Indicators (only show if multiple images) -->
              <div v-if="newsImages.length > 1" class="mt-4 flex justify-center gap-2">
                <button
                  v-for="(_, index) in newsImages"
                  :key="index"
                  @click="goToImage(index)"
                  :class="[
                    'h-2 rounded-full transition-all',
                    currentImageIndex === index
                      ? 'w-6 bg-emerald-500'
                      : themeStore.isDark
                        ? 'w-2 bg-gray-600 hover:bg-gray-500'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                  ]"
                />
              </div>
            </div>

            <!-- Article Content -->
            <div :class="themeStore.isDark ? 'prose prose-invert prose-emerald' : 'prose prose-emerald'" class="max-w-none">
              <div
                class="space-y-4 leading-relaxed"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                <p v-for="(paragraph, index) in formattedContent" :key="index" class="text-lg">
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <!-- Back to News -->
            <div
              class="mt-12 pt-8"
              :class="themeStore.isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'"
            >
              <NuxtLink
                to="/news"
                class="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all hover:border-emerald-500"
                :class="themeStore.isDark
                  ? 'border border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'"
              >
                <Icon name="ph:arrow-left" class="h-5 w-5" />
                {{ data.detail.backToNews }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- Not Found -->
    <template v-else>
      <section
        class="flex min-h-[60vh] items-center justify-center py-20"
        :class="themeStore.isDark ? '' : 'bg-gray-50'"
      >
        <div class="text-center">
          <Icon
            name="ph:newspaper"
            class="mx-auto mb-6 h-24 w-24"
            :class="themeStore.isDark ? 'text-gray-600' : 'text-gray-400'"
          />
          <h1
            class="mb-4 text-3xl font-bold"
            :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
          >{{ data.detail.notFound }}</h1>
          <p
            class="mb-8"
            :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'"
          >{{ data.detail.notFoundDesc }}</p>
          <NuxtLink
            to="/news"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-all hover:bg-emerald-600"
          >
            <Icon name="ph:arrow-left" class="h-5 w-5" />
            {{ data.detail.backToNews }}
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>
