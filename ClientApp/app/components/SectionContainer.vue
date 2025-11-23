<script setup lang="ts">
const themeStore = useThemeStore()

defineProps<{
  title?: string
  subtitle?: string
  bgClass?: string
}>()
</script>

<template>
  <section :class="['py-20 md:py-28 relative', bgClass, !bgClass && !themeStore.isDark ? 'bg-gray-50' : '']">
    <div class="mx-auto max-w-7xl px-4 md:px-6">
      <div v-if="title || subtitle" class="text-center mb-16 md:mb-20">
        <h2
          v-if="title"
          class="text-4xl md:text-5xl font-bold mb-6 relative inline-block"
          :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
        >
          {{ title }}
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 rounded-full"></div>
        </h2>
        <p
          v-if="subtitle"
          class="text-lg md:text-xl max-w-3xl mx-auto mt-8 leading-relaxed"
          :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
        >
          {{ subtitle }}
        </p>
      </div>
      <slot />
    </div>
  </section>
</template>
