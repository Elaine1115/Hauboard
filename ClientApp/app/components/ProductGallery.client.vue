<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

interface GalleryImage {
  src: string
  thumb: string
  alt: string
  category: string
}

interface Props {
  images: GalleryImage[]
  categories: { label: string; value: string }[]
}

const props = defineProps<Props>()

const selectedCategory = ref('all')
const galleryContainer = ref<HTMLElement | null>(null)
let galleryInstance: any = null

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

    // Dynamically import lightGallery
    const lightGalleryModule = await import('lightgallery')
    const lightGallery = lightGalleryModule.default

    galleryInstance = lightGallery(galleryContainer.value, {
      speed: 500,
      download: true,
      counter: true,
      selector: '.gallery-item',
      mode: 'lg-fade'
    })
  }
}

const refreshGallery = async () => {
  if (galleryInstance) {
    galleryInstance.destroy()
    galleryInstance = null
  }
  await nextTick()
  await initGallery()
}

watch(selectedCategory, () => {
  refreshGallery()
})

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
        @click="selectedCategory = 'all'"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-300',
          selectedCategory === 'all'
            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
        ]"
      >
        All Products
      </button>
      <button
        v-for="cat in categories"
        :key="cat.value"
        @click="selectedCategory = cat.value"
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
