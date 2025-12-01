<script setup lang="ts">
import { ref, computed } from 'vue'
import virtualDesignData from '../../i18n/locales/virtual-design.json'

const { locale } = useI18n()
const themeStore = useThemeStore()

// Get data based on locale
const data = computed(() => {
  const lang = locale.value as 'zh' | 'en'
  const suffix = `_${lang}`

  return {
    seo: {
      title: virtualDesignData.seo[`title${suffix}` as keyof typeof virtualDesignData.seo] as string,
      description: virtualDesignData.seo[`description${suffix}` as keyof typeof virtualDesignData.seo] as string
    },
    hero: {
      title: virtualDesignData.hero[`title${suffix}` as keyof typeof virtualDesignData.hero] as string,
      subtitle: virtualDesignData.hero[`subtitle${suffix}` as keyof typeof virtualDesignData.hero] as string
    },
    images: virtualDesignData.common.images
  }
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
  <div class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="data.hero.title"
      :subtitle="data.hero.subtitle"
      background-image="/assets/gradient.png"
    />

    <!-- Gallery Section -->
    <section
      class="py-16 md:py-24"
      :class="themeStore.isDark ? '' : 'bg-gray-50'"
    >
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
          <p class="text-lg" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">No images available.</p>
        </div>
      </div>
    </section>
  </div>
</template>
