<script setup lang="ts">
const isLoading = ref(false)

// Listen to page navigation events
if (import.meta.client) {
  const nuxtApp = useNuxtApp()

  nuxtApp.hook('page:start', () => {
    isLoading.value = true
  })

  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm"
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
