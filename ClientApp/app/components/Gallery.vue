<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { getMenuItems } from '~/config/menu'

interface GalleryImage {
  src: string
  thumb: string
  alt: string
  category: string
}

interface Props {
  images: GalleryImage[]
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

// Generate categories from menu.ts product children
const categories = computed(() => {
  const menuItems = getMenuItems(locale.value)
  const productMenu = menuItems.find(item => item.path === '/products')

  if (productMenu && productMenu.children) {
    return productMenu.children.map(child => ({
      label: child.label,
      value: new URLSearchParams(child.path.split('?')[1]).get('category') || ''
    }))
  }

  return []
})

const selectedCategory = ref('all')
const galleryContainer = ref<HTMLElement | null>(null)
let galleryInstance: any = null

// Function to update category via URL (let the watch handle selectedCategory)
const setCategory = (category: string) => {
  if (category === 'all') {
    router.push({ query: {} })
  } else {
    router.push({ query: { category } })
  }
}

const filteredImages = computed(() => {
  if (selectedCategory.value === 'all') {
    return props.images
  }
  return props.images.filter(img => img.category === selectedCategory.value)
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
      // Close the gallery if it's open
      galleryInstance.closeGallery()
      // Wait a bit for the close animation
      await new Promise(resolve => setTimeout(resolve, 150))
      // Destroy the instance completely
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
  await nextTick()
  await initGallery()
}

// Watch for category changes to refresh gallery
watch(selectedCategory, async () => {
  await refreshGallery()
})

// Watch for URL query parameter changes
watch(() => route.query.category, (newCategory) => {
  if (newCategory && typeof newCategory === 'string') {
    selectedCategory.value = newCategory
  } else {
    selectedCategory.value = 'all'
  }
}, { immediate: true })

onMounted(() => {
  initGallery()
})

onBeforeUnmount(() => {
  if (galleryInstance) {
    galleryInstance.destroy()
  }
})
</script>

<template>
  <div class="product-gallery">
    <!-- Category Filters -->
    <div class="flex flex-wrap gap-3 mb-8 justify-center">
      <button
        @click="setCategory('all')"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-300',
          selectedCategory === 'all'
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
        ]"
      >
        {{ t('common.allProducts') }}
      </button>
      <button
        v-for="cat in categories"
        :key="cat.value"
        @click="setCategory(cat.value)"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-300',
          selectedCategory === cat.value
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Gallery Grid -->
    <div ref="galleryContainer" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <a
        v-for="(image, index) in filteredImages"
        :key="index"
        :href="image.src"
        :data-src="image.src"
        class="gallery-item group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
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
      </a>
    </div>

    <!-- Empty State -->
    <div v-if="filteredImages.length === 0" class="text-center py-20">
      <p class="text-gray-400 text-lg">No products found in this category.</p>
    </div>
  </div>
</template>

<style scoped>
.gallery-item {
  display: block;
}
</style>
