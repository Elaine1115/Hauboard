<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const { locale } = useI18n()

// Sample images data - you can replace this with your actual data
const images = ref([
  {
    src: '/assets/images/products/0K8-陶瓷米-TOPMATT.jpg',
    alt: '0K8-陶瓷米-TOPMATT',
  },
  {
    src: '/assets/images/products/797-石墨灰-TOPMATT.jpg',
    alt: '797-石墨灰-TOPMATT',
  },
  {
    src: '/assets/images/products/AP2-陶瓷可可-TOPMATT.jpg',
    alt: 'AP2-陶瓷可可-TOPMATT',
  },
  {
    src: '/assets/images/products/37M-原切枯木-LARIX.jpg',
    alt: '37M-原切枯木-LARIX',
  },
  {
    src: '/assets/images/products/43M-原切相思木-LARIX.jpg',
    alt: '43M-原切相思木-LARIX',
  },
  {
    src: '/assets/images/products/D17-龐貝原杉-EVO.jpg',
    alt: 'D17-龐貝原杉-EVO',
  },
  {
    src: '/assets/images/products/D18-龐貝棕杉-EVO.jpg',
    alt: 'D18-龐貝棕杉-EVO',
  },
  {
    src: '/assets/images/products/D19-龐貝黑杉-EVO.jpg',
    alt: 'D19-龐貝黑杉-EVO',
  },
])

const galleryContainer = ref<HTMLElement | null>(null)
let galleryInstance: any = null

// SEO
useSeoMeta({
  title: locale.value === 'zh' ? '虛擬設計 - Hauboard' : 'Virtual Design - Hauboard',
  description: locale.value === 'zh' ? '探索我們的虛擬設計作品集' : 'Explore our virtual design portfolio',
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
            {{ locale === 'zh' ? '虛擬設計' : 'Virtual Design' }}
          </h1>
          <p class="text-lg text-gray-300 md:text-xl">
            {{ locale === 'zh' ? '探索我們的虛擬設計作品集' : 'Explore our virtual design portfolio' }}
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
            v-for="(image, index) in images"
            :key="index"
            :href="image.src"
            :data-src="image.src"
            class="gallery-item group relative block overflow-hidden rounded-lg cursor-pointer"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-gray-800">
              <img
                :src="image.src"
                :alt="image.alt"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <p class="text-white text-sm font-medium">{{ image.alt }}</p>
                </div>
              </div>
              <!-- Zoom Icon -->
              <div class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        <!-- Empty State -->
        <div v-if="images.length === 0" class="text-center py-20">
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
