<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

interface GalleryImage {
  src: string
  alt?: string
  width?: number
  height?: number
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

const galleryId = ref(`gallery-${Math.random().toString(36).substr(2, 9)}`)
let lightbox: PhotoSwipeLightbox | null = null

const initGallery = () => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }

  lightbox = new PhotoSwipeLightbox({
    gallery: `#${galleryId.value}`,
    children: 'a.gallery-item',
    pswpModule: () => import('photoswipe'),

    // UI options
    bgOpacity: 0.9,
    showHideAnimationType: 'zoom',

    // Zoom options
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 2,
    maxZoomLevel: 4,

    // Padding around image
    padding: { top: 20, bottom: 20, left: 20, right: 20 },

    // Enable click to close
    clickToCloseNonZoomable: true,

    // Preload nearby images
    preload: [1, 2]
  })

  // Dynamically resolve image dimensions to preserve aspect ratio
  lightbox.addFilter('itemData', (itemData) => {
    const img = new Image()
    img.src = itemData.src as string

    // If dimensions not set, try to get from loaded image or use placeholder
    if (!itemData.width || !itemData.height) {
      // Check if image is already cached/loaded
      if (img.naturalWidth && img.naturalHeight) {
        itemData.width = img.naturalWidth
        itemData.height = img.naturalHeight
      } else {
        // Use square placeholder, will be updated when image loads
        itemData.width = 1000
        itemData.height = 1000
      }
    }
    return itemData
  })

  // Update dimensions when slide content is loaded
  lightbox.on('contentLoad', (e) => {
    const { content } = e
    if (content.type === 'image') {
      const img = content.element as HTMLImageElement
      if (img) {
        img.onload = () => {
          if (img.naturalWidth && img.naturalHeight) {
            content.width = img.naturalWidth
            content.height = img.naturalHeight
            content.slide?.updateContentSize(true)
          }
        }
        // If already loaded
        if (img.complete && img.naturalWidth && img.naturalHeight) {
          content.width = img.naturalWidth
          content.height = img.naturalHeight
        }
      }
    }
  })

  // Add download button
  lightbox.on('uiRegister', function() {
    lightbox!.pswp!.ui!.registerElement({
      name: 'download-button',
      order: 8,
      isButton: true,
      tagName: 'a',
      html: {
        isCustomSVG: true,
        inner: '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
        outlineID: 'pswp__icn-download'
      },
      onInit: (el, pswp) => {
        el.setAttribute('download', '')
        el.setAttribute('target', '_blank')
        el.setAttribute('rel', 'noopener')

        pswp.on('change', () => {
          el.setAttribute('href', pswp.currSlide!.data.src || '')
        })
      }
    })
  })

  lightbox.init()
}

const destroyGallery = () => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
}

// Watch for images changes to refresh gallery
watch(() => props.images, async () => {
  await nextTick()
  initGallery()
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
  <div :id="galleryId" :class="['grid gap-4', gridCols]">
    <a
      v-for="(image, index) in normalizedImages"
      :key="index"
      :href="image.src"
      class="gallery-item group relative overflow-hidden rounded-lg cursor-pointer"
      target="_blank"
      rel="noreferrer"
    >
      <div :class="['relative overflow-hidden bg-gray-800', aspectClass]">
        <img
          :src="image.src"
          :alt="image.alt || ''"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <!-- Alt text badge -->
        <div v-if="showAlt && image.alt" class="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]">
          <span class="inline-block px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs md:text-sm font-medium shadow-lg break-words">
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
