<script setup lang="ts">
// Start with false to avoid SSR mismatch
const isLoading = ref(false)
const isInitialLoad = ref(true)

onMounted(() => {
  // Remove static loader when Vue hydrates
  const staticLoader = document.getElementById('static-loader')
  if (staticLoader) {
    staticLoader.classList.add('fade-out')
    setTimeout(() => staticLoader.remove(), 300)
  }

  // Show loader immediately on mount for initial load
  if (isInitialLoad.value) {
    isLoading.value = false // Don't show Vue loader on initial load - static loader handles it
    isInitialLoad.value = false
  }

  const nuxtApp = useNuxtApp()

  // Show loader during page navigation
  nuxtApp.hook('page:start', () => {
    isLoading.value = true
  })

  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  })
})
</script>

<template>
  <Transition
    leave-active-class="transition-opacity duration-300"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950"
    >
      <div class="flex flex-col items-center gap-4">
        <!-- Spinner -->
        <div class="relative h-16 w-16">
          <div class="absolute inset-0 rounded-full border-4 border-emerald-500/30"></div>
          <div class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-500"></div>
        </div>
        <!-- Loading text -->
        <p class="text-emerald-400 text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  </Transition>
</template>
