<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const { locale } = useI18n()

// Generate visible page numbers
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage

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

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const prevPage = () => goToPage(props.currentPage - 1)
const nextPage = () => goToPage(props.currentPage + 1)

// Page info text
const pageInfo = computed(() => {
  if (locale.value === 'zh') {
    return `第 ${props.currentPage} 頁，共 ${props.totalPages} 頁`
  }
  return `Page ${props.currentPage} of ${props.totalPages}`
})
</script>

<template>
  <div v-if="totalPages > 1" class="mt-12">
    <!-- Pagination Controls -->
    <div class="flex items-center justify-center gap-2">
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
    <div class="text-center mt-4 text-gray-400 text-sm">
      {{ pageInfo }}
    </div>
  </div>
</template>
