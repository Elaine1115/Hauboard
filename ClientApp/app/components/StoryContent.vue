<script setup lang="ts">
const themeStore = useThemeStore()

interface Story {
  image: string
  title: string
  description: string
}

interface Props {
  stories: Story[]
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-12 md:space-y-16">
    <div
      v-for="(story, index) in stories"
      :key="index"
      class="group relative"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        :class="index % 2 === 1 ? 'md:grid-flow-dense' : ''"
      >
        <!-- Image -->
        <div
          class="relative overflow-hidden rounded-2xl"
          :class="index % 2 === 1 ? 'md:col-start-2' : ''"
        >
          <div
            class="aspect-[4/3] relative backdrop-blur-sm rounded-2xl overflow-hidden group-hover:border-emerald-500/50 transition-all duration-300"
            :class="themeStore.isDark
              ? 'bg-gray-800/50 border border-gray-700/40'
              : 'bg-white/50 border border-gray-200'"
          >
            <img
              :src="story.image"
              :alt="story.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <!-- Text Content -->
        <div
          class="relative"
          :class="index % 2 === 1 ? 'md:col-start-1' : ''"
        >
          <div
            class="backdrop-blur-sm rounded-2xl p-8 md:p-10 group-hover:border-emerald-500/30 transition-all duration-300"
            :class="themeStore.isDark
              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30'
              : 'bg-white/80 border border-gray-200 shadow-lg'"
          >
            <div class="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
            <div class="relative">
              <h3
                class="text-2xl md:text-3xl font-bold mb-4 transition-colors group-hover:text-emerald-500"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ story.title }}
              </h3>
              <p
                class="text-lg leading-relaxed"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                {{ story.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
