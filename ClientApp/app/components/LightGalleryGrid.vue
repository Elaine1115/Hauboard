<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

interface GalleryImage {
  src: string
  alt?: string
}

type ImageInput = GalleryImage | string

interface Props {
  images: ImageInput[]
  showAlt?: boolean
  aspectRatio?: 'square' | '4/3'
  gridCols?: string
}

const props = withDefaults(defineProps<Props>(), {
  showAlt: false,
  aspectRatio: 'square',
  gridCols: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
})

// Normalize images to always have src and alt
const normalizedImages = computed(() => {
  return props.images.map(img => {
    if (typeof img === 'string') {
      return { src: img, alt: '' }
    }
    return img
  })
})

const galleryContainer = ref<HTMLElement | null>(null)
let galleryInstance: any = null

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

    // Add lg-on class to html when gallery opens
    galleryContainer.value?.addEventListener('lgBeforeOpen', () => {
      document.documentElement.classList.add('lg-on')
    })

    // Remove lg-on class from html when gallery closes
    galleryContainer.value?.addEventListener('lgAfterClose', () => {
      document.documentElement.classList.remove('lg-on')
    })
  }
}

const destroyGallery = () => {
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
    galleryInstance = null
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

// Watch for images changes to refresh gallery
watch(() => props.images, async () => {
  await refreshGallery()
}, { deep: true })

onMounted(() => {
  initGallery()
})

onBeforeUnmount(() => {
  destroyGallery()
})

const aspectClass = computed(() => {
  return props.aspectRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-square'
})
</script>

<template>
  <div ref="galleryContainer" :class="['grid gap-4', gridCols]">
    <a
      v-for="(image, index) in normalizedImages"
      :key="index"
      :href="image.src"
      :data-src="image.src"
      class="gallery-item group relative overflow-hidden rounded-lg cursor-pointer"
    >
      <div :class="['relative overflow-hidden bg-gray-800', aspectClass]">
        <img
          :src="image.src"
          :alt="image.alt || ''"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <!-- Alt text badge -->
        <div v-if="showAlt && image.alt" class="absolute bottom-3 left-3">
          <span class="inline-block px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm font-medium shadow-lg">
            {{ image.alt }}
          </span>
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
</template>

<style scoped>
.gallery-item {
  display: block;
}
</style>
