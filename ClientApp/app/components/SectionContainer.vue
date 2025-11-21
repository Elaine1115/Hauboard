
<template>
  <section :class="['py-20 md:py-28 relative', bgClass]">
    <div class="mx-auto max-w-7xl px-4 md:px-6">
      <div v-if="title || subtitle" class="text-center mb-16 md:mb-20">
        <h2 v-if="title" class="text-4xl md:text-5xl font-bold text-white mb-6 relative inline-block">
          {{ title }}
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 rounded-full"></div>
        </h2>
        <p v-if="subtitle" class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-8 leading-relaxed">
          {{ subtitle }}
        </p>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  bgClass?: string
}>()
</script>
