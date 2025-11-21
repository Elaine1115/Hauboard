<template>
  <div :class="['grid gap-8 items-center', reverse ? 'md:grid-cols-2' : 'md:grid-cols-2']">
    <div :class="reverse ? 'md:order-2' : ''">
      <h3 v-if="title" class="text-2xl md:text-3xl font-bold text-white mb-4">{{ title }}</h3>
      <div class="text-gray-300 leading-relaxed space-y-4">
        <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
      </div>
    </div>
    <div :class="reverse ? 'md:order-1' : ''">
      <img
        v-if="image"
        :src="image"
        :alt="title || ''"
        class="w-full h-auto rounded-xl object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  paragraphs: string[]
  image?: string
  reverse?: boolean
}>()
</script>
