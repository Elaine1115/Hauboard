<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import newsData from '../../../i18n/locales/news.json'

const route = useRoute()
const { locale } = useI18n()

// Get data based on locale
const data = computed(() => {
  return locale.value === 'zh' ? newsData.zh : newsData.en
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
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
    <!-- News Detail -->
    <template v-if="newsItem">
      <!-- Content -->
      <section class="py-12 md:py-16">
        <div class="container mx-auto px-4 md:px-6">
          <article class="mx-auto max-w-3xl">
            <!-- Header -->
            <header class="mb-8 rounded-2xl border border-gray-800 bg-gray-900/80 p-6 backdrop-blur-sm md:p-8">
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
              <h1 class="mb-4 text-3xl font-bold text-white md:text-4xl">
                {{ newsItem.title }}
              </h1>

              <!-- Meta -->
              <div class="flex items-center gap-4 text-gray-400">
                <div class="flex items-center gap-2">
                  <Icon name="ph:calendar" class="h-5 w-5" />
                  <time :datetime="newsItem.date">{{ formatDate(newsItem.date) }}</time>
                </div>
              </div>
            </header>

            <!-- Image Carousel -->
            <div v-if="newsImages.length > 0" class="mb-8">
              <div class="relative overflow-hidden rounded-2xl bg-gray-800">
                <!-- Image -->
                <img
                  :src="newsImages[currentImageIndex]"
                  :alt="`${newsItem.title} - ${currentImageIndex + 1}`"
                  class="w-full h-auto aspect-video object-cover"
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
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  ]"
                />
              </div>
            </div>

            <!-- Article Content -->
            <div class="prose prose-invert prose-emerald max-w-none">
              <div class="space-y-4 text-gray-300 leading-relaxed">
                <p v-for="(paragraph, index) in formattedContent" :key="index" class="text-lg">
                  {{ paragraph }}
                </p>
              </div>
            </div>

            <!-- Back to News -->
            <div class="mt-12 border-t border-gray-800 pt-8">
              <NuxtLink
                to="/news"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-white transition-all hover:border-emerald-500 hover:bg-gray-700"
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
      <section class="flex min-h-[60vh] items-center justify-center py-20">
        <div class="text-center">
          <Icon name="ph:newspaper" class="mx-auto mb-6 h-24 w-24 text-gray-600" />
          <h1 class="mb-4 text-3xl font-bold text-white">{{ data.detail.notFound }}</h1>
          <p class="mb-8 text-gray-400">{{ data.detail.notFoundDesc }}</p>
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
