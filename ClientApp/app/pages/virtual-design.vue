<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
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

const galleryContainer = ref<HTMLElement | null>(null)
let galleryInstance: any = null

// SEO
useSeoMeta({
  title: computed(() => data.value.seo.title),
  description: computed(() => data.value.seo.description),
})

const initGallery = async () => {
  if (galleryContainer.value && !galleryInstance) {
    // Import CSS
    await import('lightgallery/css/lightgallery.css')
    await import('lightgallery/css/lg-zoom.css')
    await import('lightgallery/css/lg-rotate.css')
    await import('lightgallery/css/lg-fullscreen.css')
    await import('lightgallery/css/lg-thumbnail.css')
    await import('lightgallery/css/lg-autoplay.css')

    // Dynamically import lightGallery and plugins
    const lightGalleryModule = await import('lightgallery')
    const lgZoom = await import('lightgallery/plugins/zoom')
    const lgRotate = await import('lightgallery/plugins/rotate')
    const lgFullscreen = await import('lightgallery/plugins/fullscreen')
    const lgThumbnail = await import('lightgallery/plugins/thumbnail')
    const lgAutoplay = await import('lightgallery/plugins/autoplay')

    const lightGallery = lightGalleryModule.default

    galleryInstance = lightGallery(galleryContainer.value, {
      speed: 500,
      download: true,
      counter: true,
      selector: '.gallery-item',
      mode: 'lg-fade',
      dynamic: false,
      plugins: [
        lgZoom.default,
        lgRotate.default,
        lgFullscreen.default,
        lgThumbnail.default,
        lgAutoplay.default
      ],
      // Zoom settings
      scale: 1,
      actualSize: true,
      // Rotate settings
      rotateLeft: true,
      rotateRight: true,
      flipHorizontal: true,
      flipVertical: true,
      // Thumbnail settings
      thumbnail: true,
      thumbWidth: 100,
      thumbHeight: '80px',
      thumbMargin: 5,
      // Autoplay settings
      autoplay: true,
      slideShowAutoplay: false,
      slideShowInterval: 3000,
      progressBar: true
    })
  }
}

const refreshGallery = async () => {
  if (galleryInstance) {
    try {
      galleryInstance.closeGallery()
      await new Promise(resolve => setTimeout(resolve, 150))
      galleryInstance.destroy(true)

      const lgElements = document.querySelectorAll('.lg-container, .lg-backdrop, .lg-outer, .lg-on')
      lgElements.forEach(el => el.remove())
      document.body.classList.remove('lg-on')
    } catch (e) {
      console.error('Error destroying gallery:', e)
    }
    galleryInstance = null
  }
  await nextTick()
  await initGallery()
}

// Watch for page changes to refresh gallery
watch(currentPage, async () => {
  await refreshGallery()
})

onMounted(() => {
  initGallery()
})

onBeforeUnmount(() => {
  if (galleryInstance) {
    try {
      galleryInstance.closeGallery()
      galleryInstance.destroy(true)

      // Manually remove any leftover lightGallery elements from DOM
      const lgElements = document.querySelectorAll('.lg-container, .lg-backdrop, .lg-outer, .lg-on')
      lgElements.forEach(el => el.remove())

      // Remove lg-on class from body
      document.body.classList.remove('lg-on')
    } catch (e) {
      console.error('Error destroying gallery:', e)
    }
  }
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
        <div ref="galleryContainer" class="gallery-grid">
          <a
            v-for="(src, index) in paginatedImages"
            :key="index"
            :href="src"
            :data-src="src"
            class="gallery-item group relative block overflow-hidden rounded-lg cursor-pointer"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-gray-800">
              <img
                :src="src"
                alt=""
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <!-- Zoom Icon -->
              <div class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </a>
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
        <div v-if="allImages.length === 0" class="text-center py-20">
          <p class="text-gray-400 text-lg">No images available.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Responsive Grid Layout - Similar to lightgallery.js demo */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .gallery-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
  }
}

.gallery-item {
  display: block;
}
</style>
