<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getMenuItems } from '~/config/menu'
import productsData from '../../i18n/locales/products.json'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const themeStore = useThemeStore()

const products = computed(() => {
  const langData = productsData[locale.value as 'zh' | 'en']
  return {
    ...langData,
    hero: {
      ...langData.hero,
      ...productsData.common.hero
    }
  }
})

useSeoMeta({
  title: computed(() => products.value.seo.title),
  ogTitle: computed(() => products.value.seo.title),
  description: computed(() => products.value.seo.description),
  ogDescription: computed(() => products.value.seo.description),
})

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

// Function to update category via URL
const setCategory = (category: string) => {
  if (category === 'all') {
    router.push({ query: {} })
  } else {
    router.push({ query: { category } })
  }
}

const filteredImages = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value.images
  }
  return products.value.images.filter((img: any) => img.category === selectedCategory.value)
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredImages.value.length / imagesPerPage))

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * imagesPerPage
  const end = start + imagesPerPage
  return filteredImages.value.slice(start, end)
})

const onPageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

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
  <main class="min-h-screen">
    <!-- Hero Section -->
    <PageHero
      :title="products.hero.title"
      :subtitle="products.hero.subtitle"
      :background-image="products.hero.backgroundImage"
    />

    <!-- Gallery Section -->
    <SectionContainer
      :title="products.gallery.title"
      :subtitle="products.gallery.subtitle"
    >
      <!-- Category Filters -->
      <div class="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          @click="setCategory('all')"
          :class="[
            'px-6 py-3 rounded-lg font-medium transition-all duration-300',
            selectedCategory === 'all'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
              : themeStore.isDark
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
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
              : themeStore.isDark
                ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Gallery Grid -->
      <ClientOnly>
        <LightGalleryGrid
          :images="paginatedImages"
          :show-alt="true"
          aspect-ratio="square"
          grid-cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      </ClientOnly>

      <!-- Pagination -->
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="onPageChange"
      />

      <!-- Empty State -->
      <div v-if="filteredImages.length === 0" class="text-center py-20">
        <p class="text-lg" :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'">No products found in this category.</p>
      </div>
    </SectionContainer>
  </main>
</template>
