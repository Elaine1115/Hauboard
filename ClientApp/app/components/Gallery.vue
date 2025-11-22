<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

// Pagination settings - 4 rows × 4 columns = 16 images per page
const imagesPerPage = 16
const currentPage = ref(1)

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

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredImages.value.length / imagesPerPage))

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * imagesPerPage
  const end = start + imagesPerPage
  return filteredImages.value.slice(start, end)
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

// Reset page when category changes
watch(selectedCategory, () => {
  currentPage.value = 1
})

// Watch for URL query parameter changes
watch(() => route.query.category, (newCategory) => {
  if (newCategory && typeof newCategory === 'string') {
    selectedCategory.value = newCategory
  } else {
    selectedCategory.value = 'all'
  }
}, { immediate: true })
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
    <LightGalleryGrid
      :images="paginatedImages"
      :show-alt="true"
      aspect-ratio="square"
      grid-cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    />

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
    <div v-if="filteredImages.length === 0" class="text-center py-20">
      <p class="text-gray-400 text-lg">No products found in this category.</p>
    </div>
  </div>
</template>
